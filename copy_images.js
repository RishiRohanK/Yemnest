const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\91812\\.gemini\\antigravity-ide\\brain\\e06fe363-af46-48c3-b51d-f3bf0a2b8b17';
const destDir = path.join(__dirname, 'public', 'images', 'themes', 'raksha-bandhan');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(
  path.join(srcDir, 'media__1785503427614.jpg'),
  path.join(destDir, 'closed.jpg')
);

fs.copyFileSync(
  path.join(srcDir, 'media__1785503461478.jpg'),
  path.join(destDir, 'open.jpg')
);

console.log('Copied successfully!');
