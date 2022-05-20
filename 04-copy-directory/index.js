const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

function errorCallback(error) {
  if (error) console.error(error.message);
};

function copyDir() {
  fs.readdir(__dirname, (error) => {
    errorCallback(error);
    fs.mkdir(dest, { recursive: true }, errorCallback);
  });

  fs.readdir(src, (error, data) => {
    errorCallback(error);

    fs.readdir(dest, (error, destData) => {
      errorCallback(error);
      if (destData.length) {
        destData.forEach(item => {
          if (!data.includes(item)) {
            fs.rm(path.join(dest, item), errorCallback);
          }
        });
      }
    });

    data.forEach(file => {
      fs.copyFile(path.join(src, file), path.join(dest, file), errorCallback);
    });
  });
}

copyDir();
