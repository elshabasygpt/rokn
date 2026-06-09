const fs = require('fs');
const path = require('path');

async function test() {
  const FormData = require('formdata-node').FormData;
  const { fileFromPath } = require('formdata-node/file-from-path');
  
  // Create a dummy image
  fs.writeFileSync('test.jpg', 'fake image data');
  
  const fd = new FormData();
  fd.append('file', await fileFromPath('test.jpg'));

  // Without auth, we should get 401 Unauthorized or 403 Forbidden. Let's see if we get a JSON error or HTML crash.
  try {
    const res = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: fd,
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
