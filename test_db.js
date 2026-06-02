import sqlite3 from 'sqlite3';
const sqliteDb = new sqlite3.Database(':memory:');
sqliteDb.runAsync = (sql, params = []) => new Promise((resolve, reject) => {
  sqliteDb.run(sql, params, function(err) {
    if (err) { err.message = err.message + '\nSQL: ' + sql; reject(err); }
    else resolve({ lastID: this.lastID, changes: this.changes });
  });
});

sqliteDb.serialize(async () => {
  sqliteDb.run('CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMP)');
  
  let sql = 'INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP RETURNING *';
       
  let sqliteSql = sql
        .replace(/\$([0-9]+)/g, '?$1') // Replace $1, $2 with ?1, ?2
        .replace(/RETURNING \*/gi, '');
        
  const params = ['hero', '{}'];
  
  try {
    await sqliteDb.runAsync(sqliteSql, params);
    console.log('Insert success');
    await sqliteDb.runAsync(sqliteSql, ['hero', '{"new": true}']);
    console.log('Update success');
  } catch(e) {
    console.error('Error:', e);
  }
});
