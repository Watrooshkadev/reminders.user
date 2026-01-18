
// ==UserScript==
// @name         Reminders (Local Config, SPA)
// @namespace    reminders_local
// @version      3.6
// @description  Напоминания для сайтов + большое центральное окно
// @author       Watrooshka
// @updateURL    https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @downloadURL  https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// ==/UserScript==
(function() {
    'use strict';
    const DELETE_PASSWORD_HASH = '09b56f21e3c4370acc15a9e76ed4064f50d06085b630f7b2e736d8a90b369923';
    const GIST_FILE = 'reminders_history.json';
    const SCRIPT_VERSION = GM_info?.script?.version || 'dev';
    const UID_YA = "148822177";

    let currentURL = location.href;
/* const input = document.querySelector('[data-testid="client-issuing-search-suggest"]');

if (input && document.activeElement !== input) {
    input.focus();
} */

fokus();
function fokus(){

const savedState = GM_getValue('boxfokus', true); // true — значение по умолчанию
if(savedState){
    if (location.pathname === '/tpl-outlet/148822177/issuing') {
        const selector = '[data-testid="client-issuing-search-suggest"]';
const focusInput = () => {
    const input = document.querySelector(selector);
    if (input && document.activeElement !== input) {
        input.focus();
    }
};

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        focusInput();
    }
});

// фокус при обновлении / первом открытии
window.addEventListener('load', focusInput);


    } else if (location.pathname === '/tpl-outlet/148822177/acceptance-request') {
    const selector = 'input[inputmode="search"][type="text"]'; // универсальный селектор

    const focusInput = () => {
        const input = document.querySelector(selector);
        if (input && document.activeElement !== input) {
            input.focus();
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            focusInput();
        }
    });

    window.addEventListener('load', focusInput);
}
}
}

/*     if (location.href.includes('https://hubs.market.yandex.ru/tpl-outlet/148822177/issuing')) {
function sendKey(char) { document.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: 'Digit' + char, bubbles: true })); }
        async function realPaste(text) {
    await navigator.clipboard.writeText(text);

    document.activeElement.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'v',
            code: 'KeyV',
            ctrlKey: true,
            bubbles: true
        })
    );
}
    } */



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
    margin: 0px;
    padding: 16px;

    background: white;
    border-radius: var(--radius-sm);
    border: 0px solid var(--border);

    overflow-y: auto;
}

/* Input */
#userInput {
    width: calc(100% - 32px);
    margin: 15 15px 2px;
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
.del-btn {
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

.yanbt-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #957700;
    cursor: pointer;

    transition: background .15s;
}
.yan-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #957700;
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
async function initCredentials() {
    const ENCRYPTED_GIST_ID = 'U2FsdGVkX1+PxFYY5kZdfXXPpttyEl9FaoiBj+oNhFAuKsxL+LrYqKFC5KY4dZn7e9xeY4XMb2fWPP0gAyuskQ==';
    const ENCRYPTED_GITHUB_TOKEN = 'U2FsdGVkX18bKy2psUjPHJyp6UvuznDUGEDz2toxz8Oibo5XeV7QFNXFXpBohx7G1H8zI8iCEus5toh8HYcsjGThP28HMwUYYoobEWwhlk3sVJ5MsftCTw5YVeG/KZbjE5GOrhPuV9u8l/dzioWw/g==';

    // Запрос пароля один раз
    const password = prompt('Введите пароль для синхронизации:');
    if (!password) {
        GM_setValue('GITHUB_TOKEN', '0');
        GM_setValue('GIST_ID', '0');
        return { GITHUB_TOKEN: '0', GIST_ID: '0' };
    }

    try {
        // Расшифровка через CryptoJS
        const GIST_ID = CryptoJS.AES.decrypt(ENCRYPTED_GIST_ID, password).toString(CryptoJS.enc.Utf8);
        const GITHUB_TOKEN = CryptoJS.AES.decrypt(ENCRYPTED_GITHUB_TOKEN, password).toString(CryptoJS.enc.Utf8);

        if (!GIST_ID || !GITHUB_TOKEN) {
            GM_setValue('GITHUB_TOKEN', '0');
            GM_setValue('GIST_ID', '0');
            alert('Неверный пароль!');
            return { GITHUB_TOKEN: '0', GIST_ID: '0' };
        }

        // Сохраняем токен через GM_setValue
        GM_setValue('GITHUB_TOKEN', GITHUB_TOKEN);
        GM_setValue('GIST_ID', GIST_ID);

        return { GITHUB_TOKEN, GIST_ID };

    } catch (e) {
        GM_setValue('GITHUB_TOKEN', '0');
        GM_setValue('GIST_ID', '0');
        alert('Ошибка расшифровки!');
        console.error(e);
        return { GITHUB_TOKEN: '0', GIST_ID: '0' };
    }
}

