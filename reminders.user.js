
// ==UserScript==
// @name         Reminders (Local Config, SPA)
// @namespace    reminders_local
// @version      3.0
// @description  Напоминания для сайтов + большое центральное окно
// @author       Watrooshka
// @updateURL    https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @downloadURL  https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// ==/UserScript==
(function() {
    'use strict';




let currentURL = location.href;
    if (location.href.includes('https://www.123.ru/')) {
    GM_addStyle(`
:root {
    --bg-main: #ffffff;
    --bg-soft: #f5f5f7;
    --bg-hover: #f0f0f3;

    --primary: #007aff;
    --primary-hover: #005dd1;

    --success: #34c759;
    --danger: #ff3b30;

    --text-main: #1d1d1f;
    --text-muted: #86868b;
    --border: #d2d2d7;

    --radius: 16px;
    --radius-sm: 12px;
}


/* Контейнер */
#floatingInputContainer {
    position: fixed;
    inset: 0;
    margin: auto;
    width: calc(100%);
    height: calc(100%);

    background: var(--bg-main);
    border: 0px solid var(--border);

    box-shadow:
        0 20px 40px rgba(0,0,0,.08);

    z-index: 999999;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
                 "SF Pro Display", Inter, system-ui, sans-serif;
    color: var(--text-main);
}

/* Header */
#floatingInputHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 20px 24px;
    background: var(--bg-soft);
    border-bottom: 1px solid var(--border);
}

#floatingInputTitle {
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.2px;
}

/* Кнопки */
.buttons-container {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    cursor: pointer;

    font-size: 13px;
    font-weight: 500;
    background: white;
    color: var(--text-main);

    transition: background .2s, border .2s;
}

.action-button:hover {
    background: var(--bg-hover);
}

.action-button.save {
    color: var(--success);
}

.action-button.clear {
    color: var(--danger);
}

/* Основная зона */
.content-area {
    flex: 1;
    margin: 16px;
    padding: 16px;

    background: white;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);

    overflow-y: auto;
}

/* Input */
#userInput {
    width: calc(100% - 32px);
    margin: 0 16px 14px;
    padding: 14px 16px;

    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;

    font-size: 15px;
}

#userInput:focus {
    outline: none;
    border-color: var(--primary);
}

/* Статус */
#inputStatus {
    margin: 0 16px;
    padding: 10px 14px;

    background: var(--bg-soft);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);

    font-size: 13px;
    color: var(--text-muted);
}

/* Статистика */
.stats-container {
    display: flex;
    gap: 14px;
    margin: 16px;
}

.stat-item {
    flex: 1;
    padding: 14px;

    background: white;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    text-align: center;
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
}

.stat-label {
    font-size: 12px;
    margin-top: 4px;
    color: var(--text-muted);
}

.stat-avito { color: var(--danger); }
.stat-yandex { color: var(--primary); }
.stat-total { color: var(--success); }

/* История */
.history-item {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 10px 12px;
    margin-bottom: 8px;

    justify-content: space-between;


    background: white;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);

    transition: background .15s;
}

.history-item:hover {
    background: var(--bg-hover);
}

.history-command {
    font-weight: 500;
}

.history-time {
    font-size: 12px;
    color: var(--text-muted);
}

.history-type {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 999px;

    background: var(--bg-soft);
    color: var(--primary);
}

/* Кнопка копирования */
.copy-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: var(--primary);
    cursor: pointer;

    transition: background .15s;
}

.copy-btn:hover {
    background: var(--bg-hover);
}

/* Пустая история */
.empty-history {
    padding: 60px 20px;
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
}
/*Кнопка накладная*/
.invoice-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #ff9500;
    cursor: pointer;

    transition: background .15s;
}

.invoice-btn:hover {
    background: var(--bg-hover);
}
.barcode-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #8e44ad;
    cursor: pointer;

    transition: background .15s;
}

.barcode-btn:hover {
    background: var(--bg-hover);
}


`);



    // Загружаем историю из сохраненных данных
    let commandHistory = GM_getValue('commandHistory', []);
 
    let historyIndex = commandHistory.length;

    // Создаем контейнер для окна ввода
    const container = document.createElement('div');
    container.id = 'floatingInputContainer';

    // Заголовок окна с кнопками
    const header = document.createElement('div');
    header.id = 'floatingInputHeader';

    const title = document.createElement('div');
    title.id = 'floatingInputTitle';
    title.textContent = 'Введите команду';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const Priemyan = document.createElement('button');
        Priemyan.className = 'action-button';
        Priemyan.textContent = "ПРИЕМКА Яндекс (Водители/Клиенты)";

// Кнопка открытия отдельного окна генератора ШК
const openBarcodeWindowBtn = document.createElement('button');
openBarcodeWindowBtn.className = 'action-button';
openBarcodeWindowBtn.title = 'Открыть генератор ШК';
openBarcodeWindowBtn.textContent = 'Генератор ШК';

    // Кнопка сохранения истории в файл
    const saveButton = document.createElement('button');
    saveButton.className = 'action-button save';
    saveButton.textContent = '📝';
    saveButton.title = 'Сохранить историю в текстовый файл';

    // Кнопка очистки истории
    const clearButton = document.createElement('button');
    clearButton.className = 'action-button clear';
    clearButton.textContent = '🗑️';
    clearButton.title = 'Очистить историю команд';

    // Поле ввода
    const input = document.createElement('input');
    input.id = 'userInput';
    input.type = 'text';
    input.placeholder = 'Введите текст и нажмите Enter...';

    // Статус
    const status = document.createElement('div');
    status.id = 'inputStatus';
    status.textContent = 'Здесь ТОЛЬКО Выдача и приемка авито, По яндексу ТОЛЬКО выдача';

    // Контейнер для статистики
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';

    // Статистика для АВИТО
    const avitoStat = document.createElement('div');
    avitoStat.className = 'stat-item';
    const avitoValue = document.createElement('div');
    avitoValue.className = 'stat-value stat-avito';
    avitoValue.textContent = '0';
    const avitoLabel = document.createElement('div');
    avitoLabel.className = 'stat-label';
    avitoLabel.textContent = 'АВИТОВЫДАЧА';
        // Статистика для АВИТО
    const avitoStat1 = document.createElement('div');
    avitoStat1.className = 'stat-item';
    const avitoValue1 = document.createElement('div');
    avitoValue1.className = 'stat-value stat-avito';
    avitoValue1.textContent = '0';
    const avitoLabel1 = document.createElement('div');
    avitoLabel1.className = 'stat-label';
    avitoLabel1.textContent = 'АВИТОПРИЕМКА';

    // Статистика для ЯНДЕКС
    const yandexStat = document.createElement('div');
    yandexStat.className = 'stat-item';
    const yandexValue = document.createElement('div');
    yandexValue.className = 'stat-value stat-yandex';
    yandexValue.textContent = '0';
    const yandexLabel = document.createElement('div');
    yandexLabel.className = 'stat-label';
    yandexLabel.textContent = 'ЯНДЕКС';

    // Собираем статистику
    avitoStat.appendChild(avitoValue);
    avitoStat.appendChild(avitoLabel);
    avitoStat1.appendChild(avitoValue1);
    avitoStat1.appendChild(avitoLabel1);
    yandexStat.appendChild(yandexValue);
    yandexStat.appendChild(yandexLabel);

    statsContainer.appendChild(avitoStat);
    statsContainer.appendChild(avitoStat1);
    statsContainer.appendChild(yandexStat);

    // Область для истории
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';

    // Собираем структуру

    buttonsContainer.appendChild(Priemyan);
    buttonsContainer.appendChild(openBarcodeWindowBtn);
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(clearButton);
    header.appendChild(title);
    header.appendChild(buttonsContainer);

    container.appendChild(header);
    container.appendChild(input);
    container.appendChild(status);
    container.appendChild(statsContainer);
    container.appendChild(contentArea);

    document.body.appendChild(container);


    // Функция для определения типа команды
   function getCommandType(command) {
    if (/^\d{10}$/.test(command)) {
        return command.startsWith('50')
            ? 'АВИТОПРИЕМКА'
            : 'АВИТОВЫДАЧА';
    }
    return 'ЯНДЕКС';
}


    // Функция для подсчета статистики
    function calculateStats() {
        const stats = {
            avito: 0,
            avito1: 0,
            yandex: 0,
            total: commandHistory.length
        };

        commandHistory.forEach(item => {
            const type = item.type || getCommandType(item.command);
            if (type === 'АВИТОВЫДАЧА') {
                stats.avito++;
            } else if (type === 'АВИТОПРИЕМКА') {
                stats.avito1++;
            } else {
                stats.yandex++;
            }
        });

        return stats;
    }

    // Функция для обновления отображения статистики
    function updateStatsDisplay() {
        const stats = calculateStats();
        avitoValue.textContent = stats.avito;
        avitoValue1.textContent = stats.avito1;
        yandexValue.textContent = stats.yandex;
    }
function loadBarcodeLibrary(callback) {
    if (window.JsBarcode) return callback();

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
    script.onload = callback;
    document.head.appendChild(script);
}

    // Функция для обновления отображения истории
    function updateHistoryDisplay() {
        if (commandHistory.length === 0) {
            contentArea.innerHTML = '<div class="empty-history">История команд пуста</div>';
            return;
        }

        let historyHTML = '';
        // Отображаем историю в обратном порядке (новые сверху)
        [...commandHistory].reverse().forEach((item, index) => {
            const time = item.time || '';
            const command = item.command || '';
            const type = item.type || getCommandType(command);

            historyHTML += `
                <div class="history-item">
                    <div class="history-content">
                        <span class="history-time">${time}</span>
                        <span class="history-command">${command}</span>
                        <span class="history-type">${type}</span>
                    </div>
                   <div class="history-actions">

    ${type === 'АВИТОПРИЕМКА'
        ? `<button class="invoice-btn" data-command="${command}">История заказа</button>`

        : ''
    }
    ${type === 'АВИТОВЫДАЧА'
        ? `<button class="invoice-btn" data-command="${command}">История заказа</button>`

        : ''
    }
    <button class="barcode-btn" data-command="${command}">ШК</button>
    <button class="copy-btn" data-command="${command}">Копировать</button>
</div>


                </div>
            `;
        });

        contentArea.innerHTML = historyHTML;

        // Добавляем обработчики для кнопок копирования
        contentArea.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                copyToClipboard(command);
                showStatus(`Скопировано: ${command}`, '#27ae60');
            });
        });
        // Кнопка "Накладная" (только АВИТОПРИЕМКА)
