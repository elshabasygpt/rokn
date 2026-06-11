import pool from './server/db.js';

const desiredOrder = [
  'qassim', 'buraidah', 'unaizah', 'ar-rass', 'al-bukayriyah', 'al-mithnab', 'al-badayea',
  'riyadh', 'jeddah', 'dammam', 'makkah', 'madinah', 'khobar', 'jubail', 'al-ahsa',
  'taif', 'tabuk', 'hail', 'abha', 'jizan', 'najran', 'yanbu'
];

async function updateOrder() {
  try {
    for (let i = 0; i < desiredOrder.length; i++) {
      await pool.query('UPDATE cities SET display_order = $1 WHERE slug = $2', [i, desiredOrder[i]]);
    }
    console.log('Cities reordered successfully');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

updateOrder();
