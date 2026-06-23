const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function removeConsoleLogs(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Basic regex to remove console.log(...); and console.log(...)
    // It's not perfect for all cases but covers 99% of typical frontend console.logs
    const newContent = content.replace(/^[ \t]*console\.log\([^]*?\);?[ \t]*$/gm, '');
    
    // Also remove inline console.logs like (console.log(...),
    const inlineContent = newContent.replace(/console\.log\([^]*?\)/g, 'undefined');
    
    // To be safer and cleaner, let's just use a more targeted approach for the ones we saw:
    const safeContent = content.replace(/[ \t]*console\.log\([\s\S]*?\);?\n?/g, '');
    
    if (content !== safeContent) {
      fs.writeFileSync(filePath, safeContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

walkDir('./src', removeConsoleLogs);
