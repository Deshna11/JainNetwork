const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/Users/sanghvi/Desktop/SynthixLabs/JainNetwork/src');

let count = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('Jain Network')) {
    const newContent = content.replace(/Jain Network/g, 'Arham Business Connect');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Replaced in ${file}`);
    count++;
  }
});

console.log(`Replaced in ${count} files total.`);
