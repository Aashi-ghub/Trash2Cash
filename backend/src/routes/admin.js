const express = require('express');
const auth = require('../middleware/auth');
const dbConfig = require('../config/database');

const router = express.Router();

// Minimal operator-protected overview
router.get('/overview', auth, async (req, res) => {
  try {
    if (req.auth.role !== 'operator' && req.auth.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    const admin = dbConfig.getAdminClient();
    const [bins, events, users] = await Promise.all([
      admin.from('bins').select('id', { count: 'exact', head: true }),
      admin.from('bin_events').select('id', { count: 'exact', head: true }),
      admin.from('profiles').select('user_id', { count: 'exact', head: true })
    ]);
    return res.json({
      status: 'success',
      data: {
        bins: bins.count || 0,
        events: events.count || 0,
        users: users.count || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;

