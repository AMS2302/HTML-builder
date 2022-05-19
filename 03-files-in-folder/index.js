const { stdout } = process;
const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const filePath = path.join(folder, file.name);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const size = stats.size;
        stdout.write(`${name}  -  ${ext.slice(1)}  -  ${size} bytes\n`);
      };
    });
  });
})
