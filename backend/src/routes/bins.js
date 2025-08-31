const express = require('express');
const Joi = require('joi');
const logger = require('../config/logger');
const dbConfig = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const binSchema = Joi.object({
  bin_code: Joi.string().max(50).required(),
  user_id: Joi.string().uuid().required(),
  location: Joi.string()
});

const updateBinSchema = Joi.object({
  location: Joi.string()
});

const assignBinSchema = Joi.object({
  user_id: Joi.string().uuid().required()
});

// Get all bins (admin/operator only)
router.get('/', async (req, res) => {
  try {
    const adminClient = dbConfig.getAdminClient();
    const { data, error } = await adminClient
      .from('bins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching bins:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch bins',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data,
      count: data.length
    });
  } catch (error) {
    logger.error('Unexpected error in GET /bins:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get bin by ID
router.get('/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { data, error } = await adminClient
      .from('bins')
      .select('*')
      .eq('bin_id', binId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Bin not found'
        });
      }
      logger.error('Error fetching bin:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch bin',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in GET /bins/:binId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get bins by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { data, error } = await adminClient
      .from('bins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching bins for user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch bins for user',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data,
      count: data.length
    });
  } catch (error) {
    logger.error('Unexpected error in GET /bins/user/:userId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create new bin
router.post('/', async (req, res) => {
  try {
    const { error, value } = binSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: insertError } = await adminClient
      .from('bins')
      .insert([value])
      .select('*')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({
          status: 'error',
          message: 'Bin with this code already exists'
        });
      }
      if (insertError.code === '23503') {
        return res.status(400).json({
          status: 'error',
          message: 'Referenced user does not exist'
        });
      }
      logger.error('Error creating bin:', insertError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create bin',
        error: insertError.message
      });
    }

    // Audit log (best-effort)
    try {
      await dbConfig.getAdminClient()
        .from('audit_logs')
        .insert([{ action: 'bin_create', entity: 'bin', entity_id: data.bin_id, details: { bin_code: data.bin_code, user_id: data.user_id } }]);
    } catch {}
    logger.info(`Bin created successfully: ${data.id}`);
    res.status(201).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in POST /bins:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Update bin
router.put('/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const { error, value } = updateBinSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: updateError } = await adminClient
      .from('bins')
      .update(value)
      .eq('bin_id', binId)
      .select('*')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Bin not found'
        });
      }
      logger.error('Error updating bin:', updateError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update bin',
        error: updateError.message
      });
    }

    logger.info(`Bin updated successfully: ${binId}`);
    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in PUT /bins/:binId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Assign/Reassign a bin to a host (user_id)
router.post('/:binId/assign', async (req, res) => {
  try {
    const { binId } = req.params;
    const { error, value } = assignBinSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();

    // Ensure bin exists
    const { data: existing, error: fetchErr } = await adminClient
      .from('bins')
      .select('bin_id')
      .eq('bin_id', binId)
      .single();
    if (fetchErr) {
      return res.status(404).json({ status: 'error', message: 'Bin not found' });
    }

    const { data, error: updateError } = await adminClient
      .from('bins')
      .update({ user_id: value.user_id })
      .eq('bin_id', binId)
      .select('*')
      .single();

    if (updateError) {
      if (updateError.code === '23503') {
        return res.status(400).json({ status: 'error', message: 'Referenced user does not exist' });
      }
      logger.error('Error assigning bin:', updateError);
      return res.status(500).json({ status: 'error', message: 'Failed to assign bin', error: updateError.message });
    }

    // Audit log (best-effort)
    try {
      await adminClient
        .from('audit_logs')
        .insert([{ action: 'bin_assign', entity: 'bin', entity_id: binId, details: { user_id: value.user_id } }]);
    } catch {}
    logger.info(`Bin ${binId} assigned to ${value.user_id}`);
    return res.json({ status: 'success', data });
  } catch (error) {
    logger.error('Unexpected error in POST /bins/:binId/assign:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Delete bin
router.delete('/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { error } = await adminClient
      .from('bins')
      .delete()
      .eq('bin_id', binId);

    if (error) {
      logger.error('Error deleting bin:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete bin',
        error: error.message
      });
    }

    logger.info(`Bin deleted successfully: ${binId}`);
    res.json({
      status: 'success',
      message: 'Bin deleted successfully'
    });
  } catch (error) {
    logger.error('Unexpected error in DELETE /bins/:binId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get bin summary statistics
router.get('/:binId/stats', async (req, res) => {
  try {
    const { binId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { data, error } = await adminClient
      .from('bin_summary_stats')
      .select('*')
      .eq('bin_id', binId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Bin not found'
        });
      }
      logger.error('Error fetching bin stats:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch bin statistics',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in GET /bins/:binId/stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 