(async () => {
    const { GITHUB_TOKEN, GIST_ID } = await initCredentials();

})();



        async function checkPassword(input) {
            if (!input) return false; // если null или пустая строка, сразу false

            const hashBuffer = await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(input)
            );

            const hex = [...new Uint8Array(hashBuffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');

            return hex === DELETE_PASSWORD_HASH;
        } //256


        // Загружаем историю из сохраненных данных
        let commandHistory = GM_getValue('commandHistory', []);
        let selectedDate = null; // YYYY-MM-DD или null

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

        const versionLabel = document.createElement('span');
        versionLabel.textContent = `v${SCRIPT_VERSION}`;
        versionLabel.style.cssText = `
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 10px;
`;


        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        const Priemyan = document.createElement('button');
        Priemyan.className = 'action-button';
        Priemyan.textContent = "ПРИЕМКА Яндекс (Водители/Продавцы)";

        const syncBtn = document.createElement('button');
        syncBtn.className = 'action-button';
        syncBtn.textContent = '☁️ Sync';
        syncBtn.onclick = smartSync;

        const loadBtn = document.createElement('button');
        loadBtn.className = 'action-button';
        loadBtn.textContent = '⬇ Load';
        loadBtn.onclick = loadFromGist;



        // Кнопка открытия отдельного окна генератора ШК
        const openBarcodeWindowBtn = document.createElement('button');
        openBarcodeWindowBtn.className = 'action-button';
        openBarcodeWindowBtn.title = 'Открыть генератор ШК';
        openBarcodeWindowBtn.textContent = 'Генератор ШК / Маркировка';

        // Поле ввода
        const input = document.createElement('input');
        input.id = 'userInput';
        input.type = 'text';
        input.placeholder = 'Введите текст и нажмите Enter...';

        // Статус
        const status = document.createElement('div');
        status.id = 'inputStatus';
        status.textContent = 'Здесь ТОЛЬКО Выдача и приемка авито, По яндексу нажатие по списку';

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


        const breakStat = document.createElement('div');
        breakStat.className = 'stat-item';

        const breakValue = document.createElement('div');
        breakValue.className = 'stat-value';
        breakValue.textContent = '—';

        const breakLabel = document.createElement('div');
        breakLabel.className = 'stat-label';
        breakLabel.textContent = 'Макс. перерыв';

        const syncIndicator = document.createElement('span');
        syncIndicator.id = 'syncIndicator';
        syncIndicator.style.cssText = `
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 6px;
    border-radius: 50%;
    background: #ccc; /* серый - не синхронизировано */
    vertical-align: middle;
`;
        const syncIndicatortext = document.createElement('span');
        syncIndicatortext.textContent = `Синхронизация`;
        syncIndicatortext.style.cssText = `
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 10px;
`;
        // Фильтр по дате
        const dateFilter = document.createElement('input');
        dateFilter.type = 'date';
        dateFilter.title = 'Показать историю за выбранную дату';
        dateFilter.style.marginLeft = '10px';
        dateFilter.style.padding = '5px';
        dateFilter.style.fontSize = '13px';
        dateFilter.style.width = '100px';
        dateFilter.style.maxWidth = '200px';
        dateFilter.style.minWidth = '120px';
        dateFilter.style.boxSizing = 'border-box'; // учитываем паддинги
// добавляем событие, чтобы клик по всему полю открывал календарь
dateFilter.addEventListener('click', (e) => {
    // вызываем фокус, чтобы календарь открылся
    dateFilter.showPicker?.(); // современный метод в Chrome/Edge
    dateFilter.focus(); // fallback для других браузеров
});
const autoFocusToggle = document.createElement('label');
autoFocusToggle.style.display = 'flex';
autoFocusToggle.style.alignItems = 'center';
autoFocusToggle.style.gap = '5px';
autoFocusToggle.style.fontSize = '13px';

const autoFocusCheckbox = document.createElement('input');
autoFocusCheckbox.type = 'checkbox';

autoFocusToggle.appendChild(autoFocusCheckbox);
autoFocusToggle.appendChild(document.createTextNode('Автофокус на поле ввода Яндекс (Работает только после обновление стр. яндекса'));

buttonsContainer.appendChild(autoFocusToggle);
// Получаем значение при инициализации
const savedState = GM_getValue('boxfokus', true); // true — значение по умолчанию
autoFocusCheckbox.checked = savedState;

autoFocusCheckbox.addEventListener('change', () => {
    GM_setValue('boxfokus', autoFocusCheckbox.checked);
});



        breakStat.appendChild(breakValue);
        breakStat.appendChild(breakLabel);

        title.appendChild(versionLabel);
        title.appendChild(syncIndicatortext);
        title.appendChild(syncIndicator);

        // Собираем статистику
        avitoStat.appendChild(avitoValue);
        avitoStat.appendChild(avitoLabel);
        avitoStat1.appendChild(avitoValue1);
        avitoStat1.appendChild(avitoLabel1);
        yandexStat.appendChild(yandexValue);
        yandexStat.appendChild(yandexLabel);



        statsContainer.appendChild(breakStat);
        statsContainer.appendChild(avitoStat);
        statsContainer.appendChild(avitoStat1);
        statsContainer.appendChild(yandexStat);

        // Область для истории
        const contentArea = document.createElement('div');
        contentArea.className = 'content-area';

        // Собираем структуру
        buttonsContainer.appendChild(dateFilter);

        buttonsContainer.appendChild(syncBtn);
        //buttonsContainer.appendChild(loadBtn);
        buttonsContainer.appendChild(Priemyan);
        buttonsContainer.appendChild(openBarcodeWindowBtn);
        header.appendChild(title);
        header.appendChild(buttonsContainer);

        container.appendChild(header);
        container.appendChild(input);
        container.appendChild(status);
        container.appendChild(statsContainer);
        container.appendChild(contentArea);

        document.body.appendChild(container);

        function getVisibleHistory() {
            return commandHistory.filter(item =>
                                         !selectedDate ||
                                         (item.date && item.date.startsWith(selectedDate))
                                        );
        }


        // Функция для определения типа команды
        function getCommandType(command) {
            if (/^\d{10}$/.test(command)) {
                return command.startsWith('50')
                    ? 'АВИТОПРИЕМКА'
                : 'АВИТОВЫДАЧА';
            }
            return 'ЯНДЕКС';
        }

        (async () => {
            try {
                const tokengist = GM_getValue('GIST_ID');
                const res = await fetch(`https://api.github.com/gists/${tokengist}`);
                if (res.ok) {
                    const data = await res.json();
                    const remoteHistory = JSON.parse(data.files[GIST_FILE].content).commandHistory || [];
                    const localHistory = GM_getValue('commandHistory', []);
                    if (JSON.stringify(remoteHistory) === JSON.stringify(localHistory)) {
                        updateSyncIndicator('ok');
                    } else {
                        updateSyncIndicator('pending');
                    }
                } else {
                    updateSyncIndicator('error');
                }
            } catch(e) {
                updateSyncIndicator('error');
            }
        })(); //синх

        function updateSyncIndicator(status) {
            // status = 'ok' | 'pending' | 'error'
            if (!syncIndicator) return;
            console.log(status);
            if (status === 'ok') {
                syncIndicator.style.background = '#27ae60'; // зеленый
                syncIndicatortext.textContent = 'Синхронизировано';
            } else if (status === 'pending') {
                syncIndicator.style.background = '#f39c12'; // оранжевый
                syncIndicatortext.textContent = 'Идет синхронизация';
            } else if (status === 'error') {
                syncIndicator.style.background = '#e74c3c'; // красный
                syncIndicatortext.textContent = 'Ошибка синхронизации';
            }
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
        function calculateStatsByDate() {
            const stats = {
                avito: 0,// АВИТОВЫДАЧА
                avito1: 0,// АВИТОПРИЕМКА
                yandex: 0,// ЯНДЕКС
                total: 0// всего команд
            };

            commandHistory.forEach(item => {
                // Если выбрана дата, фильтруем по дню
                if (selectedDate) {
                    const date = new Date(selectedDate); // yyyy-mm-dd из input
                    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

                    const itemDate = new Date(item.date);
                    if (itemDate < startDate || itemDate > endDate) return; // пропускаем, если не попадает в день
                }

                stats.total++;

                const type = item.type || getCommandType(item.command);
                if (type === 'АВИТОВЫДАЧА') stats.avito++;
                else if (type === 'АВИТОПРИЕМКА') stats.avito1++;
                else stats.yandex++;
            });

            return stats;
        }

        function calculateMaxBreak() {
            // Получаем отфильтрованную историю по дате (если выбрана)
            let data = commandHistory;

            if (selectedDate) {
                const date = new Date(selectedDate); // yyyy-mm-dd из input
                const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

                data = commandHistory.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate >= startDate && itemDate <= endDate;
                });
            }

            if (data.length < 2) return null;

            let max = {
                duration: 0,
                from: null,
                to: null
            };

            for (let i = 1; i < data.length; i++) {
                const prevItem = data[i - 1];
                const currItem = data[i];

                const prevTime = new Date(prevItem.date).getTime();
                const currTime = new Date(currItem.date).getTime();
                const diff = currTime - prevTime;

                if (diff > max.duration) {
                    max = {
                        duration: diff,
                        from: prevItem,
                        to: currItem
                    };
                }
            }

            return max;
        }

        function formatTimeRange(fromItem, toItem) {
            const from = new Date(fromItem.date);
            const to = new Date(toItem.date);

            const fromStr = from.toLocaleTimeString();
            const toStr = to.toLocaleTimeString();

            return `${fromStr} → ${toStr}`;
        }
        function formatDuration(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            if (minutes === 0) {
                return `${seconds} сек`;
            }

            return `${minutes} мин ${seconds} сек`;
        }
        // Функция для обновления отображения статистики
        function updateStatsDisplay() {
            const stats = calculateStatsByDate();
            avitoValue.textContent = stats.avito;
            avitoValue1.textContent = stats.avito1;
            yandexValue.textContent = stats.yandex;

            const maxBreak = calculateMaxBreak();

            if (maxBreak) {
                breakValue.textContent = formatDuration(maxBreak.duration);
                breakLabel.textContent =
                    `Макс. перерыв между КЛ: ${formatTimeRange(maxBreak.from, maxBreak.to)}`;
            } else {
                breakValue.textContent = '—';
                breakLabel.textContent = 'Макс. перерыв';
            }
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

            // применяем сортировку + фильтр ТОЛЬКО для отображения
            const visibleItems = [...getVisibleHistory()]
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .filter(item =>
                    !selectedDate ||
                    (item.date && item.date.startsWith(selectedDate))
                   );

            if (visibleItems.length === 0) {
                contentArea.innerHTML = selectedDate
                    ? '<div class="empty-history">Нет команд за выбранную дату</div>'
                : '<div class="empty-history">История команд пуста</div>';
                return;
            }

            let historyHTML = '';

            visibleItems.forEach((item) => {
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

                    ${type === 'АВИТОПРИЕМКА' || type === 'АВИТОВЫДАЧА'
            ? `<button class="invoice-btn" data-command="${command}">История заказа</button>`
                        : ''
    }

                    ${type === 'ЯНДЕКС'
            ? `<button class="yanbt-btn" data-command="${command}">Отправить</button>
                           <button class="yan-btn" data-command="${command}">Выдать</button>`
                        : ''
    }

                    <button class="barcode-btn" data-command="${command}">ШК</button>
                    <button class="copy-btn" data-command="${command}">Копировать</button>
                    <button class="del-btn" data-command="${command}">🗑️</button>
                </div>
            </div>
        `;
    });

            contentArea.innerHTML = historyHTML;

            // ---------------- УДАЛЕНИЕ ----------------
            contentArea.querySelectorAll('.del-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    const command = this.getAttribute('data-command');

                    const password = prompt('Введите пароль для удаления:');
                    if (!password) {
                        showStatus('Удаление отменено', '#e74c3c');
                        return;
                    }

                    const ok = await checkPassword(password);
                    if (!ok) {
                        showStatus('Неверный пароль', '#e74c3c');
                        return;
                    }

                    const index = commandHistory.findIndex(i => i.command === command);
                    if (index !== -1) {
                        commandHistory.splice(index, 1);
                        GM_setValue('commandHistory', commandHistory);
                        updateStatsDisplay();
                        updateHistoryDisplay();
                        showStatus(`Удалено: ${command}`, '#27ae60');
                        syncToGist();
                    }
                });
            });

            // ---------------- КОПИРОВАНИЕ ----------------
            contentArea.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                    showStatus(`Скопировано: ${command}`, '#27ae60');
                });
            });

            // ---------------- НАКЛАДНАЯ ----------------
            contentArea.querySelectorAll('.invoice-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    window.open(`https://pvz.avito.ru/history/${command}`, '_blank');
                    showStatus(`Открыта накладная: ${command}`, '#ff9500');
                });
            });

            // ---------------- ЯНДЕКС ----------------
            contentArea.querySelectorAll('.yanbt-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    showStatus(`Команда ЯНДЕКС: ${command} (скопировано)`, '#27ae60');
                    // Копируем в буфер обмена
                    copyToClipboard(command);
                    openOrFocusYandexPvzpri();
                });
            });

            contentArea.querySelectorAll('.yan-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    showStatus(`Команда ЯНДЕКС: ${command} (скопировано)`, '#27ae60');
                    // Копируем в буфер обмена
                    copyToClipboard(command);
                    openOrFocusYandexPvz();
                });
            });

            // ---------------- ШТРИХКОД ----------------
            contentArea.querySelectorAll('.barcode-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    const win = window.open('', '_blank');

                    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Штрихкод ${command}</title>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
<style>
html,body{
    margin:0;
    width:100vw;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#fff;
}
svg{max-width:90%;max-height:90%;}
</style>
</head>
<body>
<svg id="barcode"></svg>
<script>
JsBarcode("#barcode","${command}",{
    format:"CODE128",
    displayValue:true,
    width:4,
    height:200,
    fontSize:40
});
</script>
</body>
</html>
            `);

            win.document.close();
            showStatus(`Штрихкод сгенерирован: ${command}`, '#8e44ad');
        });
    });
        }
        dateFilter.addEventListener('change', () => {
            selectedDate = dateFilter.value || null;
            updateHistoryDisplay();
            updateStatsDisplay();
        });

        // Функция для отображения статуса
        function showStatus(message, color = '#666') {
            status.style.display = ''
            status.textContent = message;
            status.style.color = color;
            setTimeout(() => {
                status.style.color = '#666';
                status.style.display = 'none'
            }, 10000);
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
        function openOrFocusYandexPvzpri() {
            const windowName = 'yandex_pvz_deliver_tab_pri';
            const url = 'https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request';
            const tab = window.open('', windowName);
            if (tab && !tab.closed) {
                tab.focus();
                try {
                    if (!tab.location.href.includes("https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request")) {
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

            smartSync();
            // Ваша логика обработки команд
            if (commandType === 'АВИТОВЫДАЧА') {
                showStatus(`Команда АВИТОВЫДАЧА: ${text} (скопировано)`, '#27ae60');
                openOrFocusAvitoPvz(text);
            } else if (commandType === 'АВИТОПРИЕМКА') {
                showStatus(`Команда АВИТОПРИЕМКА: ${text} (скопировано)`, '#27ae60');
                openOrFocusAvitoPiemk(text);
            } else {
                //showStatus(`Команда ЯНДЕКС: ${text} (скопировано)`, '#27ae60');
                //openOrFocusYandexPvz();
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
        //---------------------------------------НАЧАЛО ГЕНЕРАТОРА
        /*   openBarcodeWindowBtn.addEventListener('click', () => {
    const win = window.open('', 'barcode_generator',
        `width=${screen.width},height=${screen.height},left=0,top=0,resizable=yes,scrollbars=yes`);

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Генератор ШК</title>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f0f0f0;
}

.header {
    background: #2c3e50;
    color: white;
    padding: 15px;
    text-align: center;
}

.controls {
    background: white;
    padding: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.controls input,
.controls button,
.controls select {
    padding: 10px;
    font-size: 14px;
}

.container {
    background: white;
    margin: 20px;
    padding: 20px;
    text-align: center;
}

#barcode {
    margin-top: 20px;
}

#labelContainer {
    display: none;
    margin-bottom: 20px;
}

#labelIcons {
    font-size: 40px;
}

#labelText {
    font-size: 48px;
    font-weight: 900;
    letter-spacing: 5px;
}

@media print {
    body * { visibility: hidden; }

    #printArea, #printArea * {
        visibility: visible;
    }

    #printArea {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>
</head>

<body>

<div class="header">
    <h2>Генератор штрих-кодов и маркировки</h2>
</div>

<div class="controls">
    <input id="barcodeInput" placeholder="Введите код">

    <button id="generateBtn">Сгенерировать ШК</button>

    <select id="labelMode">
        <option value="fragile">⚠ Хрупко</option>
        <option value="glass">🍷 Стекло</option>
        <option value="careful">⬆ Осторожно</option>
    </select>

    <button id="toggleLabelBtn">Показать / скрыть</button>

    <button id="printLabelOnlyBtn">🖨 Только маркировка</button>
    <button id="printBtn">Печать</button>
</div>

<div class="container" id="printArea">

    <div id="labelContainer">
        <div id="labelIcons"></div>
        <div id="labelText"></div>
    </div>

    <svg id="barcode"></svg>

</div>

<script>
const input = document.getElementById('barcodeInput');
const barcodeSvg = document.getElementById('barcode');

const labelContainer = document.getElementById('labelContainer');
const labelIcons = document.getElementById('labelIcons');
const labelText = document.getElementById('labelText');
const labelMode = document.getElementById('labelMode');

let labelVisible = false;
let printOnlyLabel = false;

const LABELS = {
    fragile: { text: 'ХРУПКО', icons: '📦 ⚠ 📦' },
    glass: { text: 'СТЕКЛО', icons: '🍷 ⚠ 🍷' },
    careful: { text: 'ОСТОРОЖНО', icons: '⬆ ⬆ ⬆' }
};

function updateLabel() {
    const m = LABELS[labelMode.value];
    labelText.textContent = m.text;
    labelIcons.textContent = m.icons;
}

document.getElementById('generateBtn').onclick = () => {
    if (!input.value.trim()) return alert('Введите код');
    JsBarcode(barcodeSvg, input.value, {
        format: 'CODE128',
        displayValue: true,
        width: 2,
        height: 120,
        fontSize: 22
    });
};

document.getElementById('toggleLabelBtn').onclick = () => {
    labelVisible = !labelVisible;
    labelContainer.style.display = labelVisible ? 'block' : 'none';
    if (labelVisible) updateLabel();
};

labelMode.onchange = () => {
    if (labelVisible) updateLabel();
};

document.getElementById('printLabelOnlyBtn').onclick = () => {
    printOnlyLabel = true;
    labelVisible = true;
    labelContainer.style.display = 'block';
    updateLabel();
    barcodeSvg.style.display = 'none';
};

document.getElementById('printBtn').onclick = () => {
    if (!labelVisible && !barcodeSvg.hasChildNodes()) {
        alert('Нечего печатать');
        return;
    }

    window.print();

    if (printOnlyLabel) {
        barcodeSvg.style.display = 'block';
        printOnlyLabel = false;
    }
};
</script>

</body>
</html>
    `);

    win.document.close();
});*/
        openBarcodeWindowBtn.addEventListener('click', () => {
            const win = window.open('', 'barcode_generator',
                                    `width=${screen.width},height=${screen.height},left=0,top=0,resizable=yes,scrollbars=yes`);

            win.document.write(`
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Генератор ШК и маркировки</title>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
<style>
body { margin: 0; font-family: Arial, sans-serif; width: 100%; height: 100%; background: #ffffff; text-align: center; }
.controls { padding: 10px; background: #fff; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.controls input, .controls button, .controls select { padding: 8px; font-size: 14px; }
#labelContainer { display: none; font-size: 48px; font-weight: bold; margin: 20px 0; }
#labelIcons { font-size: 40px; display: block; }
#barcode { margin: 20px 0; }
@media print {
  body { margin: 0; }
  .controls { display: none; }
  #barcode, #labelContainer { width: 100%; margin: 0; }
}
</style>
</head>
<body>

<div class="controls">
  <input id="barcodeInput" placeholder="Введите код">
  <button id="generateBtn">Сгенерировать ШК</button>
  <select id="labelMode">
    <option value="fragile">⚠ Хрупко</option>
    <option value="glass">🍷 Стекло</option>
    <option value="careful">⬆ Осторожно</option>
  </select>
  <button id="toggleLabelBtn">Показать / скрыть</button>
  <button id="printLabelOnlyBtn">🖨 Только маркировка</button>
  <button id="printBtn">Печать</button>
</div>

<div id="labelContainer">
  <div id="labelIcons"></div>
  <div id="labelText"></div>
</div>

<svg id="barcode"></svg>

<script>
const input = document.getElementById('barcodeInput');
const barcodeSvg = document.getElementById('barcode');
const labelContainer = document.getElementById('labelContainer');
const labelIcons = document.getElementById('labelIcons');
const labelText = document.getElementById('labelText');
const labelMode = document.getElementById('labelMode');

let labelVisible = false;
let printOnlyLabel = false;

const LABELS = {
  fragile: { text: 'ХРУПКО', icons: '📦 ⚠ 📦' },
  glass: { text: 'СТЕКЛО', icons: '🍷 ⚠ 🍷' },
  careful: { text: 'ОСТОРОЖНО', icons: '⬆ ⬆ ⬆' }
};

function updateLabel() {
  const m = LABELS[labelMode.value];
  labelText.textContent = m.text;
  labelIcons.textContent = m.icons;
}

document.getElementById('generateBtn').onclick = () => {
  if (!input.value.trim()) return alert('Введите код');
  JsBarcode(barcodeSvg, input.value, { format: 'CODE128', displayValue: true, width: 2, height: 120, fontSize: 22 });
};

document.getElementById('toggleLabelBtn').onclick = () => {
  labelVisible = !labelVisible;
  labelContainer.style.display = labelVisible ? 'block' : 'none';
  if (labelVisible) updateLabel();
};

labelMode.onchange = () => { if (labelVisible) updateLabel(); };

document.getElementById('printLabelOnlyBtn').onclick = () => {
  printOnlyLabel = true;
  labelVisible = true;
  labelContainer.style.display = 'block';
  updateLabel();
  barcodeSvg.style.display = 'none';
};

document.getElementById('printBtn').onclick = () => {
  if (!labelVisible && !barcodeSvg.hasChildNodes()) return alert('Нечего печатать');
  window.print();
  if (printOnlyLabel) { barcodeSvg.style.display = 'block'; printOnlyLabel = false; }
};
</script>

</body>
</html>
    `);
            win.document.close();
        });

        /* ---------------------------------------------------------------------------КОНЕЦ ГЕНЕРАТОРА */

        async function syncToGist() {
            const tokengist = GM_getValue('GIST_ID');
            const token = GM_getValue('GITHUB_TOKEN');
            if (!token) return alert('Нет GitHub Token');

            const history = GM_getValue('commandHistory', []);

            await fetch(`https://api.github.com/gists/${tokengist}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [GIST_FILE]: {
                            content: JSON.stringify({ commandHistory: history }, null, 2)
                        }
                    }
                })
            });

           // showStatus('История синхронизирована ↑', '#27ae60');
        }

        async function loadFromGist() {
            const tokengist = GM_getValue('GIST_ID');
            const res = await fetch(`https://api.github.com/gists/${tokengist}`);
            const data = await res.json();

            const content = data.files[GIST_FILE].content;
            const parsed = JSON.parse(content);

            GM_setValue('commandHistory', parsed.commandHistory || []);
            commandHistory = parsed.commandHistory || [];

            updateStatsDisplay();
            updateHistoryDisplay();

            //showStatus('История загружена ↓', '#007aff');
        }


        async function smartSync() {
            const tokengist = GM_getValue('GIST_ID');
            const token = GM_getValue('GITHUB_TOKEN');
            if (!token) return alert('Нет GitHub Token');

            const localHistory = GM_getValue('commandHistory', []);

            updateSyncIndicator('pending'); // пока синхронизируем

            let remoteHistory = [];
            try {
                const res = await fetch(`https://api.github.com/gists/${tokengist}`);
                if (!res.ok) throw new Error('Не удалось загрузить Gist');
                const data = await res.json();
                remoteHistory = JSON.parse(data.files[GIST_FILE].content).commandHistory || [];
            } catch (e) {
                console.warn('Gist недоступен или пуст:', e);
                updateSyncIndicator('error');
            }

            // Объединяем истории
            const mergedMap = new Map();
            [...remoteHistory, ...localHistory].forEach(item => {
                mergedMap.set(item.timestamp + item.command, item);
            });
            const mergedHistory = Array.from(mergedMap.values()).sort((a,b) => a.timestamp - b.timestamp);

            // Если есть изменения → пушим
            const needUpdate = JSON.stringify(mergedHistory) !== JSON.stringify(remoteHistory);

            if (needUpdate) {
                try {
                    await fetch(`https://api.github.com/gists/${tokengist}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            files: {
                                [GIST_FILE]: { content: JSON.stringify({ commandHistory: mergedHistory }, null, 2) }
                            }
                        })
                    });
                    //updateSyncIndicator('ok');
                   // showStatus('История синхронизирована ↑', '#27ae60');
                } catch (e) {
                    console.error('Ошибка при обновлении Gist:', e);
                    updateSyncIndicator('error');
                    //showStatus('Ошибка при синхронизации', '#e74c3c');
                }
            } else {
                updateSyncIndicator('ok');
                //showStatus('История уже актуальна', '#007aff');
            }

            GM_setValue('commandHistory', mergedHistory);
            commandHistory = mergedHistory;
            updateStatsDisplay();
            updateHistoryDisplay();
        }



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
                match: "https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/acceptance-request/",
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