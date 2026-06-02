import poolWrapper from './server/db.js';

async function fixDB() {
  try {
    const res = await poolWrapper.query('SELECT * FROM services');
    for (const row of res.rows) {
      if (!Array.isArray(row.images)) {
        console.log(`Fixing images for service ${row.id}`);
        // We need to set it to a valid JSON array string
        // Since sqlite takes stringified json in the param array for objects/arrays
        await poolWrapper.query('UPDATE services SET images = $1 WHERE id = $2', [
          [], row.id
        ]);
      }
    }
    console.log('Successfully fixed services images in DB.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating DB:', error);
    process.exit(1);
  }
}

fixDB();
