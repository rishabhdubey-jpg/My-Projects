const fs = require('fs');
const files = ['info.html', 'works.html', 'contact.html', 'js/i18n.js'];
const replacements = [
    ['rishabhisasimp676@gmail.com', 'rishabhdx06@gmail.com'],
    ['https://github.com/rxb-is-immortal', 'https://github.com/rishabhdubey-jpg'],
    ['http://www.linkedin.com/in/rxb-is-immortal', 'https://www.linkedin.com/in/rishabh-dubey066/'],
    ['https://www.instagram.com/rxb__w/', 'https://www.instagram.com/rishabhdubey066/'],
    ['index.agency.btn\': \'Visit TheZora Website\'', 'index.agency.btn\': \'View TheZora\'']
];
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldStr, newStr] of replacements) {
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(file, content);
}
console.log("Done");
