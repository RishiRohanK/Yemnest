const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\91812\\.gemini\\antigravity-ide\\brain\\e06fe363-af46-48c3-b51d-f3bf0a2b8b17';
const destDir = 'public\\images\\themes\\diwali';

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the files
fs.copyFileSync(
  path.join(sourceDir, 'media__1785585994623.jpg'),
  path.join(destDir, 'open.jpg')
);

fs.copyFileSync(
  path.join(sourceDir, 'media__1785586002960.jpg'),
  path.join(destDir, 'closed.jpg')
);

console.log('Diwali images copied successfully!');
