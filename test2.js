const str = "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT DO UPDATE SET value = $2";
const out = str.replace(/\$([0-9]+)/g, '?$1');
console.log(out);
