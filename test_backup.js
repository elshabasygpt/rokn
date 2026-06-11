const http = require('http');
const fs = require('fs');

const req = http.get('http://localhost:3001/api/backup/info', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Info Response:', res.statusCode, data));
});
req.on('error', e => console.error(e));
