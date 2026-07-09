const fs = require('fs');
const files = ['index.html', 'info.html', 'works.html', 'contact.html'];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace me.jpg with me.png
    content = content.replace(/me\.jpg/g, 'me.png');
    fs.writeFileSync(file, content);
}
console.log('Fixed profile image extensions.');
