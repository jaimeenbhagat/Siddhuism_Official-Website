const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');

const replacements = [
  { regex: /py-20 md:py-2[46]/g, replace: 'py-12 md:py-16' },
  { regex: /py-24 md:py-30/g, replace: 'py-12 md:py-16' },
  { regex: /py-18 md:py-24/g, replace: 'py-12 md:py-16' },
  { regex: /py-16 md:py-24/g, replace: 'py-12 md:py-16' }, // hero-section
  { regex: /space-y-16/g, replace: 'space-y-6 md:space-y-8' },
  { regex: /space-y-12/g, replace: 'space-y-6 md:space-y-8' },
  { regex: /gap-12/g, replace: 'gap-6 md:gap-8' },
  { regex: /gap-10/g, replace: 'gap-6 md:gap-8' }
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDir(dir);
