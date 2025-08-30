const express = require('express');
const Joi = require('joi');
const logger = require('../config/logger');
const dbConfig = require('../config/database');
const deviceAuth = require('../middleware/deviceAuth');

const router = express.Router();

// Validation schemas
const eventSchema = Joi.object({
  bin_id: Joi.string().uuid().required(),
  bin_code: Joi.string().optional(),
  location: Joi.string().optional(),
  timestamp_utc: Joi.date().iso().required(),
  fill_level_pct: Joi.number().min(0).max(100).integer(),
  weight_kg_total: Joi.number().positive(),
  weight_kg_delta: Joi.number().optional(),
  battery_pct: Joi.number().min(0).max(100).integer(),
  categories: Joi.object().optional(),
  ai_model_id: Joi.string().optional(),
  ai_confidence_avg: Joi.number().min(0).max(1).optional(),
  payload_json: Joi.object().required(),
  hv_count: Joi.number().integer().min(0).optional(),
  lv_count: Joi.number().integer().min(0).optional(),
  org_count: Joi.number().integer().min(0).optional()
});

const updateEventSchema = Joi.object({
  fill_level_pct: Joi.number().min(0).max(100).integer(),
  weight_kg_total: Joi.number().positive(),
  weight_kg_delta: Joi.number().optional(),
  battery_pct: Joi.number().min(0).max(100).integer(),
  ai_model_id: Joi.string().optional(),
  ai_confidence_avg: Joi.number().min(0).max(1).optional(),
  payload_json: Joi.object().optional(),
  hv_count: Joi.number().integer().min(0).optional(),
  lv_count: Joi.number().integer().min(0).optional(),
  org_count: Joi.number().integer().min(0).optional()
});

// Get all events (admin/operator only)
router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0, bin_id, start_date, end_date } = req.query;
    const adminClient = dbConfig.getAdminClient();
    
    let query = adminClient
      .from('bin_events')
      .select('*')
      .order('timestamp_utc', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply filters
    if (bin_id) query = query.eq('bin_id', bin_id);
    if (start_date) query = query.gte('timestamp_utc', start_date);
    if (end_date) query = query.lte('timestamp_utc', end_date);

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching events:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch events',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data,
      count: data.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Unexpected error in GET /events:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get event by ID
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { data, error } = await adminClient
      .from('bin_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Event not found'
        });
      }
      logger.error('Error fetching event:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch event',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in GET /events/:eventId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get events by bin ID
router.get('/bin/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const { limit = 100, offset = 0, start_date, end_date } = req.query;
    const adminClient = dbConfig.getAdminClient();
    
    let query = adminClient
      .from('bin_events')
      .select('*')
      .eq('bin_id', binId)
      .order('timestamp_utc', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply date filters
    if (start_date) query = query.gte('timestamp_utc', start_date);
    if (end_date) query = query.lte('timestamp_utc', end_date);

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching events for bin:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch events for bin',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      data: data,
      count: data.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Unexpected error in GET /events/bin/:binId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create new event (IoT device ingestion)
// If device key is presented, enforce scoped insert to its bin
router.post('/', deviceAuth, async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    // Enforce device bin scope if device is authenticated
    if (req.device && req.device.bin_id) {
      if (value.bin_id !== req.device.bin_id) {
        return res.status(403).json({ status: 'error', message: 'Device cannot write to this bin_id' });
      }
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: insertError } = await adminClient
      .from('bin_events')
      .insert([value])
      .select('*')
      .single();

    if (insertError) {
      if (insertError.code === '23503') {
        return res.status(400).json({
          status: 'error',
          message: 'Referenced bin does not exist'
        });
      }
      logger.error('Error creating event:', insertError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create event',
        error: insertError.message
      });
    }

    logger.info(`Event created successfully: ${data.id} for bin: ${data.bin_id}`);
    res.status(201).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in POST /events:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Bulk create events (for batch processing)
router.post('/bulk', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Events array is required and must not be empty'
      });
    }

    // Validate each event
    const validatedEvents = [];
    for (let i = 0; i < events.length; i++) {
      const { error, value } = eventSchema.validate(events[i]);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: `Validation error at index ${i}`,
          details: error.details
        });
      }
      validatedEvents.push(value);
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: insertError } = await adminClient
      .from('bin_events')
      .insert(validatedEvents)
      .select('id, bin_id, timestamp_utc');

    if (insertError) {
      logger.error('Error creating bulk events:', insertError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create events',
        error: insertError.message
      });
    }

    logger.info(`Bulk events created successfully: ${data.length} events`);
    res.status(201).json({
      status: 'success',
      data: data,
      count: data.length
    });
  } catch (error) {
    logger.error('Unexpected error in POST /events/bulk:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Update event
router.put('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { error, value } = updateEventSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details
      });
    }

    const adminClient = dbConfig.getAdminClient();
    const { data, error: updateError } = await adminClient
      .from('bin_events')
      .update(value)
      .eq('id', eventId)
      .select('*')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Event not found'
        });
      }
      logger.error('Error updating event:', updateError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update event',
        error: updateError.message
      });
    }

    logger.info(`Event updated successfully: ${eventId}`);
    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    logger.error('Unexpected error in PUT /events/:eventId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Delete event
router.delete('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const adminClient = dbConfig.getAdminClient();
    
    const { error } = await adminClient
      .from('bin_events')
      .delete()
      .eq('id', eventId);

    if (error) {
      logger.error('Error deleting event:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete event',
        error: error.message
      });
    }

    logger.info(`Event deleted successfully: ${eventId}`);
    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    logger.error('Unexpected error in DELETE /events/:eventId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 