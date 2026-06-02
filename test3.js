const fs = require('fs');
const code = fs.readFileSync('server/db.ts', 'utf8');
const lines = code.split('\n');
console.log(lines[77]); // the line with the replace
