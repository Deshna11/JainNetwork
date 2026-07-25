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
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Buttons & Specific Compounds First
  content = content.replace(/bg-blue-600 hover:bg-blue-700 text-white/g, 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold');
  content = content.replace(/bg-blue-600 text-white/g, 'bg-amber-500 text-slate-950 font-semibold');
  
  // Backgrounds
  content = content.replace(/bg-blue-600/g, 'bg-amber-500 text-slate-950 font-semibold');
  content = content.replace(/text-slate-950 font-semibold(.*?)text-white/g, 'text-slate-950 font-semibold$1');
  
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-amber-600');
  content = content.replace(/bg-blue-50\/70/g, 'bg-amber-50\/70');
  content = content.replace(/bg-blue-50/g, 'bg-amber-50');
  content = content.replace(/bg-blue-100/g, 'bg-amber-100');
  content = content.replace(/bg-blue-200/g, 'bg-amber-200');
  content = content.replace(/bg-blue-900/g, 'bg-slate-900');
  content = content.replace(/bg-blue-950/g, 'bg-slate-950');

  // Texts
  content = content.replace(/text-blue-600/g, 'text-amber-600');
  content = content.replace(/text-blue-700/g, 'text-amber-700');
  content = content.replace(/text-blue-800/g, 'text-amber-800');
  content = content.replace(/text-blue-900/g, 'text-slate-900');
  content = content.replace(/text-blue-950/g, 'text-slate-950');
  content = content.replace(/text-blue-100/g, 'text-slate-200');
  content = content.replace(/text-blue-200/g, 'text-slate-300');
  content = content.replace(/text-blue-300/g, 'text-slate-400');
  content = content.replace(/text-blue-500/g, 'text-amber-500');

  // Borders
  content = content.replace(/border-blue-200/g, 'border-amber-200');
  content = content.replace(/border-blue-100/g, 'border-amber-100');
  content = content.replace(/border-blue-600/g, 'border-amber-600');
  content = content.replace(/border-blue-800/g, 'border-slate-800');
  content = content.replace(/hover:border-blue-200/g, 'hover:border-amber-200');
  content = content.replace(/focus:border-blue-500/g, 'focus:border-amber-500');

  // Rings
  content = content.replace(/focus:ring-blue-100/g, 'focus:ring-amber-100');
  content = content.replace(/ring-blue-100/g, 'ring-amber-100');
  content = content.replace(/border-t-blue-600/g, 'border-t-amber-500');

  // Gradients
  content = content.replace(/from-blue-600/g, 'from-slate-900');
  content = content.replace(/via-blue-700/g, 'via-slate-800');
  content = content.replace(/to-indigo-800/g, 'to-slate-950');
  content = content.replace(/from-blue-900/g, 'from-slate-900');
  content = content.replace(/to-indigo-950/g, 'to-slate-950');
  
  content = content.replace(/from-blue-50\/60/g, 'from-slate-50\/60');
  content = content.replace(/via-indigo-50\/30/g, 'via-amber-50\/30');
  content = content.replace(/border-blue-100\/60/g, 'border-amber-100\/60');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`Replaced themes in ${count} files.`);
