const express = require('express');
const Joi = require('joi');
const { randomUUID } = require('crypto');
const logger = require('../config/logger');
const dbConfig = require('../config/database');

const router = express.Router();

const createSchema = Joi.object({
  bin_id: Joi.string().uuid().required(),
});

// Create a device key for a bin
router.post('/', async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: 'Validation error', details: error.details });

    const apiKey = randomUUID();
    const adminClient = dbConfig.getAdminClient();

    // Ensure bin exists
    const { error: binErr } = await adminClient.from('bins').select('bin_id').eq('bin_id', value.bin_id).single();
    if (binErr) return res.status(404).json({ status: 'error', message: 'Bin not found' });

    const { data, error: insertError } = await adminClient
      .from('device_keys')
      .insert([{ bin_id: value.bin_id, api_key: apiKey }])
      .select('*')
      .single();

    if (insertError) {
      logger.error('Error creating device key:', insertError);
      return res.status(500).json({ status: 'error', message: 'Failed to create device key', error: insertError.message });
    }

    return res.status(201).json({ status: 'success', data: { id: data.id, bin_id: data.bin_id, api_key: apiKey } });
  } catch (err) {
    logger.error('Unexpected error in POST /device-keys:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Revoke device key (delete)
router.post('/:id/revoke', async (req, res) => {
  try {
    const adminClient = dbConfig.getAdminClient();
    const { error } = await adminClient
      .from('device_keys')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(404).json({ status: 'error', message: 'Device key not found' });
    return res.json({ status: 'success', message: 'Device key revoked' });
  } catch (err) {
    logger.error('Unexpected error in POST /device-keys/:id/revoke:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// List device keys by bin
router.get('/bin/:binId', async (req, res) => {
  try {
    const adminClient = dbConfig.getAdminClient();
    const { data, error } = await adminClient
      .from('device_keys')
      .select('*')
      .eq('bin_id', req.params.binId)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: 'Failed to list device keys', error: error.message });
    return res.json({ status: 'success', data, count: data.length });
  } catch (err) {
    logger.error('Unexpected error in GET /device-keys/bin/:binId:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;

