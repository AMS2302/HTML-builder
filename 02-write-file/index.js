const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input, output });

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  'utf8',
  (err) => {
    if (err) console.error(error.message);
  }
);

output.write('=== Write your text... ===\n')

rl.on('line', (data) => {
  if (data === 'exit') {
    return rl.close();
  };
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    `${data}\n`,
    err => {
      if (err) console.error(error.message);
    }
  );
});

process.on('exit', () => output.write('=== Good bye! ==='));
