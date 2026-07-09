const fs = require('fs');
let content = fs.readFileSync('js/i18n.js', 'utf8');

// The syntax error is caused by things like 'index.agency.btn': 'View TheZora'Artiforge',
// or 'index.agency.btn': 'View TheZora'Artiforge", etc.
// We will replace the whole line starting with 'index.agency.btn' with the correct syntax.
content = content.replace(/'index\.agency\.btn'\s*:\s*'View TheZora'.*?,/g, "'index.agency.btn': 'View TheZora',");

// Let's also check if there are any other stray 'View TheZora' strings with trailing garbage before a comma
content = content.replace(/'View TheZora'[^,\s][^,]*?,/g, "'View TheZora',");

fs.writeFileSync('js/i18n.js', content);
console.log('Fixed i18n.js syntax errors.');
