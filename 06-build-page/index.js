const path = require('path');
const { mkdir, readdir, readFile, writeFile } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

async function createHtml() {
  try {
    await mkdir(distPath, { recursive: true });
    const templateData = await readFile(templatePath, 'utf8');
    const templateStrings = templateData.split('\r\n');
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
    await writeFile(path.join(distPath, 'index.html'), templateStrings.join('\r\n'), 'utf8');
  } catch (error) {
    console.error(error);
  }
}

function createDist() {
  createHtml();
};

createDist();
