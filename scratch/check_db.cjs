const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('alsuqour.db');
db.all('SELECT * FROM admin', [], (err, rows) => {
  if (err) console.error(err);
  console.log(JSON.stringify(rows));
  db.close();
});