contentArea.querySelectorAll('.invoice-btn').forEach(button => {
    button.addEventListener('click', function () {
        const command = this.getAttribute('data-command');

        const url = `https://pvz.avito.ru/history/${command}`;
        window.open(url, '_blank');

        showStatus(`Открыта накладная: ${command}`, '#ff9500');
    });
});
        //ШК
      contentArea.querySelectorAll('.barcode-btn').forEach(button => {
    button.addEventListener('click', function () {
        const command = this.getAttribute('data-command');

        // открываем новое полноэкранное окно
        const win = window.open('', '_blank');

        win.document.write(`
            <html>
            <head>
                <title>Штрихкод: ${command}</title>
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff; /* светлый фон под ШК */
                    }
                    svg {
                        max-width: 90%;
                        max-height: 90%;
                    }
                </style>
            </head>
            <body>
                <svg id="barcode"></svg>
                <script>
                    window.onload = function() {
                        JsBarcode(document.getElementById("barcode"), "${command}", {
                            format: "CODE128",
                            displayValue: true,
                            width: 4,
                            height: 200,
                            fontSize: 40,
                            margin: 10
                        });
                    }
                </script>
            </body>
            </html>
        `);

        win.document.close();

        showStatus(`Штрихкод сгенерирован: ${command}`, '#8e44ad');
    });
});




    }

    // Функция для отображения статуса
    function showStatus(message, color = '#666') {
        status.textContent = message;
        status.style.color = color;
        setTimeout(() => {
            status.style.color = '#666';
        }, 3000);
    }

    // Функция для сохранения истории в файл (с статистикой)
    function saveHistoryToFile() {
        if (commandHistory.length === 0) {
            showStatus('История пуста, нечего сохранять', '#e74c3c');
            return;
        }

        const stats = calculateStats();

        let fileContent = '=== ИСТОРИЯ ===\n';
        fileContent += `Сохранено: ${new Date().toLocaleString()}\n`;
        fileContent += '='.repeat(30) + '\n';
        fileContent += `Всего команд: ${stats.total}\n`;
        fileContent += `АВИТОВЫДАЧА: ${stats.avito}\n`;
        fileContent += `АВИТОПРИЕМКА: ${stats.avito1}\n`;
        fileContent += `ЯНДЕКС: ${stats.yandex}\n`;
        fileContent += '='.repeat(30) + '\n\n';

        // Добавляем команды в обратном порядке (новые сверху)
        [...commandHistory].reverse().forEach((item, index) => {
            const num = commandHistory.length - index;
            fileContent += `${num}. [${item.time}] ${item.command} (${item.type || getCommandType(item.command)})\n`;
        });

        // Создаем Blob и ссылку для скачивания
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `история_команд_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus(`История сохранена в файл (${stats.total} команд)`, '#27ae60');
    }

    // Функция для очистки истории
    function clearHistory() {
        if (commandHistory.length === 0) {
            showStatus('История уже пуста', '#e74c3c');
            return;
        }

        const stats = calculateStats();
        if (confirm(`Очистить всю историю?\nВсего команд: ${stats.total}\АВИТОВЫДАЧА: ${stats.avito}\nЯНДЕКС: ${stats.yandex}\nАВИТОПРИЕМКА: ${stats.avito1}`)) {
            commandHistory = [];
            GM_setValue('commandHistory', commandHistory);
            historyIndex = 0;
            updateStatsDisplay();
            updateHistoryDisplay();
            showStatus('История очищена', '#27ae60');
        }
    }

    // Функция для копирования в буфер обмена
    async function copyToClipboard(text) {
        try {
            await GM_setClipboard(text, 'text');
        } catch (err) {
            // Резервный метод
            fallbackCopyToClipboard(text);
        }
    }

    // Резервный метод копирования
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Ошибка при копировании:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function openOrFocusAvitoPvz(text) {
        const windowName = 'avito_pvz_deliver_tab';
        const url = 'https://pvz.avito.ru/deliver/scan/'+text+'/'+text;
        const tab = window.open('', windowName);
        /*if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://pvz.avito.ru/deliver/scan/'+text+'/'+text)) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }*/
        return window.open(url, windowName);
    }

        function openOrFocusAvitoPiemk(text) {
        const windowName = 'avitopriem_pvz_deliver_tab';
        const url = 'https://pvz.avito.ru/accept/parcel/'+text;
        const tab = window.open('', windowName);
        /*if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://pvz.avito.ru/accept/parcel/'+text)) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }*/
        return window.open(url, windowName);
    }

    function openOrFocusYandexPvz() {
        const windowName = 'yandex_pvz_deliver_tab';
        const url = 'https://hubs.market.yandex.ru/tpl-outlet/148822177/issuing';
        const tab = window.open('', windowName);
        if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://hubs.market.yandex.ru/tpl-outlet/148822177/issuing')) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }
        return window.open(url, windowName);
    }

        const RU_TO_EN = {
    'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','х':'[','ъ':']',
    'ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','ж':';','э':'\'',
    'я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m','б':',','ю':'.',

    'Й':'Q','Ц':'W','У':'E','К':'R','Е':'T','Н':'Y','Г':'U','Ш':'I','Щ':'O','З':'P','Х':'[','Ъ':']',
    'Ф':'A','Ы':'S','В':'D','А':'F','П':'G','Р':'H','О':'J','Л':'K','Д':'L','Ж':';','Э':'\'',
    'Я':'Z','Ч':'X','С':'C','М':'V','И':'B','Т':'N','Ь':'M','Б':',','Ю':'.'
};

    // Функция для обработки ввода
    function processInput() {
        const text = input.value.trim();

        if (!text) {
            showStatus('Пожалуйста, введите команду', '#e74c3c');
            return;
        }

        // Определяем тип команды
        const commandType = getCommandType(text);

        // Добавляем в историю
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            time: timestamp,
            command: text,
            type: commandType,
            date: new Date().toISOString()
        };

        commandHistory.push(historyItem);

        // Сохраняем историю (ограничиваем размер, например, последние 100 команд)
        if (commandHistory.length > 100) {
            commandHistory = commandHistory.slice(-100);
        }

        GM_setValue('commandHistory', commandHistory);
        historyIndex = commandHistory.length;

        // Обновляем отображение
        updateStatsDisplay();
        updateHistoryDisplay();

        // Копируем в буфер обмена
        copyToClipboard(text);

        // Ваша логика обработки команд
      if (commandType === 'АВИТОВЫДАЧА') {
          showStatus(`Команда АВИТОВЫДАЧА: ${text} (скопировано)`, '#27ae60');
          openOrFocusAvitoPvz(text);
      } else if (commandType === 'АВИТОПРИЕМКА') {
          showStatus(`Команда АВИТОПРИЕМКА: ${text} (скопировано)`, '#27ae60');
          openOrFocusAvitoPiemk(text);
      } else {
          showStatus(`Команда ЯНДЕКС: ${text} (скопировано)`, '#27ae60');
          openOrFocusYandexPvz();
      }


        // Очищаем поле ввода
        input.value = '';
        input.focus();
    }

    // Обработчики событий
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            processInput();
        }
    });
        input.addEventListener('input', () => {
    const cursorPos = input.selectionStart;

    let converted = '';
    let changed = false;

    for (const ch of input.value) {
        if (RU_TO_EN[ch]) {
            converted += RU_TO_EN[ch];
            changed = true;
        } else if (/^[a-zA-Z0-9_-]+$/.test(ch)) {
            converted += ch;
        }
        // всё остальное игнорируем
    }

    if (changed || converted !== input.value) {
        input.value = converted;
        input.setSelectionRange(cursorPos, cursorPos);
    }
});


    input.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            if (commandHistory.length > 0) {
                event.preventDefault();
                if (historyIndex > 0) historyIndex--;
                if (historyIndex >= 0) {
                    input.value = commandHistory[historyIndex].command;
                }
            }
        } else if (event.key === 'ArrowDown') {
            if (commandHistory.length > 0) {
                event.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex].command;
                } else if (historyIndex === commandHistory.length - 1) {
                    historyIndex++;
                    input.value = '';
                }
            }
        }
    });

    saveButton.addEventListener('click', saveHistoryToFile);
    clearButton.addEventListener('click', clearHistory);

    // Автофокус на поле ввода и инициализация
    setTimeout(() => {
        input.focus();
        // Загружаем историю и статистику при старте
        updateStatsDisplay();
        updateHistoryDisplay();
    }, 100);
// Везде клик — возвращаем фокус на input
document.addEventListener('click', (e) => {
    if (e.target !== input) {
        input.focus();
    }
});

// При переключении вкладки обратно — фокус
window.addEventListener('focus', () => {
    input.focus();
});

// При случайной потере фокуса — восстанавливаем
input.addEventListener('blur', () => {
    setTimeout(() => input.focus(), 0);
});

        Priemyan.addEventListener('click', function () {
        const text = input.value.trim();
        openOrPriemYandexPvz();

});

function openOrPriemYandexPvz() {
        const windowName = 'yandex_pvz_prei';
        const url = 'https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request';
        const tab = window.open('', windowName);
        if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request')) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }
        return window.open(url, windowName);
    }
//---------------------------------------
        openBarcodeWindowBtn.addEventListener('click', () => {
    // Открываем окно на весь экран
    const win = window.open('', 'barcode_generator',
        'width=' + screen.width + ',height=' + screen.height + ',left=0,top=0,resizable=yes,scrollbars=yes');

    win.document.write(`
        <html>
        <head>
            <title>Генератор Штрихкодов</title>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <style>
                * {
                    box-sizing: border-box;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #f0f0f0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow: hidden;
                }

                .header {
                    background: linear-gradient(135deg, #2c3e50, #4a6491);
                    color: white;
                    padding: 20px 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }

                .controls-panel {
                    background: white;
                    padding: 25px;
                    margin: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                    flex-shrink: 0;
                }

                .input-group {
                    flex: 1;
                    min-width: 300px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }

                #barcodeInput {
                    width: 100%;
                    padding: 14px 18px;
                    font-size: 16px;
                    border-radius: 8px;
                    border: 2px solid #ddd;
                    transition: all 0.3s;
                    outline: none;
                }

                #barcodeInput:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
                }

                .buttons-group {
                    display: flex;
                    gap: 12px;
                    margin-left: auto;
                }

                .btn {
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-width: 140px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, #0056b3, #004494);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,91,187,0.3);
                }

                .btn-secondary {
                    background: linear-gradient(135deg, #28a745, #1e7e34);
                    color: white;
                }

                .btn-secondary:hover {
                    background: linear-gradient(135deg, #1e7e34, #155724);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(40,167,69,0.3);
                }

                .btn-print {
                    background: linear-gradient(135deg, #6c757d, #495057);
                    color: white;
                }

                .btn-print:hover {
                    background: linear-gradient(135deg, #495057, #343a40);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(108,117,125,0.3);
                }

                .barcode-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                    overflow: auto;
                    margin: 0 20px 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }

                #barcode {
                    max-width: 95%;
                    height: auto;
                    max-height: 70vh;
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                }

                .placeholder {
                    color: #999;
                    font-size: 18px;
                    text-align: center;
                    padding: 50px;
                }

                /* Стили для печати */
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    .barcode-container, .barcode-container * {
                        visibility: visible;
                    }

                    .barcode-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        background: white;
                    }

                    #barcode {
                        max-width: 100%;
                        max-height: 100%;
                        border: none;
                        padding: 0;
                    }

                    .no-print {
                        display: none !important;
                    }
                }

                .icon {
                    width: 20px;
                    height: 20px;
                }

                .icon-print {
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z'/%3E%3C/svg%3E") no-repeat center;
                }

                .icon-generate {
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
                }

                @media (max-width: 768px) {
                    .controls-panel {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .input-group {
                        min-width: 100%;
                    }

                    .buttons-group {
                        width: 100%;
                        margin-left: 0;
                        justify-content: stretch;
                    }

                    .btn {
                        flex: 1;
                        min-width: 0;
                    }

                    .header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Генератор Штрихкодов</h1>
                <div>Введите текст и нажмите "Сгенерировать"</div>
            </div>

            <div class="controls-panel no-print">
                <div class="input-group">
                    <label for="barcodeInput">Текст для генерации штрих-кода:</label>
                    <input id="barcodeInput" type="text" placeholder="Например: 123456789012" autofocus>
                </div>

                <div class="buttons-group">
                    <button id="generateBtn" class="btn btn-primary">
                        <span class="icon icon-generate"></span>
                        Сгенерировать
                    </button>
                    <button id="printBtn" class="btn btn-print">
                        <span class="icon icon-print"></span>
                        Печать
                    </button>
                </div>
            </div>

            <div class="barcode-container">
                <div id="placeholder" class="placeholder">
                    Штрих-код появится здесь после генерации
                </div>
                <svg id="barcode" style="display: none;"></svg>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const input = document.getElementById('barcodeInput');
                    const generateBtn = document.getElementById('generateBtn');
                    const printBtn = document.getElementById('printBtn');
                    const svg = document.getElementById('barcode');
                    const placeholder = document.getElementById('placeholder');

                    // Функция проверки загрузки библиотеки
                    function isJsBarcodeLoaded() {
                        return typeof JsBarcode !== 'undefined';
                    }

                    // Функция генерации штрих-кода
                    function generateBarcode() {
                        const text = input.value.trim();

                        if (!text) {
                            alert('Пожалуйста, введите текст для генерации штрих-кода!');
                            input.focus();
                            return;
                        }

                        if (!isJsBarcodeLoaded()) {
                            alert('Библиотека штрих-кодов загружается. Попробуйте через секунду.');
                            return;
                        }

                        try {
                            // Показываем SVG и скрываем плейсхолдер
                            svg.style.display = 'block';
                            placeholder.style.display = 'none';

                            // Очищаем предыдущий штрих-код
                            while (svg.firstChild) {
                                svg.removeChild(svg.firstChild);
                            }

                            // Генерируем новый штрих-код
                            JsBarcode(svg, text, {
                                format: "CODE128",
                                displayValue: true,
                                width: 2,
                                height: 120,
                                fontSize: 22,
                                margin: 15,
                                background: "#ffffff",
                                lineColor: "#000000",
                                textMargin: 5,
                                fontOptions: "bold"
                            });

                            // Добавляем информацию о штрих-коде
                            const info = document.createElement('div');
                            info.style.cssText = 'text-align: center; margin-top: 20px; color: #666; font-size: 14px;';


                            // Удаляем старую информацию, если есть
                            const oldInfo = svg.parentNode.querySelector('.barcode-info');
                            if (oldInfo) {
                                oldInfo.remove();
                            }

                            info.className = 'barcode-info';
                            svg.parentNode.appendChild(info);

                            // Фокус на поле ввода
                            input.focus();

                        } catch (error) {
                            alert('Ошибка при генерации штрих-кода: ' + error.message);
                            console.error(error);
                        }
                    }

                    // Функция печати
                    function printBarcode() {
                        if (svg.style.display === 'none' || !svg.hasChildNodes()) {
                            alert('Сначала сгенерируйте штрих-код для печати!');
                            return;
                        }

                        // Настройка стилей для печати
                        const printStyles = document.createElement('style');
                        printStyles.textContent = \`
                            @media print {
                                body { margin: 0; padding: 0; }
                                .barcode-container {
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    height: 100vh !important;
                                    width: 100vw !important;
                                    margin: 0 !important;
                                    padding: 20px !important;
                                }
                                #barcode {
                                    max-width: 100% !important;
                                    max-height: 100% !important;
                                }
                            }
                        \`;
                        document.head.appendChild(printStyles);

                        // Печать
                        window.print();

                        // Удаляем стили после печати
                        setTimeout(() => {
                            document.head.removeChild(printStyles);
                        }, 100);
                    }

                    // Обработчики событий
                    generateBtn.addEventListener('click', generateBarcode);
                    printBtn.addEventListener('click', printBarcode);

                    input.addEventListener('keypress', e => {
                        if (e.key === 'Enter') {
                            generateBarcode();
                        }
                    });

                    // Автоматическая генерация при загрузке, если есть текст в localStorage
                    window.addEventListener('load', () => {
                        const savedText = localStorage.getItem('lastBarcodeText');
                        if (savedText) {
                            input.value = savedText;
                            setTimeout(() => {
                                if (isJsBarcodeLoaded()) {
                                    generateBarcode();
                                }
                            }, 500);
                        }
                    });

                    // Сохраняем текст при вводе
                    input.addEventListener('input', () => {
                        localStorage.setItem('lastBarcodeText', input.value);
                    });

                    // Фокус на поле ввода
                    input.focus();
                });
            </script>
        </body>
        </html>
    `);

    win.document.close();
});

        //--------------------------------


    } else {
//-------------------------------------------------------------------------------------------------
    const REMINDERS = [
        {
            match: "pvz.avito.ru/accept",
            title: "📦 Габариты для приемки",
            message: `<b>•</b> Максимальная сумма сторон 2.4м<br><b>•</b> Одна сторона не более 120см`,
        },
      {
            match: "https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request/",
            requireExtraPath: true,
            title: "ℹ️ Что нельзя отправлять через Яндекс Доставку",
            message: `<strong>Запрещено к отправке:</strong><br><b>•</b> Вещества, способные к детонации или взрыву
<b>•</b> Газы, легко воспламеняющиеся при нормальных условиях
<b>•</b> Жидкости с низкой температурой воспламенения
<b>•</b> Твёрдые вещества, способные к самовозгоранию
<b>•</b> Окислители, способные вызывать возгорание других веществ
<b>•</b> Ядовитые вещества и биологически опасные материалы
<b>•</b> Источники ионизирующего излучения
<b>•</b> Едкие и коррозирующие вещества, вызывающие разрушение материалов и способные причинить вред здоровью
<b>•</b> Материалы и устройства, представляющие угрозу при перевозке
<b>•</b> Оружие всех типов, боеприпасы, а также средства самообороны в том числе и муляжи
<b>•</b> Контролируемые вещества, влияющие на психику
<b>•</b> Драгоценные металлы и натуральные драгоценные камни и изделия их содержащие
<b>•</b> Денежные средства и иные ценные финансовые документы
<b>•</b> Животные и их части, насекомые
<b>•</b> Любые продукты животного и растительного происхождения, а также любые продукты питания и корма для животных
<b>•</b> Останки, органы и биоматериалы человека
<b>•</b> Алкогольная пищевая спиртосодержащая продукция как имеющая, так и не имеющая акцизную марку
<b>•</b> Табак всех видов и его производные, а также электронные сигареты и относящиеся к ним товары
<b>•</b> Официальные документы, подтверждающие личность
<b>•</b> Изделия, имеющие историческую, научную или культурную ценность
<b>•</b> Продукция, подлежащая экспортному контролю и имеющая военное назначение
<b>•</b> Продукция, содержащая сцены порнографического характера
<b>•</b> Продукция, нарушающая права или интересы граждан и государства
<b>•</b> Товары с неустановленным или подозрительным содержанием
<b>•</b> Живые растения и цветы
<b>•</b> Любые иные предметы, оборот которых запрещен или ограничен на территории Российской Федерации
<b>•</b> Предметы, которые требуют для перевозки специально оборудованные транспортные средства (имеющие датчики температуры/влажности/кантования/наклона/удара и т.д.)
<b>•</b> Любые медикаменты и медицинские препараты. Биологически активные добавки и лекарственные травы

`,
        },


    ];

    /* ============================================= */

   // let currentURL = location.href;
    let reminderBox = null;

    function checkAndShow() {
        if (reminderBox) {
            reminderBox.remove();
            reminderBox = null;
        }

        for (const r of REMINDERS) {
            if (location.href.includes(r.match)) {
                showFloating(r.title, r.message);
                break; // показываем только одно напоминание
            }
        }
    }

  function showFloating(title, msg) {
    const box = document.createElement("div");
    reminderBox = box;

    box.style.cssText = `
        position:fixed;
        top:24px;
        right:24px;
        width:360px;
        max-height:75vh;
        backdrop-filter: blur(6px);
        border-radius:16px;
        box-shadow:
            0 10px 25px rgba(0,0,0,0.15),
            0 2px 6px rgba(0,0,0,0.08);
        z-index:999999;
        font-family: Inter, Arial, sans-serif;
        overflow:hidden;
        cursor:grab;
        animation: remFadeIn 0.25s ease-out;
    `;

    box.innerHTML = `
        <style>
            @keyframes remFadeIn {
                from { opacity:0; transform:translateY(-10px); }
                to   { opacity:1; transform:translateY(0); }
            }
            .rem-body::-webkit-scrollbar {
                width:6px;
            }
            .rem-body::-webkit-scrollbar-thumb {
                background:#cfd4dc;
                border-radius:6px;
            }
            .rem-body::-webkit-scrollbar-thumb:hover {
                background:#b0b7c3;
            }
            .rem-close:hover {
                background:rgba(255,255,255,0.25);
            }
        </style>

        <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:12px 16px;
            background:linear-gradient(135deg,#3159a3,#263f5c);
            color:#fff;
        ">
            <div style="
                font-weight:600;
                font-size:15px;
                line-height:1.2;
            ">${title}</div>

            <button class="rem-close"
                style="
                    background:none;
                    border:none;
                    color:#fff;
                    font-size:18px;
                    cursor:pointer;
                    border-radius:8px;
                    width:28px;
                    height:28px;
                ">❎</button>
        </div>

        <div class="rem-body" style="
            padding:14px 16px;
            font-size:14px;
            line-height:1.45;
            color:#333;
            overflow-y:auto;
            max-height:calc(75vh - 56px);
            white-space:pre-wrap;
        ">${msg}</div>
    `;

    document.body.appendChild(box);

    box.querySelector(".rem-close").onclick = () => {
        box.remove();
        reminderBox = null;
    };

    // ---- drag ----
    let dragging = false, offsetX = 0, offsetY = 0;

    box.addEventListener("mousedown", e => {
        if (e.target.tagName !== "BUTTON") {
            dragging = true;
            box.style.cursor = "grabbing";
            offsetX = box.offsetLeft - e.clientX;
            offsetY = box.offsetTop - e.clientY;
        }
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        box.style.cursor = "grab";
    });

    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        box.style.left = e.clientX + offsetX + "px";
        box.style.top = e.clientY + offsetY + "px";
        box.style.right = "auto";
    });
}


    function observeURLChanges() {
        const observer = new MutationObserver(() => {
            if (currentURL !== location.href) {
                currentURL = location.href;
                checkAndShow();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    checkAndShow();
    observeURLChanges();
    }

})();