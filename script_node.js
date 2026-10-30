

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Демонстрация работы с файлами в Node.js (fs)
//Синхронно:
console.log('синхрон');


const fs = require('fs');
const file = 'demo.txt';

fs.writeFileSync(file, 'Привет, мир!\n'); fs.appendFileSync(file, 'Ещё одна строка\n'); console.log('Файл существует:', fs.existsSync(file));

console.log( fs.readFileSync(file, 'utf-8'));

const info = fs.statSync(file);
console.log('Размер:', info.size, 'байт');

fs.unlinkSync(file);


console.log(' ');
console.log('асинхрон');

//Асинхронно:
const fsp = require('fs/promises');
(async () => {
  const file = 'demo.txt';

  await fsp.writeFile(file, 'Привет, мир!\n');
  await fsp.appendFile(file, 'Ещё одна строка\n');
  const exists = await fsp.access(file).then(() => true).catch(() => false);
  console.log('Файл существует:', exists);

  console.log(await fsp.readFile(file, 'utf-8'));

  const info = await fsp.stat(file);
  console.log('Размер:', info.size, 'байт');

  await fsp.unlink(file);
})();