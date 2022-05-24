const fs = require('fs');
const path = require('path');
const { mkdir, readdir, readFile, writeFile, appendFile, stat, copyFile } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

async function createHtml() {
  try {
    await mkdir(distPath, { recursive: true });
    const templateData = await readFile(templatePath, 'utf8');
    const templateStrings = templateData.split(/\n/g);
    const templateTags = templateStrings.map(item => item.trim());
    const components = await readdir(componentsPath, 'utf8', { withFileTypes: true });
    for (const file of components) {
      const filePath = path.join(componentsPath, file);
      const fileBaseName = path.basename(filePath, '.html')
      const fileExtName = path.extname(filePath);
      const checkName = '{{' + fileBaseName + '}}';
      const tagIndex = templateTags.indexOf(checkName);
      const fileData = await readFile(filePath, 'utf8');
      if (fileExtName === '.html' && templateTags.includes(checkName)) {
        templateStrings[tagIndex] = fileData;
      }
    }
    await writeFile(path.join(distPath, 'index.html'), templateStrings.join('\n'), 'utf8');
  } catch (error) {
    console.error(error);
  }
}

async function mergeStyles() {
  try {
    const distStylePath = path.join(distPath, 'style.css');
    await writeFile(distStylePath, '', 'utf8');
    const styles = await readdir(stylesPath, 'utf8', { withFileTypes: true });
    for (const file of styles) {
      const filePath = path.join(stylesPath, file);
      if (path.extname(filePath) === '.css') {
        const stream = fs.createReadStream(filePath, 'utf-8');
        let data = '';
        stream.on('error', error => { if (error) throw error });
        stream.on('data', chunk => data += chunk);
        stream.on('end', async () => {
          await appendFile(distStylePath, `${data}\r\n`);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function copyDir(src) {
  try {
    const defaultDistFolder = path.join(distPath, path.basename(src));

    async function init(src, distFolder = defaultDistFolder) {
      try {
        await mkdir(distFolder, { recursive: true });
        const srcItems = await readdir(src, 'utf8', { withFileTypes: true });
        for (const item of srcItems) {
          const itemPath = path.join(src, item);
          const stats = await stat(itemPath);
          if (stats.isDirectory()) {
            await init(itemPath, path.join(distFolder, item));
          } else if (stats.isFile()) {
            await copyFile(itemPath, path.join(distFolder, path.basename(item)));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    await init(src);

  } catch (error) {
    console.error(error);
  }
}

function createDist() {
  createHtml();
  mergeStyles();
  copyDir(assetsPath);
};

createDist();
