const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

const applyViews = async () => {
  try {
    const viewsSQL = fs.readFileSync(path.join(__dirname, '../src/database/views.sql')).toString();
    await pool.query(viewsSQL);
    console.log('Successfully applied views.');
  } catch (error) {
    console.error('Error applying views:', error);
  } finally {
    pool.end();
  }
};

applyViews();
