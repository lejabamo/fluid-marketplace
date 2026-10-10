const fs = require('fs');
const glob = require('glob');
const path = require('path');
const files = glob.sync('src/components/**/*.tsx');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<img\s/g, '<img onError={(e) => { e.currentTarget.src = \https://placehold.co/600x400/eeeeee/999999?text=Imagen\; e.currentTarget.onerror = null; }} ');
  fs.writeFileSync(f, content);
});
