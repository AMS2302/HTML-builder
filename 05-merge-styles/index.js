const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');

fs.writeFile(path.join(dest, 'bundle.css'), '', 'utf8', (error) => {
  if (error) console.error(error.message);
});

fs.readdir(src, { withFileTypes: true }, (error, files) => {
  if (error) console.error(error.message);
  files.forEach(file => {
    if (path.extname(path.join(src, file.name)) === '.css') {
      const stream = fs.createReadStream(path.join(src, file.name), 'utf-8');
      let data = '';
      stream.on('error', error => console.log('Error', error.message));
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => {
        fs.appendFile(path.join(dest, 'bundle.css'), `${data}\n`, error => {
          if (error) console.error(error.message);
        });
      });
    }
  });
});
