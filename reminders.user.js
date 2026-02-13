
// ==UserScript==
// @name         Reminders (Local Config, SPA)
// @namespace    reminders_local
// @version      5.3.3
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
    const SCRIPT_VERSION = GM_info?.script?.version || 'dev';
    const UID_YA = "148822177";

    let currentURL = location.href;



    const SELECTOR = '[data-testid="client-issuing-search-suggest"]';
    const STORAGE_KEY_STATE = 'boxfokus';
    const STORAGE_KEY_PUT = 'boxput';
    const STORAGE_KEY_COM1 = 'com1';
    const STORAGE_KEY_LAST = 'last_com1';// новое — запоминаем, что уже вставляли

    // ─── 1. Автофокус при возвращении на вкладку ────────────────────────────────
    function tryFocusInput() {

        const input = document.querySelector(SELECTOR);
        if (input && document.activeElement !== input) {
            input.focus();
        }
    }

    if (GM_getValue(STORAGE_KEY_STATE, true)) {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                tryFocusInput();
            }
        });

        window.addEventListener('load', tryFocusInput);
    }

    // ─── 2. Вставка номера заказа только один раз или при изменении com1 ────────
    function tryFillOrderNumber() {

        const input = document.querySelector(SELECTOR);
        if (!input) return;

        const currentCom1 = GM_getValue(STORAGE_KEY_COM1, null);
        if (currentCom1 === null || currentCom1 === '') return;

        const lastInserted = GM_getValue(STORAGE_KEY_LAST, null);

        // Вставляем, только если значение изменилось или раньше ничего не вставляли
        if (lastInserted !== currentCom1) {
            input.focus();
            input.select();

            // Современный и надёжный способ вставить текст
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, "value"
            ).set;

            nativeInputValueSetter.call(input, currentCom1);

            // Имитируем события, которые обычно ждёт React
            input.dispatchEvent(new Event('input',  { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            // Эмуляция Enter (не всегда нужно, но оставим)
            input.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13
            }));

            // Запоминаем, что именно вставили
            GM_setValue(STORAGE_KEY_LAST, currentCom1);
            console.log('[AutoFill] Вставлено значение:', currentCom1);
        }
    }


    // Запуск после загрузки страницы + небольшая задержка
    window.addEventListener('load', () => {
        if(GM_getValue(STORAGE_KEY_PUT, false)){
        setTimeout(tryFillOrderNumber, 700);
        }
    });

    // Дополнительно — при возвращении на вкладку пробуем ещё раз (на случай если поле перерендерилось)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
        if(GM_getValue(STORAGE_KEY_PUT, false)){
            setTimeout(tryFillOrderNumber, 600);
        }
        }
    });



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
    width: 100%;
    height: 100%;

    /* ФОН */
    background:
        linear-gradient(
            rgba(255,255,255,0.50),
            rgba(255,255,255,0.50)
        ),
        var(--bg-image);

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    border: 0;
    box-shadow: 0 20px 40px rgba(0,0,0,.08);

    z-index: 999999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}


