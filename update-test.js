const fs = require('fs');
const start = require('./dist/index.js').default;

const file = process.argv[2];
if (!file) {
  console.error('Usage: node update-test.js <file.coffee>');
  process.exit(1);
}

start(file, { salt: 'ahk', metadata: false })
  .then(result => {
    let content;
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      // Try array-like object
      if (result.length !== undefined) {
        content = Array.from(result).join('');
      } else {
        // Try known properties
        content = result.content || result.stdout;
      }
    } else if (Array.isArray(result)) {
      content = result.join('');
    } else {
      content = result;
    }

    if (!content) {
      console.error('Failed to get content from result:', result);
      process.exit(1);
    }

    const ahkPath = file.replace('.coffee', '.ahk');
    fs.writeFileSync(ahkPath, content);
    console.log('Updated:', ahkPath);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
