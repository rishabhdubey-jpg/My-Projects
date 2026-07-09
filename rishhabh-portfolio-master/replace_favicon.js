const fs = require('fs');

const files = ['index.html', 'info.html', 'works.html', 'contact.html'];
const regex = /<link rel="icon"[^>]*>/g;
const replacement = '<link rel="icon" type="image/x-icon" href="favicon.ico">';

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    // Check if it's shortcut icon
    const regex2 = /<link rel="shortcut icon"[^>]*>/g;
    if (content.match(regex2)) {
      content = content.replace(regex2, replacement);
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`No icon tag found in ${file}`);
    }
  }
}
