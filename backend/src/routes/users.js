const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const dbConfig = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Check if JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is not set');
  throw new Error('JWT_SECRET environment variable is required');
}

// --- Existing Schemas ---
// ... (keep existing Joi schemas)

// --- New Routes ---

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password, role = 'host' } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Please enter all fields' 
    });
  }

  try {
    const supabase = dbConfig.getAdminClient();
    
    // Check for existing user
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (checkError) throw checkError;
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username: username,
        email: email,
        password_hash: hashedPassword,
        role: role
      })
      .select('user_id, username, email, role')
      .single();
      
    if (insertError) throw insertError;

    res.status(201).json({
      status: 'success',
      data: newUser
    });

  } catch (err) {
    logger.error('Error in /register:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Please provide email and password' 
    });
  }

  try {
    const supabase = dbConfig.getAdminClient();
    
    // Check for user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (userError) throw userError;
    if (!users || users.length === 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }
    
    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Return JWT
    const payload = {
      user: {
        id: user.user_id,
        role: user.role,
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not configured');
      return res.status(500).json({
        status: 'error',
        message: 'Server configuration error'
      });
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          logger.error('JWT signing error:', err);
          return res.status(500).json({
            status: 'error',
            message: 'Server error'
          });
        }
        res.json({
          status: 'success',
          data: { token }
        });
      }
    );
  } catch (err) {
    logger.error('Error in /login:', err);
    res.status(500).send('Server error');
  }
});


// --- Existing Routes ---

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const adminClient = dbConfig.getAdminClient();
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching users:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch users',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data,
      count: data.length
    });
  } catch (error) {
    logger.error('Unexpected error in GET /users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const supabase = dbConfig.getAdminClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, username, email, role, display_name, contact_phone, contact_address, created_at, updated_at')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      logger.error('Error fetching user profile:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user profile'
      });
    }
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: user
    });

  } catch (err) {
    logger.error('Error in /me:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      logger.error('Error fetching user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in GET /users/:userId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: insertError } = await adminClient
      .from('users')
      .insert([value])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }
      logger.error('Error creating user:', insertError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create user',
        error: insertError.message
      });
    }

    logger.info(`User created successfully: ${data.user_id}`);
    res.status(201).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in POST /users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Admin-create new user through Supabase Auth Admin API, then sync to profiles
router.post('/admin-create', async (req, res) => {
  try {
    const { error: validationError, value } = adminCreateUserSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: validationError.details
      });
    }

    const { email, password, role, display_name, contact_phone, contact_address } = value;

    const adminClient = dbConfig.getAdminClient();

    // 1) Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        display_name,
        contact_phone,
        contact_address
      }
    });

    if (authError) {
      logger.error('Error creating auth user:', authError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create auth user',
        error: authError.message
      });
    }

    const createdUser = authData.user;

    // 2) Upsert into users table
    const { data: profileData, error: profileError } = await adminClient
      .from('users')
      .upsert([
        {
          user_id: createdUser.id,
          role,
          display_name
        }
      ], { onConflict: 'user_id' })
      .select()
      .single();

    if (profileError) {
      // If users table is protected or schema differs, return auth user but warn
      logger.warn('Auth user created, but failed to upsert users table:', profileError);
      return res.status(201).json({
        status: 'partial_success',
        message: 'Auth user created, but failed to sync profile',
        data: { auth_user: createdUser },
        warning: profileError.message
      });
    }

    logger.info(`Admin-created user successfully: ${createdUser.id}`);
    return res.status(201).json({
      status: 'success',
      data: {
        auth_user: createdUser,
        profile: profileData
      }
    });
  } catch (error) {
    logger.error('Unexpected error in POST /users/admin-create:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Update user
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { error, value } = updateUserSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: updateError } = await adminClient
      .from('users')
      .update(value)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      logger.error('Error updating user:', updateError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update user',
        error: updateError.message
      });
    }

    logger.info(`User updated successfully: ${userId}`);
    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in PUT /users/:userId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { error } = await adminClient
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      logger.error('Error deleting user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete user',
        error: error.message
      });
    }

    logger.info(`User deleted successfully: ${userId}`);
    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Unexpected error in DELETE /users/:userId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});



module.exports = router; 