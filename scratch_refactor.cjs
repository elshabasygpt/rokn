const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace fetch calls
  content = content.replace(/['"`]http:\/\/localhost:3001(\/api[^\s'"`]*)['"`]/g, "'$1'");
  
  // 2. Replace image prefixing: `http://localhost:3001${something}` -> something
  content = content.replace(/`http:\/\/localhost:3001\$\{([^}]+)\}`/g, "$1");

  // 3. Fallback for any other straight string paths (e.g. downloads)
  content = content.replace(/http:\/\/localhost:3001/g, "");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Refactoring complete! Modified ${modifiedCount} files.`);

// Add Vite Proxy
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  let vconf = fs.readFileSync(viteConfigPath, 'utf8');
  if (!vconf.includes('proxy: {')) {
    vconf = vconf.replace(
      "hmr: process.env.DISABLE_HMR !== 'true',",
      "hmr: process.env.DISABLE_HMR !== 'true',\n      proxy: { '/api': 'http://localhost:3001', '/uploads': 'http://localhost:3001' },"
    );
    fs.writeFileSync(viteConfigPath, vconf, 'utf8');
    console.log("Updated vite.config.ts");
  }
}
