
const status = document.getElementById('status');

///ЧТЕНИЕ:
// 1) чтение через FileReader  для input type="file"
document.getElementById('input').addEventListener('change', (e) => {
  const file = e.target.files[0];   // берем первый из FileList
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {  // задаем что делать когда чтение завершится
    document.getElementById('text').textContent = reader.result; //сохраняем результат в элемент text
    status.textContent = `Файл «${file.name}» загружен.`;
  };

  reader.onerror = function () {
    status.textContent = `Ошибка чтения файла!`;
  }; //обработчик ошибки

  reader.readAsText(file); //запускаем чтение

});

// 2) чтение через file.text() для Drag-and-Drop
const dropZone = document.getElementById('dropInput');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();

  if (e.dataTransfer.files.length > 1) {
    alert('Пожалуйста, перетащите только один файл!');
    return;
  }

  const file = e.dataTransfer.files[0];
  if (!file) return;

  try {
    const text = await file.text();  // читаем как текст
    document.getElementById('text').textContent = text; // сохраняем результат в элемент text
    status.textContent = `Файл «${file.name}» загружен.`;
  }
  catch (err) {
    status.textContent = `Ошибка чтения файла!`;
  }
});

//3) получение через showOpenFilePicker() + чтение getFile()
// script.js
document.getElementById('input3').addEventListener('click', async () => {
  try {
    const [handle] = await window.showOpenFilePicker({ //диалоговое окно выбора файла
      types: [{
        description: 'Текстовые файлы',
        accept: { 'text/plain': ['.txt', '.md', '.csv', '.json'] }
      }],
      multiple: false
    });

    const file = await handle.getFile(); //получает объект File
    const content = await file.text();
    document.getElementById('text').textContent = content;

    status.textContent = `Файл «${file.name}» загружен.`;
  } catch (err) {
    status.textContent = `Ошибка чтения файла!`;
  }
});



//ЗАПИСЬ:
//1)запись написанного text в result.txt через  Blod + ссылка
document.getElementById('download').addEventListener('click', () => {
  const text = document.getElementById('text').value;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);  // временный URL

  const a = document.createElement('a');  // cоздаем невидимую ссылку 
  a.href = url;
  a.download = 'result.txt';
  a.click();      // кликаем
  status.textContent = `Файл result.txt подготовлен. Проверьте папку загрузок браузера.`;

  URL.revokeObjectURL(url); //освобождаем память
});

//2) запись через File System Access API 
document.getElementById('save').addEventListener('click', async () => {
  const text = document.getElementById('text').value;
  try {
    const handle = await window.showSaveFilePicker({ // окно «Сохранить как»
      suggestedName: 'result.txt',
      types: [{
        description: 'Текстовый файл',
        accept: { 'text/plain': ['.txt'] }
      }]
    });

    //создание потока, добавление текста, закрытие:
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();

    status.textContent = `Файл сохранён: ${handle.name}`;
  } catch (err) {
    if (err.name !== 'AbortError') {
      status.textContent = 'Ошибка сохранения: ' + err.message;
    }

    return;
  }
});











