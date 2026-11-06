const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.system_generated'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.html')) {
        results.push(full);
      }
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    // Check for user-facing text that says Orbit (not css class .orbit-)
    if (l.includes('Orbit') && !l.includes('.orbit-') && !l.includes('orbit-btn') && !l.includes('orbit-card') && !l.includes('orbit-input') && !l.includes('orbit-table') && !l.includes('orbit-modal') && !l.includes('orbit-drawer') && !l.includes('orbit-form') && !l.includes('orbit-topnav') && !l.includes('orbit-sidebar') && !l.includes('orbit-main') && !l.includes('orbit-app') && !l.includes('orbit-content')) {
      console.log(path.relative(process.cwd(), f) + ':' + (i+1) + ': ' + l.trim());
    }
  });
});

