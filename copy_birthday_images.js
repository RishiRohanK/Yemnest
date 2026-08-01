const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\91812\\.gemini\\antigravity-ide\\brain\\e06fe363-af46-48c3-b51d-f3bf0a2b8b17';
const destDir = 'public\\images\\themes\\birthday';

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the files
fs.copyFileSync(
  path.join(sourceDir, 'media__1785583748433.jpg'),
  path.join(destDir, 'closed.jpg')
);

fs.copyFileSync(
  path.join(sourceDir, 'media__1785583783163.jpg'),
  path.join(destDir, 'open.jpg')
);

console.log('Birthday images copied successfully!');
