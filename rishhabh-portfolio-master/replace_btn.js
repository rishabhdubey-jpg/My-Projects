const fs = require('fs');
const file = 'js/i18n.js';
let content = fs.readFileSync(file, 'utf8');

// Use a regex to match all instances of 'index.agency.btn': '...', and replace with 'index.agency.btn': 'View TheZora',
content = content.replace(/'index\.agency\.btn':\s*'.*?'/g, "'index.agency.btn': 'View TheZora'");

fs.writeFileSync(file, content);
console.log("Done");
