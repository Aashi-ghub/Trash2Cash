const logger = require('../config/logger');
const dbConfig = require('../config/database');

// Middleware: authenticate device by X-Device-Key header
// If valid, attaches req.device = { id, bin_id, status }
module.exports = async function deviceAuth(req, res, next) {
  try {
    const apiKey = req.header('x-device-key');
    if (!apiKey) return res.status(401).json({ status: 'error', message: 'Missing X-Device-Key header' });

    const adminClient = dbConfig.getAdminClient();
    const { data, error } = await adminClient
      .from('device_keys')
      .select('id, bin_id')
      .eq('api_key', apiKey)
      .single();

    if (error || !data) {
      return res.status(401).json({ status: 'error', message: 'Invalid or inactive device key' });
    }

    req.device = data;
    return next();
  } catch (err) {
    logger.error('Device auth error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