/* Header */
#floatingInputHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 20px 24px;
    background: transparent;
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
.docs-button {
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

.docs-button:hover {
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

    background: transparent;
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
.del-btn:hover {
    background: var(--bg-hover);
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
.yanbt-btn:hover {
    background: var(--bg-hover);
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
.yan-btn:hover {
    background: var(--bg-hover);
}
.chio-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #007795;
    cursor: pointer;

    transition: background .15s;
}
.chio-btn:hover {
    background: var(--bg-hover);
}
.gz-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #007795;
    cursor: pointer;

    transition: background .15s;
}
.gz-btn:hover {
    background: var(--bg-hover);
}
.texth-btn {
    padding: 4px 10px;
    font-size: 11px;
    color: #000000;
}
.gza-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #007795;
    cursor: pointer;

    transition: background .15s;
}
.gza-btn:hover {
    background: var(--bg-hover);
}
.gzp-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #007795;
    cursor: pointer;

    transition: background .15s;
}
.gzp-btn:hover {
    background: var(--bg-hover);
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
.barcodeqr-btn {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 999px;

    background: white;
    border: 1px solid var(--border);
    color: #8e44ad;
    cursor: pointer;

    transition: background .15s;
}

.barcodeqr-btn:hover {
    background: var(--bg-hover);
}

.history-new {
    background: rgba(46, 204, 113, 0.25);
    border-left: 4px solid #2ecc71;
    transition: background 0.3s ease;
}


`);



        // Загружаем историю из сохраненных данных
        let commandHistory = GM_getValue('commandHistory', []);
       // let selectedDate = null; // YYYY-MM-DD или null
        // сегодняшняя дата в формате YYYY-MM-DD
        let selectedDate = new Date().toISOString().split('T')[0];


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

 const today = new Date();
const date18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

const formattedDate = [date18.getDate(), date18.getMonth() + 1, date18.getFullYear()]
  .map(n => String(n).padStart(2, '0'))
  .join('.');

const brihgt = document.createElement('span');
brihgt.textContent = `18 лет исполнилось от: ${formattedDate}`;
brihgt.style.cssText = `
  font-size: 14px;
  margin-left: 5px;
`;


        const versionLabel = document.createElement('span');
        versionLabel.textContent = `v${SCRIPT_VERSION}`;
        versionLabel.style.cssText = `
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 10px;
`;


        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        const game = document.createElement('button');
game.className = 'action-button';
const imgUrl = 'https://yastatic.net/s3/urban-ads-gaming/stable/assets/market-rush-cover-BI0z_oa-.webp';
const img = document.createElement('img');
img.src = imgUrl;
img.alt = 'Скоротать время :з';
img.style.maxWidth = '100%';
img.style.maxHeight = '24px';
img.style.display = 'block';
img.onerror = () => {
    img.remove();
    game.textContent = 'Доставка (игра)';
};
img.onload = () => {
    game.textContent = '';
    game.appendChild(img);
};
game.appendChild(img);
           const game1 = document.createElement('button');
game1.className = 'action-button';
const imgUrl1 = 'https://yastatic.net/s3/urban-ads-gaming/stable/assets/mark3-logo-C-gqlw6v.webp';
const img1 = document.createElement('img');
img1.src = imgUrl1;
img1.alt = 'Скоротать время :з';
img1.style.maxWidth = '100%';
img1.style.maxHeight = '24px';
img1.style.display = 'block';
img1.onerror = () => {
    img1.remove();
    game1.textContent = 'В ряд (игра)';
};
img1.onload = () => {
    game1.textContent = '';
    game1.appendChild(img1);
};
game1.appendChild(img1);

        const Priemyan = document.createElement('button');
        Priemyan.className = 'action-button';
        Priemyan.textContent = "ПРИЕМКА Яндекс (Водители/Продавцы)";
const docs = document.createElement('button');
        docs.className = 'docs-button';
        docs.textContent = "Документы яндекс";




        // Кнопка открытия отдельного окна генератора ШК
        const openBarcodeWindowBtn = document.createElement('button');
        openBarcodeWindowBtn.className = 'action-button';
        openBarcodeWindowBtn.title = 'Открыть генератор ШК';
        openBarcodeWindowBtn.textContent = 'Генератор ШК / Маркировка';
        const settingsz = document.createElement('button');
        settingsz.className = 'action-button';
        settingsz.title = 'Настройки';
        settingsz.textContent = '⚙️';

        // Поле ввода
        const input = document.createElement('input');
        input.id = 'userInput';
        input.type = 'text';
        input.placeholder = 'Введите текст и нажмите Enter...';

        // Статус
        const status = document.createElement('div');
        status.id = 'inputStatus';
        status.style.display = 'none'

        // Контейнер для статистики
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
       statsContainer.style.background = 'transparent';
 const StatEnabled = GM_getValue('bgBlurEnabled', true);
statsContainer.style.display = StatEnabled ? 'flex' : 'none';



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
        dateFilter.style.border = '1px solid var(--border)';
        dateFilter.style.borderRadius = '20px';
        dateFilter.style.backgroundColor = 'var(--bg-secondary, white)';
        dateFilter.style.color = 'var(--text-primary, #000)';
        dateFilter.style.outline = 'none';
        dateFilter.style.transition = 'all 0.12s ease';
        dateFilter.style.boxSizing = 'border-box';
        dateFilter.value = new Date().toISOString().split('T')[0];

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
autoFocusToggle.style.fontSize = '10px';






        title.appendChild(versionLabel);

        // Собираем статистику
        breakStat.appendChild(autoFocusToggle);
        breakStat.appendChild(breakValue);
        breakStat.appendChild(breakLabel);
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
        buttonsContainer.appendChild(game1);
        buttonsContainer.appendChild(game);
        buttonsContainer.appendChild(Priemyan);
        buttonsContainer.appendChild(docs);
        buttonsContainer.appendChild(openBarcodeWindowBtn);
        buttonsContainer.appendChild(dateFilter);
        buttonsContainer.appendChild(settingsz);
        header.appendChild(title);
        header.appendChild(brihgt);
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
        return command.startsWith('50') || command.startsWith('51')
            ? 'АВИТОПРИЕМКА'
            : 'АВИТОВЫДАЧА';
    }
    return 'ЯНДЕКС';
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
        let delbtn = false;
       function highlightLast4(text) {
    if (!text) return '';
    if (text.length <= 4) {
        return `<strong style="font-size: 1.2em;">${text}</strong>`;
    }
    return `${text.slice(0, -4)}<strong style="font-size: 1.3em;">${text.slice(-4)}</strong>`;
}

        function updateHistoryDisplay() {
const now = Date.now();
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
            const savedButtonOpacity = GM_getValue('bgOpacitybut', 0.9);
            const savedButtonblur = GM_getValue('bgOpacityrazm', 20);
            visibleItems.forEach((item) => {
                const isHighlighted = item.highlightUntil && item.highlightUntil > now;
                const time = item.time || '';
                const command = item.command || '';
                const type = item.type || getCommandType(command);
                const bg = isHighlighted
  ? 'linear-gradient(rgba(46,204,113,0.25), rgba(46,204,113,0.25))'
  : `linear-gradient(rgba(255,255,255,${savedButtonOpacity}), rgba(255,255,255,${savedButtonOpacity}))`;

                historyHTML += `
               <div class="history-item ${isHighlighted ? 'history-new' : ''}"
       style="background: ${bg}; backdrop-filter: blur(${savedButtonblur}px); -webkit-backdrop-filter: blur(${savedButtonblur}px);">

                <div class="history-content">
                    <span class="history-time">${time}</span>
                   ${type === 'АВИТОПРИЕМКА' || type === 'АВИТОВЫДАЧА'
    ? `<span class="history-command">${highlightLast4(command)}</span>`
    : type === 'ЯНДЕКС'
        ? `<span class="history-command">${command}</span>`
        : ''
}

                    <!-- <span class="history-type">${type}</span>-->
                    ${
    type === 'ЯНДЕКС'
        ? `<svg width="150" height="30" viewBox="0 0 204 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <svg width="150" height="30" viewBox="0 0 204 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9407_22851)"><circle cx="15" cy="15" r="15" fill="#FF5226"></circle><path d="M17.43 24.45V8.39h-1.884c-1.358 0-2.388.288-3.088.865-.7.556-1.05 1.297-1.05 2.224 0 .7.123 1.297.37 1.791s.608.947 1.081 1.359c.474.412 1.071.865 1.792 1.359l1.791 1.204-5.25 7.259H7.238l5.004-6.795 2.347 2.1-1.853-1.174a23.446 23.446 0 01-2.656-2.007c-.742-.66-1.308-1.38-1.699-2.162-.391-.783-.587-1.699-.587-2.749 0-1.812.649-3.274 1.946-4.386 1.318-1.132 3.243-1.698 5.775-1.698h5.59v18.87H17.43z" fill="#fff"></path></g><path d="M47.555 30c-8.275 0-15-6.699-15-14.973C32.555 6.752 39.28 0 47.555 0c8.274 0 15 6.752 15 15.027 0 8.274-6.726 14.973-15 14.973z" fill="#FF5226"></path><path d="M45.232 2.03L28.498 28.14h7.671l9.667-15.05-.236-.107-2.68 10.77 5.674 1 5.832-7.33-.316-.157-1.97 8.326 12.363-2.356-2.522-4.154-4.456 1.02.526.605 2.075-8.695-4.834-3.232-6.33 7.96.315.158 2.6-10.43-6.645-4.438z" fill="#FD0"></path><path d="M45.232 2.03L28.498 28.14h7.671l9.667-15.05-.236-.107-2.68 10.77 5.674 1 5.832-7.33-.316-.157-1.97 8.326 4.97-.947 3.016-12.633-4.834-3.232-6.33 7.96.315.158 2.6-10.43-6.645-4.438z" fill="#FD0"></path><path d="M68.305 24.45l9.327-18.87h7.103l1.452 11.489 7.196-11.49h7.042V24.45h-6.887V14.32l-6.394 10.13h-6.887L78.93 14.227 73.864 24.45h-5.56zm53.276-3.737c0 .639.011 1.267.031 1.884.021.618.062 1.225.124 1.822h-6.394a5.371 5.371 0 01-.37-.926 6.529 6.529 0 01-.247-1.297c-.659.782-1.493 1.43-2.502 1.945-.988.495-2.399.742-4.231.742-1.853 0-3.336-.433-4.448-1.297-1.091-.865-1.636-2.018-1.636-3.46 0-1.338.38-2.367 1.142-3.088.783-.741 1.997-1.256 3.645-1.544 1.647-.31 3.757-.464 6.331-.464h1.606v-.34c0-.658-.278-1.163-.834-1.513-.556-.35-1.596-.525-3.119-.525-1.503 0-2.903.196-4.201.587-1.276.37-2.316.741-3.119 1.112v-4.139c.906-.33 2.121-.659 3.645-.988 1.544-.35 3.304-.525 5.281-.525 1.997 0 3.685.185 5.065.556 1.38.35 2.43.957 3.15 1.822.721.844 1.081 2.018 1.081 3.521v6.115zm2.1-11.55h6.394l.37 2.624c.783-1.029 1.719-1.78 2.811-2.254 1.091-.474 2.347-.71 3.768-.71 1.606 0 3.047.288 4.324.864a6.824 6.824 0 013.026 2.626c.742 1.173 1.112 2.656 1.112 4.447s-.37 3.284-1.112 4.478c-.72 1.174-1.729 2.06-3.026 2.656-1.298.598-2.78.896-4.448.896a9.387 9.387 0 01-3.49-.649c-1.071-.452-1.997-1.163-2.779-2.13v6.424h-6.95V9.162zm41.942 7.597c0-1.524.412-2.883 1.236-4.077.844-1.194 2.038-2.13 3.582-2.81 1.565-.7 3.408-1.05 5.529-1.05 2.203 0 4.046.38 5.528 1.142 1.503.762 2.553 1.843 3.15 3.243.618 1.4.7 3.058.247 4.973h-12.199c.247.885.793 1.554 1.637 2.007.865.433 2.141.649 3.829.649 1.174 0 2.265-.103 3.274-.31a29.001 29.001 0 002.811-.771v3.675c-.886.412-1.874.741-2.965.988-1.071.247-2.481.371-4.231.371-3.851 0-6.723-.71-8.617-2.131-1.874-1.441-2.811-3.408-2.811-5.9zm19.859-7.598h17.636v3.954h-5.498v11.303h-6.949V13.116h-5.189V9.162zm-38.668 0h6.949v6.918l6.579-6.918h5.992l-6.116 6.362 7.382 8.895h-8.401l-5.436-6.733v6.733h-6.949V9.162zm29.187 3.12c-.948 0-1.699.278-2.255.834-.556.535-.916 1.225-1.081 2.069h6.115c-.02-.844-.247-1.534-.679-2.07-.433-.555-1.133-.833-2.1-.833zm-37.618 4.478c0-1.236-.34-2.214-1.02-2.934-.658-.741-1.606-1.112-2.841-1.112-1.132 0-2.08.35-2.841 1.05-.762.68-1.143 1.678-1.143 2.996s.37 2.337 1.112 3.058c.762.7 1.719 1.05 2.872 1.05 1.277 0 2.234-.371 2.872-1.112.659-.741.989-1.74.989-2.996zm-23.751 1.08h-1.575c-1.503 0-2.584.125-3.243.372-.638.247-.957.72-.957 1.42 0 .597.206 1.04.617 1.328.433.268.947.402 1.545.402.906 0 1.647-.165 2.223-.494.597-.35 1.061-.752 1.39-1.205v-1.822z" fill="currentColor"></path><defs><clipPath id="clip0_9407_22851"><path fill="#fff" d="M0 0h30v30H0z"></path></clipPath></defs></svg>

  </svg>`
        : ''
}
  ${type === 'АВИТОПРИЕМКА' || type === 'АВИТОВЫДАЧА'
        ? `<svg width="150" height="30" viewBox="0 0 204 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="97" height="27" fill="none"><g clip-path="url(#a)"><path fill="#000" d="m36.552 1.077-8.26 21.566h4.437l1.698-4.506h8.764l1.705 4.506H49.3L41.091 1.077h-4.539ZM35.95 14.18l2.885-7.588 2.873 7.588H35.95ZM54.602 17.082 51.02 7.493h-4.232l5.77 15.15h4.195l5.667-15.15h-4.232l-3.586 9.59ZM67.744 7.493h-4.028v15.15h4.028V7.494ZM65.728 6.401a2.936 2.936 0 1 0 0-5.871 2.936 2.936 0 0 0 0 5.871ZM75.727 3.45H71.71v4.018h-2.355v3.651h2.355v6.438c0 3.652 2.012 5.222 4.845 5.222a6.938 6.938 0 0 0 2.787-.544V18.48a4.494 4.494 0 0 1-1.501.274c-1.23 0-2.118-.479-2.118-2.118v-5.518h3.619V7.504h-3.615V3.451ZM87.81 7.22a7.851 7.851 0 1 0-.007 15.702 7.851 7.851 0 0 0 .007-15.703Zm0 11.684a3.823 3.823 0 1 1 3.82-3.823 3.816 3.816 0 0 1-3.82 3.809v.014Z"/><path fill="#04E061" d="M7.85 24.794a7.85 7.85 0 1 0 0-15.702 7.85 7.85 0 0 0 0 15.702Z"/><path fill="#FF4053" d="M21.468 23.805a4.743 4.743 0 1 0 0-9.487 4.743 4.743 0 0 0 0 9.487Z"/><path fill="#965EEB" d="M9.352 8.074a2.936 2.936 0 1 0 0-5.872 2.936 2.936 0 0 0 0 5.872Z"/><path fill="#0AF" d="M19.624 13.296a6.383 6.383 0 1 0 0-12.766 6.383 6.383 0 0 0 0 12.766Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 .53h96.177V27H0z"/></clipPath></defs></svg>
        </svg>`
        : ''
}
                          ${/^\d{12}$/.test(command)
  ? `<button class="chio-btn">?</button>`
                    // `<span class="history-time">QR НА ВЫДАЧУ, для приемки нужен его номер. Кнопка "ПРИЕМКА Яндекс (Водители/Продавцы)"</span>`
  : ''
}
                </div>
                <div class="history-actions">

                    ${type === 'АВИТОПРИЕМКА' || type === 'АВИТОВЫДАЧА'
            ? `<button class="invoice-btn" data-command="${command}">История заказа</button>`
                        : ''
    }

${/^(LO-\d{9})-\d{5}$/.test(command)
  ? `<button class="gz-btn" data-command="${command.match(/^(LO-\d{9})-/)[1]}">
       Поиск по грузоместу
     </button>`
  : ''
}

                  ${/^LO-\d{9}$/.test(command)
  ? `<button class="gz-btn" data-command="${command}">Поиск по грузоместу</button>`
  : ''
}
                  ${/^P\d{10}$/.test(command)
  ? `<button class="gzp-btn" data-command="${command}">Поиск по грузоместу</button>`
  : ''
}
                ${/^\d{6}-\d{6}$/.test(command)
  ? `<button class="gza-btn" data-command="${command}">Поиск по грузоместу</button>`
  : ''
}

                   ${type === 'ЯНДЕКС'
  ? `
    ${! /^(?:LO-\d{9}-\d{5}|\d{12})$/i.test(command)

      ? `<button class="yanbt-btn" data-command="${command}">Отправить</button>`
      : ''
    }
    <button class="yan-btn" data-command="${command}">Выдать</button>
  `
  : ''
}


                   ${/^\d{12}$/.test(command)
  ? `<button class="barcodeqr-btn" data-command="${command}">QR</button>`
  : `<button class="barcode-btn" data-command="${command}">ШК</button>`
}

                    <button class="copy-btn" data-command="${command}">Копировать</button>


                    ${delbtn == true || /^\d{1,3}$/.test(command)
            ? `<button class="del-btn" data-command="${command}">🗑️</button>`
                        : ''
    }
                </div>
            </div>
        `;



    });

            contentArea.innerHTML = historyHTML;

            // ---------------- УДАЛЕНИЕ ----------------
            contentArea.querySelectorAll('.del-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    const command = this.getAttribute('data-command');
                    const index = commandHistory.findIndex(i => i.command === command);
                    if (index !== -1) {
                        commandHistory.splice(index, 1);
                        GM_setValue('commandHistory', commandHistory);
                        updateStatsDisplay();
                        updateHistoryDisplay();
                        showStatus(`Удалено: ${command}`, '#27ae60');
                    }
                });
            });

            contentArea.querySelectorAll('.chio-btn').forEach(button => {
                button.addEventListener('click', function () {
                    alert('QR НА ВЫДАЧУ, для приемки нужен его номер. Кнопка "ПРИЕМКА Яндекс (Водители/Продавцы)')
                });
            });
            // ---------------- КОПИРОВАНИЕ ----------------
            contentArea.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                });
            });

            // ---------------- НАКЛАДНАЯ ----------------
            contentArea.querySelectorAll('.invoice-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    window.open(`https://pvz.avito.ru/history/${command}`, '_blank');
                });
            });

            // ---------------- ЯНДЕКС ----------------
            contentArea.querySelectorAll('.yanbt-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                     return openOrFocusWindowrec('yandex_pvz_deliver_tab_pri',
                                             `https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/acceptance-request?query=${command}`
                                            );
                });
            });

            contentArea.querySelectorAll('.yan-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    GM_setValue('com1', command);
                    copyToClipboard(command);
                    return openOrFocusWindow('yandex_pvz_deliver_tab',
                                             `https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/issuing`
                                            );
                });
            });
            contentArea.querySelectorAll('.gz-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                    return openOrFocusWindow('yandex_pvz_deliver_gz',
                                             `https://logistics.market.yandex.ru/tpl-outlet/${UID_YA}/dropoff-orders/${command}`
                                            );
                });
            });
            contentArea.querySelectorAll('.gza-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                   return openOrFocusWindow('yandex_pvz_deliver_gz',
                                            `https://logistics.market.yandex.ru/tpl-outlet/${UID_YA}/sortables?sortableTypes=all&sortableStatuses=&sortableStatusesLeafs=&sortableBarcode=${command}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
                                            );
                });
            });
             contentArea.querySelectorAll('.gzp-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const command = this.getAttribute('data-command');
                    copyToClipboard(command);
                    return openOrFocusWindow('yandex_pvz_deliver_gz',
                                             `https://logistics.market.yandex.ru/tpl-outlet/${UID_YA}/sortables?sortableBarcode=${command}`
                                            );
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
<title>ШК ${command}</title>
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
        });
    });
            contentArea.querySelectorAll('.barcodeqr-btn').forEach(button => {
    button.addEventListener('click', function () {
        const command = this.getAttribute('data-command');
        const win = window.open('', '_blank');

        win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QR ${command}</title>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
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
#qrcode canvas{
    width:400px;
    height:400px;
}
</style>
</head>
<body>
<div id="qrcode"></div>

<script>
new QRCode(document.getElementById("qrcode"), {
    text: "${command}",
    width: 400,
    height: 400,
    correctLevel: QRCode.CorrectLevel.H
});
</script>
</body>
</html>
        `);

        win.document.close();
    });
});

        }
        dateFilter.addEventListener('change', () => {
            selectedDate = dateFilter.value || null;
            updateHistoryDisplay();
            updateStatsDisplay();
        });

        // Функция для отображения статуса
       function showStatus(message, color = '#666', bgColor = '#fff') {
    status.style.display = 'inline-block';
    status.style.color = color;
    status.style.backgroundColor = bgColor;
    status.style.fontSize = '20px';
    status.style.padding = '5px 10px';
    status.style.borderRadius = '4px';
    status.style.transition = 'all 0.5s';
    status.textContent = message;

    // через 10 секунд сброс
    setTimeout(() => {
        status.style.color = '#666';
        status.style.backgroundColor = '#fff';
        status.style.display = 'none';
        updateHistoryDisplay();
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
            return window.open(url, windowName);
        }

        function openOrFocusAvitoPiemk(text) {
            const windowName = 'avitopriem_pvz_deliver_tab';
            const url = 'https://pvz.avito.ru/accept/parcel/'+text;
            const tab = window.open('', windowName);
            return window.open(url, windowName);
        }
        function openOrFocusWindowrec(windowName, url) {
            const tab = window.open('', windowName);
            return window.open(url, windowName);
        }
        function openOrFocusWindow(windowName, url) {
            const tab = window.open('', windowName);


            if (tab && !tab.closed) {
                tab.focus();
                try {
                    if (tab.location.href !== url) {
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
        function isDuplicateCommand(command) {
    return commandHistory.some(item => item.command === command);
}

       function processInput() {
    const text = input.value.trim();

contentArea.scrollTop = 0;
    if (!text) {
        showStatus('Поле пустое!', '#e74c3c');
        return;
    }

    if (text === 'del') {
        delbtn = !delbtn;
        updateHistoryDisplay();
        input.value = '';
        return;
    }
  GM_setValue('com1', text);
    // ⚠️ Проверка на дубликат
const existingItem = commandHistory.find(item => item.command === text);
if (existingItem) {
    const when = new Date(existingItem.timestamp || existingItem.date || Date.now());
    const formattedDate = when.toLocaleString('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    existingItem.highlightUntil = Date.now() + 10_000;

    showStatus(
        `⚠️ Такая команда уже была! (${formattedDate})`,
        '#fff',
        '#FF5555'
    );

    input.value = '';
    updateHistoryDisplay(); // чтобы подсветка применилась
    return;
}


    const commandType = getCommandType(text);

    // Добавляем в историю
    const now = Date.now();
const highlightDuration = 5000; // подсветка 5 секунд

const historyItem = {
    time: new Date().toLocaleTimeString(),
    command: text,
    type: commandType,
    date: new Date().toISOString(),
    highlightUntil: now + highlightDuration // <--- новая подсветка
};


    commandHistory.push(historyItem);

    // Ограничиваем историю
    if (commandHistory.length > 100) {
        commandHistory = commandHistory.slice(-100);
    }

    GM_setValue('commandHistory', commandHistory);
    historyIndex = commandHistory.length;

    updateStatsDisplay();
    updateHistoryDisplay();

    copyToClipboard(text);

    // Обработка команд
    switch (commandType) {
        case 'АВИТОВЫДАЧА':
            openOrFocusAvitoPvz(text);
            break;

        case 'АВИТОПРИЕМКА':
            openOrFocusAvitoPiemk(text);
            break;

        case 'ЯНДЕКС':
            if (/^(?:LO-\d{9}-\d{5}|\d{12})$/i.test(text)) {
                openOrFocusWindow(
                    'yandex_pvz_deliver_tab',
                    `https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/issuing`
                );
            }
            break;

        default:
            // ничего не делаем
            break;
    }

    input.value = '';
    input.focus();
    setInterval(() => updateHistoryDisplay(), 10000);

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
        game.addEventListener('click', function () {
            const windowName = 'game1';
            const url = `https://gaming.market.yandex.ru/?gameId=market_rush&platform=desktop`;
            const tab = window.open('', windowName);
            return window.open(url, windowName);


        });
        game1.addEventListener('click', function () {
            const windowName = 'game2';
            const url = `https://gaming.market.yandex.ru/?gameId=mark3&platform=desktop`;
            const tab = window.open('', windowName);
            return window.open(url, windowName);


        });
      docs.addEventListener('click', function () {
    const text = input.value.trim();

    // Открываем новое окно
    const win = window.open(
        '',
        'barcode_generator',
        `width=${screen.width},height=${screen.height},left=0,top=0,resizable=yes,scrollbars=yes`
    );

    // Записываем HTML содержимое в новое окно
    win.document.write(`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Выбор акта</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <style>
    :root {
      --primary: #2e7d32;
      --primary-dark: #1b5e20;
      --danger: #c62828;
      --bg: #f5f7fa;
      --card: #ffffff;
      --text: #1a1a1a;
      --text-secondary: #555;
      --shadow: 0 6px 20px rgba(0,0,0,0.08);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 24px 16px;
      display: grid;
      place-items: center;
    }

    .container {
      background: var(--card);
      border-radius: 16px;
      box-shadow: var(--shadow);
      padding: 32px;
      max-width: 540px;
      width: 100%;
    }

    h1 {
      font-size: 1.9rem;
      margin-bottom: 1.4rem;
      color: var(--primary);
      text-align: center;
      font-weight: 600;
    }

    .intro {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.5;
      font-size: 1.05rem;
    }

    .intro ul {
      padding-left: 1.4em;
      margin: 1.2rem 0;
    }

    .intro li {
      margin: 0.6rem 0;
    }

    .intro small {
      color: #777;
      font-size: 0.9rem;
    }

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      font-size: 1.05rem;
      font-weight: 500;
      color: white;
      background: var(--primary);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.22s ease;
      box-shadow: 0 3px 10px rgba(46,125,50,0.2);
    }

    .btn:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(46,125,50,0.28);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn i {
      font-size: 1.3rem;
      opacity: 0.9;
    }

    .btn-close {
      margin-top: 2rem;
      background: var(--danger);
      box-shadow: 0 3px 10px rgba(198,40,40,0.2);
    }

    .btn-close:hover {
      background: #a51b1b;
      box-shadow: 0 6px 18px rgba(198,40,40,0.28);
    }

    @media (max-width: 480px) {
      .container {
        padding: 24px;
      }
      h1 {
        font-size: 1.7rem;
      }
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Бумажная форма</h1>

  <div class="intro">
    <p>Когда применять бумажный акт:</p>
    <ul>
      <li>Приём и отказ от посылок Авито</li>
      <li>Выдача возврата Авито по паспорту</li>
      <li>Посылка не числится в системе <small>(смена юр.лица и подобные случаи)</small></li>
      <li>ЭАПП завис / не работает / недоступен</li>
      <li>Особая ситуация, которую нельзя зафиксировать в электронном акте<br>или по согласованию со службой поддержки</li>
    </ul>
  </div>

  <div class="buttons">
    <button class="btn" data-link="https://new-acc-space-1143.ispring.ru/app/preview/65a7b1c2-eaed-11ef-9f34-72081ce363cf">
      <i class="fas fa-truck-loading"></i>
      Приёмка у курьера Маркета — Акт приёма-передачи №3
    </button>

    <button class="btn" data-link="https://new-acc-space-1143.ispring.ru/app/preview/6e3a6334-eae3-11ef-8d5c-b25e5b0cd9c5">
      <i class="fas fa-people-carry"></i>
     Приёмка заказа у клиента Авито и Яндекс Доставки — Акт приёма-передачи
    </button>

    <button class="btn" data-link="https://new-acc-space-1143.ispring.ru/app/preview/6e714494-eae3-11ef-9fc3-72081ce363cf">
      <i class="fas fa-warehouse"></i>
      Приёмка заказов у продавца Маркета — Акт приёма-передачи
    </button>

    <button class="btn" data-link="https://new-acc-space-1143.ispring.ru/app/preview/7ceafbea-eada-11ef-8bdd-92c9dee5d041">
      <i class="fas fa-exclamation-triangle"></i>
     Расхождения по итогу размещения заказов — Акт об установленном расхождении (№4)
    </button>

    <button class="btn" data-link="https://new-acc-space-1143.ispring.ru/app/preview/7d2734f2-eada-11ef-ac5c-5682b99ceced">
      <i class="fas fa-box-open"></i>
      Расхождения на выдаче клиенту — Акт об обнаружении повреждений/недостатков отправления (№5)
    </button>

    <button class="btn btn-close" id="close">
      <i class="fas fa-times"></i>
      Закрыть
    </button>
  </div>
</div>

<script>
  document.querySelectorAll('.btn[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(btn.dataset.link, '_blank', 'noopener,noreferrer');
      window.close();
    });
  });

  document.getElementById('close').addEventListener('click', () => {
    window.close();
  });
</script>

</body>
</html>
    `);

    // Обязательно закрываем поток записи документа
    win.document.close();
});


        function openOrPriemYandexPvz() {
            const windowName = 'yandex_pvz_prei';
            const url = `https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/acceptance-request`;
            const tab = window.open('', windowName);
            if (tab && !tab.closed) {
                tab.focus();
                try {
                    if (!tab.location.href.includes(`https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/acceptance-request`)) {
                        tab.location.href = url;
                    }
                } catch (e) {}
                return tab;
            }
            return window.open(url, windowName);
        }
function updateBackground(imageUrl, opacity = 0.5) {
    const container = document.getElementById('floatingInputContainer');
    if (!container) return;

    container.style.background = `
        linear-gradient(rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity})),
        url(${imageUrl})
    `;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.backgroundRepeat = 'no-repeat';
}
function updateBackgroundbutton(opacity = 0.9) {
    const linear = `linear-gradient(rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity}))`;

    // Кнопки
    docs.style.background = linear;
    openBarcodeWindowBtn.style.background = linear;
    Priemyan.style.background = linear;
    game.style.background = linear;
    game1.style.background = linear;
    dateFilter.style.background = linear;
    settingsz.style.background = linear;

    // Статистика
    yandexStat.style.background = linear;
    avitoStat.style.background = linear;
    avitoStat1.style.background = linear;
    breakStat.style.background = linear;

 document.querySelectorAll('.history-item').forEach(el => { el.style.background = linear;});
}
function updateBackgroundrazm(blur = 100) {


    function applyBlur(el) {
        if (!el) return;
        el.style.backdropFilter = `blur(${blur}px)`;
        el.style.webkitBackdropFilter = `blur(${blur}px)`;
    }

    // Кнопки
    applyBlur(docs);
    applyBlur(openBarcodeWindowBtn);
    applyBlur(Priemyan);
    applyBlur(game);
    applyBlur(game1);
    applyBlur(dateFilter);
    applyBlur(settingsz);

    // Статистика
    applyBlur(yandexStat);
    applyBlur(avitoStat);
    applyBlur(avitoStat1);
    applyBlur(breakStat);

    // История
    document.querySelectorAll('.history-item').forEach(applyBlur);
}


       settingsz.addEventListener('click', () => {
    // ===== Создание модального окна настроек =====
    const settingsModal = document.createElement('div');
    settingsModal.style.cssText = `
        position: fixed;
        inset: 0;
        margin: auto;
        width: 400px;
        max-width: 90%;
        padding: 20px;
        background: white;
        border-radius: var(--radius-sm);
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        z-index: 1000000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    // Полупрозрачная подложка
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999999;
    `;
    document.body.appendChild(overlay);

   // Заголовок
const settingsTitle = document.createElement('div');
settingsTitle.textContent = 'Настройки';
settingsTitle.style.fontWeight = '600';
settingsTitle.style.fontSize = '16px';
settingsTitle.style.width = '100%';
settingsTitle.style.textAlign = 'center';
settingsModal.appendChild(settingsTitle);

    const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';

const autoFocusCheckbox = document.createElement('input');
autoFocusCheckbox.type = 'checkbox';
// Получаем значение при инициализации
const savedState = GM_getValue('boxfokus', false); // true — значение по умолчанию
autoFocusCheckbox.checked = savedState;
           // Создаём label с текстом
const label = document.createElement('label');
label.appendChild(autoFocusCheckbox);
label.append(' Автофокус'); // ← нужный текст

           const putCheckbox = document.createElement('input');
putCheckbox.type = 'checkbox';
// Получаем значение при инициализации
const savedStateput = GM_getValue('boxput', false); // true — значение по умолчанию
putCheckbox.checked = savedStateput;
           // Создаём label с текстом
const labelput = document.createElement('label');
labelput.appendChild(putCheckbox);
labelput.append(' Вставлять текст автоматически на выдаче яндекс'); // ← нужный текст


// Добавляем в DOM
document.body.appendChild(label);
// Кастомная кнопка
const fileBtn = document.createElement('button');
fileBtn.type = 'button';
fileBtn.className = 'action-button';
           fileBtn.style.width = 'fit-content';
fileBtn.style.padding = '6px 12px';
fileBtn.textContent = 'Выбрать фон';

// Клик по кнопке открывает file input
fileBtn.addEventListener('click', () => {
    fileInput.click();
});

    // Прозрачность
    const opacityLabel = document.createElement('label');
    opacityLabel.textContent = 'Прозрачность фона: ';
    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.min = 0;
    opacityInput.max = 1;
    opacityInput.step = 0.01;
    opacityInput.value = GM_getValue('bgOpacity', 0.4);
    opacityInput.style.verticalAlign = 'middle';
    opacityLabel.appendChild(opacityInput);
 // Прозрачность
    const opacityLabel1 = document.createElement('label');
    opacityLabel1.textContent = 'Прозрачность кнопок: ';
    const opacityInput1 = document.createElement('input');
    opacityInput1.type = 'range';
    opacityInput1.min = 0;
    opacityInput1.max = 1;
    opacityInput1.step = 0.01;
    opacityInput1.value = GM_getValue('bgOpacitybut', 0.9);
    opacityInput1.style.verticalAlign = 'middle';
    opacityLabel1.appendChild(opacityInput1);

    const opacityLabel2 = document.createElement('label');
    opacityLabel2.textContent = 'Размытие кнопок: ';
    const opacityInput2 = document.createElement('input');
    opacityInput2.type = 'range';
    opacityInput2.min = 0;
    opacityInput2.max = 20;
    opacityInput2.step = 0.25;
    opacityInput2.value = GM_getValue('bgOpacityrazm', 20);
    opacityInput2.style.verticalAlign = 'middle';
    opacityLabel2.appendChild(opacityInput2);
// Чекбокс: включить размытие
const blurToggleLabel = document.createElement('label');
blurToggleLabel.style.display = 'flex';
blurToggleLabel.style.alignItems = 'center';
blurToggleLabel.style.gap = '8px';

const blurToggle = document.createElement('input');
blurToggle.type = 'checkbox';
blurToggle.checked = GM_getValue('bgBlurEnabled', true);

const blurToggleText = document.createElement('span');
blurToggleText.textContent = 'Включить статистику';
const autoFocusCheckboxText = document.createElement('span');
autoFocusCheckboxText.textContent = 'Включить статистику';

blurToggleLabel.appendChild(blurToggle);
blurToggleLabel.appendChild(blurToggleText);

           // Добавляем в модалку
settingsModal.appendChild(fileBtn);
settingsModal.appendChild(fileInput);
settingsModal.appendChild(blurToggleLabel);
    settingsModal.appendChild(opacityLabel);
    settingsModal.appendChild(opacityLabel1);
    settingsModal.appendChild(opacityLabel2);
settingsModal.appendChild(label);
           settingsModal.appendChild(labelput);

    // Кнопка применить
    const applyBtn = document.createElement('button');
    applyBtn.className = 'action-button';
    applyBtn.textContent = 'Применить';
    settingsModal.appendChild(applyBtn);



    // Кнопка применить
    applyBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                GM_setValue('bgImage', base64);
                GM_setValue('bgOpacity', opacityInput.value);
                GM_setValue('bgOpacitybut', opacityInput1.value);
                GM_setValue('bgOpacityrazm', opacityInput2.value);
                GM_setValue('bgBlurEnabled', blurToggle.checked);
                GM_setValue('boxfokus', autoFocusCheckbox.checked);
                GM_setValue('boxput', putCheckbox.checked);
                updateBackground(base64, opacityInput.value);
                updateBackgroundbutton(opacityInput1.value)
                updateBackgroundrazm(opacityInput2.value);
                settingsModal.remove();
                overlay.remove();
            };
            reader.readAsDataURL(file);
        } else {
            GM_setValue('bgOpacity', opacityInput.value);
            GM_setValue('bgOpacitybut', opacityInput1.value);
            GM_setValue('bgOpacityrazm', opacityInput2.value);
            GM_setValue('bgBlurEnabled', blurToggle.checked);
             GM_setValue('boxfokus', autoFocusCheckbox.checked);
             GM_setValue('boxput', putCheckbox.checked);
            const savedImage = GM_getValue('bgImage', null);
            if (savedImage) updateBackground(savedImage, opacityInput.value);
            updateBackgroundbutton(opacityInput1.value)
            updateBackgroundrazm(opacityInput2.value);
            settingsModal.remove();
            overlay.remove();
        }

 const StatEnabled = GM_getValue('bgBlurEnabled', true);
statsContainer.style.display = StatEnabled ? 'flex' : 'none';
    });

    // Закрытие по клику вне окна
    overlay.addEventListener('click', () => {
        settingsModal.remove();
        overlay.remove();
    });

    document.body.appendChild(settingsModal);


});
        window.addEventListener('load', () => {

    const savedImage = GM_getValue('bgImage', null);
    const savedOpacity = GM_getValue('bgOpacity', 0.4);
    const savedOpacitybut = GM_getValue('bgOpacitybut', 0.9);
    const savedOpacityrazm = GM_getValue('bgOpacityrazm', 20);


    if (savedImage) {
        // Применяем сохранённый фон
        updateBackground(savedImage, savedOpacity);
    } else {
        // Применяем фон по умолчанию
        const defaultImage = "https://image.fonwall.ru/o/sw/wallpaper-desktop-landscape-buta.jpeg?auto=compress&fit=crop&w=1920&h=1080&domain=img3.fonwall.ru";
        updateBackground(defaultImage, 0.5);
    }

    // Применяем сохранённую прозрачность кнопок
    updateBackgroundbutton(savedOpacitybut);
    updateBackgroundrazm(savedOpacityrazm);

});
//statsContainer flex display


      openBarcodeWindowBtn.addEventListener('click', () => {
    const win = window.open('', 'barcode_generator',
        `width=${screen.width},height=${screen.height},left=0,top=0,resizable=yes,scrollbars=yes`);

    win.document.write(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Генератор ШК + маркировки</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --gray-100: #f9fafb;
            --gray-200: #e5e7eb;
            --gray-600: #4b5563;
            --gray-800: #1f2937;
            --red-warn: #ef4444;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            min-height: 100vh;
            color: var(--gray-800);
            padding: 16px;
        }

        .container { max-width: 900px; margin: 0 auto; }

        header { text-align: center; margin-bottom: 24px; }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }

        .controls {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            padding: 20px;
            margin-bottom: 24px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            justify-content: center;
        }

        input, select, button {
            padding: 12px 16px;
            font-size: 1rem;
            border-radius: 8px;
            border: 1px solid var(--gray-200);
            transition: all 0.15s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
        }

        button {
            background: var(--primary);
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
        }

        button:hover { background: var(--primary-dark); transform: translateY(-1px); }

        .secondary { background: var(--gray-200); color: var(--gray-800); }
        .secondary:hover { background: #d1d5db; }
        .warn { background: var(--red-warn); }
        .warn:hover { background: #dc2626; }

        .preview {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 24px;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin: 0 auto;
            max-width: 100%;
        }

        #labelContainer {
            font-size: 2.4rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-align: center;
            line-height: 1.1;
            max-width: 100%;
        }

        #labelIcons { font-size: 3.5rem; margin-bottom: 6px; }

        #barcode { max-width: 100%; height: auto; margin: 10px 0; }

        .empty-state { color: #9ca3af; font-size: 1.1rem; padding: 60px 20px; text-align: center; }

        @media print {
            @page { size: auto; margin: 0; }
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .controls, header, .empty-state { display: none !important; }
            .preview {
                box-shadow: none;
                padding: 0;
                margin: 0;
                width: 100%;
                height: auto;
            }
            #content-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
            }
            #labelContainer, #barcode {
                max-width: 98% !important;
                page-break-inside: avoid;
            }
            svg { max-width: 100% !important; height: auto !important; }
        }

        @media (max-width: 600px) { .controls { flex-direction: column; } }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1>Генератор ШК + маркировки под Xprinter</h1>
    </header>

    <div class="controls">
        <input id="barcodeInput" placeholder="Введите код (4601234567890)" style="flex: 1 1 260px; min-width: 220px;">
        <button id="generateBtn">Сгенерировать ШК</button>
        <select id="labelMode">
            <option value="none">Без маркировки</option>
            <option value="fragile">⚠ Хрупко</option>
            <option value="glass">🍷 Стекло</option>
            <option value="careful">⬆ Осторожно</option>
            <option value="camera">🎥 Под камерами</option>
        </select>
        <select id="stickerSize">
            <option value="40x30">40×30 мм (Wildberries малый)</option>
            <option value="58x40">58×40 мм (универсальный)</option>
            <option value="75x120" selected>75×120 мм (Озон, Я.Маркет)</option>
            <option value="100x150">100×150 мм (СДЭК, крупный)</option>
        </select>
        <button id="toggleLabelBtn" class="secondary">Показать маркировку</button>
        <button id="printLabelOnlyBtn" class="warn">🖨 Только маркировка</button>
        <button id="printBtn">🖨 Печать</button>
    </div>

    <div class="preview">
        <div id="content-wrapper">
            <div id="labelContainer" style="display:none;">
                <div id="labelIcons"></div>
                <div id="labelText"></div>
            </div>
            <svg id="barcode"></svg>
        </div>
        <div id="emptyState" class="empty-state">Введите код и нажмите «Сгенерировать ШК»</div>
    </div>
</div>

<script>
const input = document.getElementById('barcodeInput');
const barcodeSvg = document.getElementById('barcode');
const labelContainer = document.getElementById('labelContainer');
const labelIcons = document.getElementById('labelIcons');
const labelText = document.getElementById('labelText');
const labelMode = document.getElementById('labelMode');
const stickerSize = document.getElementById('stickerSize');
const emptyState = document.getElementById('emptyState');

let labelVisible = false;
let printOnlyLabel = false;

const LABELS = {
    none:    { text: '',             icons: '' },
    fragile: { text: 'ХРУПКО',       icons: '📦 ⚠️ 📦' },
    glass:   { text: 'СТЕКЛО',       icons: '🍷 ⚠️ 🍷' },
    careful: { text: 'ОСТОРОЖНО',    icons: '⬆️ ⬆️ ⬆️' },
    camera:  { text: 'ПОД КАМЕРАМИ', icons: '🎥 🎥 🎥' }
};

function updateLabel() {
    const mode = labelMode.value;
    if (mode === 'none') {
        labelContainer.style.display = 'none';
        return;
    }
    const m = LABELS[mode];
    labelText.textContent = m.text;
    labelIcons.textContent = m.icons;
    if (labelVisible) labelContainer.style.display = 'block';
}

labelMode.onchange = updateLabel;

stickerSize.onchange = updateLabel; // для перерисовки размеров

document.getElementById('generateBtn').onclick = () => {
    const val = input.value.trim();
    if (!val) return alert('Введите код');

    emptyState.style.display = 'none';

    let size = stickerSize.value;
    let w = 2.0, h = 80, fs = 20;

    if (size === '40x30')    { w = 1.4; h = 50; fs = 16; }
    if (size === '58x40')    { w = 1.7; h = 65; fs = 18; }
    if (size === '75x120')   { w = 2.2; h = 100; fs = 24; }
    if (size === '100x150')  { w = 2.8; h = 130; fs = 28; }

    JsBarcode(barcodeSvg, val, {
        format: 'CODE128',
        displayValue: true,
        width: w,
        height: h,
        fontSize: fs,
        margin: 8,
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 4
    });

    // Маркировка тоже адаптируется
    const labelScale = size === '40x30' ? 0.7 : size === '58x40' ? 0.85 : size === '75x120' ? 1.0 : 1.2;
    labelContainer.style.fontSize = (2.4 * labelScale) + 'rem';
    labelIcons.style.fontSize = (3.5 * labelScale) + 'rem';
};

document.getElementById('toggleLabelBtn').onclick = () => {
    labelVisible = !labelVisible;
    labelContainer.style.display = labelVisible && labelMode.value !== 'none' ? 'block' : 'none';
    if (labelVisible) updateLabel();
};

function preparePrint() {
    emptyState.style.display = 'none';
    if (printOnlyLabel) {
        barcodeSvg.style.display = 'none';
        labelContainer.style.display = 'block';
    } else {
        barcodeSvg.style.display = 'block';
        labelContainer.style.display = labelVisible ? 'block' : 'none';
    }
}

document.getElementById('printLabelOnlyBtn').onclick = () => {
    if (labelMode.value === 'none') return alert('Выберите тип маркировки');
    printOnlyLabel = true;
    labelVisible = true;
    updateLabel();
    preparePrint();
    setTimeout(() => window.print(), 400);
};

document.getElementById('printBtn').onclick = () => {
    if (!barcodeSvg.innerHTML && !labelVisible) return alert('Сгенерируйте ШК или включите маркировку');
    printOnlyLabel = false;
    preparePrint();
    setTimeout(() => window.print(), 400);
};
</script>
</body>
</html>
    `);
    win.document.close();
});


    } else {
        //-------------------------------------------------------------------------------------------------
        const REMINDERS = [
            {
                match: "pvz.avito.ru/deliver",
                title: "📦 Важное про выдачу",
                message: `<b>•</b> Выдачу нельзя отменить
Нажимайте на кнопку «Выдать заказ»
только если уверены, что клиент
готов забрать товар.
<b>•</b> Некоторые вещи можно примерить На таких товарах есть специальный значек
<b>• Почти </b> все заказы выдаются без паспорта
<b>•</b> Все заказы Авито оплачены


                `,
            },
            {
                match: "pvz.avito.ru/accept",
                title: "📦 Правила отправлений",
                message: `<b>•</b> Максимальная сумма сторон 2.4м<br><b>•</b> Одна сторона не более 120см<br>
                <strong>Запрещено к отправке:</strong><br>
<b>1.</b> Огнестрельное, сигнальное, пневматическое, газовое оружие, боеприпасы, холодное оружие (включая метательное),
электрошоковые устройства и искровые
<b>2.</b> Наркотические средства, психотропные, сильнодействующие,
радиоактивные, взрывчатые, ядовитые, едкие,
легковоспламеняющиеся и другие опасные вещества
<b>3.</b> Салюты, фейерверки и другие виды пиротехникиc
<b>4.</b> Медицинские препараты
<b>5.</b> Животные и растения, человеческие останки и прах
<b>6.</b> Денежные знаки Российской Федерации и иностранная валюта (за исключением пересылаемых Центральным банком Российской
Федерации и его учреждениями), дорожные чеки, ценные бумаги,
золото и серебро, акцизные марки, драгоценные и полудрагоценные металлы и камни (кроме ювелирных изделий стоимостью
до 20 000 ₽)-
<b>7. Любые продукты питания</b>
<b>8.</b> Иммунобиологические препараты, биологические материалы, кровь
<b>9.</b> Продукты с неприятным запахом, предметы и вещества, которые
по своему характеру или упаковке могут представлять опасность
<b>10.</b> Любые документы, удостоверяющие личность
<b>11.</b> Контрафактные товары — товары, этикетки, упаковки товаров,
на которых незаконно размещены товарный знак или сходное
с ним до степени смешения обозначение
<b>12.</b> Художественные ценности (картины, иконы, антиквариат, книги,
выпущенные до 1950 г.)c
<b>13.</b> Порнографические материалы
<b>14.</b> Литийионные аккумуляторы (ограничение не распространяется
на литийионные батареи, упакованные
<b>15.</b> Ртутные градусники
<b>16.</b> Товары, классифицирующиеся как опасные в соответствии с классификацией IATA (Международная ассоциация авиаперевоз
<b>17.</b> Цифровые (виртуальные) товары или услуги без физического
носителя, которые продают и распространяют онлайн
<b>18.</b> Другие товары, в отношении которых, по мнению службы доставки,
не может быть обеспечена безопасность или законность пересылки.

`,
            },
            {
                match: `https://hubs.market.yandex.ru/tpl-outlet/${UID_YA}/acceptance-request/`,
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

const YA_RETURN_TABLE = `
<style>
    .ya-table-wrapper {
        max-height: 55vh;          /* чтобы было куда скроллить */
        overflow-y: auto;
    }

    .ya-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        text-align: center;
    }

    .ya-table th,
    .ya-table td {
        padding: 8px;
        border: 1px solid #dfe3e8;
        vertical-align: middle;
        background: #fff;
    }

    .ya-table th:first-child,
    .ya-table td:first-child {
        text-align: left;
        font-weight: 500;
    }

    /* 🧷 фиксированная шапка */
    .ya-table thead th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: #f2f5f9;
        font-weight: 600;
    }

    /* 🟦 hover-подсветка строки */
    .ya-table tbody tr:hover {
        background: #eef4ff;
    }
</style>

<div class="ya-table-wrapper">
<table class="ya-table">
    <thead>
        <tr>
            <th>Проверка</th>
            <th>Товар не подошёл</th>
            <th>Привезли не то</th>
            <th>Есть недостатки</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>Упаковка от этого товара в наличии?</td>
            <td>✅</td><td>✅</td><td>❌</td>
        </tr>
        <tr>
            <td>Упаковка не повреждена</td>
            <td>✅</td><td>✅</td><td>❌</td>
        </tr>
        <tr>
            <td>Внешний вид товара соответствует причине возврата</td>
            <td>✅</td><td>✅</td><td>✅</td>
        </tr>
        <tr>
            <td>На товаре нет следов эксплуатации</td>
            <td>✅</td><td>✅</td><td>❌</td>
        </tr>
        <tr>
            <td>Характеристики совпадают с описанием</td>
            <td>✅</td><td>❌</td><td>✅</td>
        </tr>
        <tr>
            <td>Фото в карточке совпадает с товаром</td>
            <td>✅</td><td>❌</td><td>✅</td>
        </tr>
        <tr>
            <td>Фото и комментарии клиента совпадают</td>
            <td>✅</td><td>✅</td><td>✅</td>
        </tr>
        <tr>
            <td>Комплектация соответствует описанию</td>
            <td>✅</td><td>❌</td><td>❌</td>
        </tr>
        <tr>
            <td>Этикетки, бирки, пломбы в наличии</td>
            <td>✅</td><td>✅</td><td>❌</td>
        </tr>
        <tr>
            <td>Есть паспорт / инструкция / гарантийный талон</td>
            <td>✅</td><td>✅</td><td>✅</td>
        </tr>
    </tbody>
</table>
</div>
`;
        function closeFloating() {
    if (reminderBox) {
        reminderBox.remove();
        reminderBox = null;
    }
}

function waitForYaReturn(timeout = 700, interval = 50) {
    return new Promise((resolve) => {
        const start = Date.now();

        const check = () => {
            const span = document.querySelector(
                'span[data-i18n-key="pages.acceptance-request-item:page-title.CLIENT_RETURN"]'
            );

            if (span) {
                closeFloating(); // ← закрываем старую
                resolve(span.textContent.toLowerCase().includes("возврат"));
                return true;
            }

            if (Date.now() - start >= timeout) {
                closeFloating(); // ← тоже закрываем
                resolve(false);
                return true;
            }
            return false;
        };

        if (check()) return;

        const timer = setInterval(() => {
            if (check()) clearInterval(timer);
        }, interval);
    });
}





        function checkAndShow() {
            if (reminderBox) {
                reminderBox.remove();
                reminderBox = null;
            }

            for (const r of REMINDERS) {
                if (location.href.includes(r.match)) {

waitForYaReturn().then(isReturn => {
    if (isReturn) {
        showFloating("Возврат", YA_RETURN_TABLE, 600, 80);
    } else {
          showFloating(r.title, r.message);
    }
});
                    break; // показываем только одно напоминание
                }
            }
        }

        function showFloating(title, msg, width = 360, maxHeight = 75) {
            const box = document.createElement("div");
            reminderBox = box;

            box.style.cssText = `
        position:fixed;
        top:24px;
        right:24px;
        width:${width}px;
        max-height:${maxHeight}vh;
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