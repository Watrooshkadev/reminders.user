
// ==UserScript==
// @name         Reminders (Local Config, SPA)
// @namespace    reminders_local
// @version      2.7
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
    // Стили для окна
    GM_addStyle(`
        #floatingInputContainer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            background: white;
            border: 3px solid #2c3e50;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 850px;
            height: 700px;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        #floatingInputHeader {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #ecf0f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #floatingInputTitle {
            font-weight: bold;
            color: #2c3e50;
            font-size: 20px;
        }

        .buttons-container {
            display: flex;
            gap: 10px;
        }

        .action-button {
            padding: 8px 15px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .action-button:hover {
            background: #2980b9;
        }

        .action-button.save {
            background: #27ae60;
        }

        .action-button.save:hover {
            background: #219653;
        }

        .action-button.clear {
            background: #e74c3c;
        }

        .action-button.clear:hover {
            background: #c0392b;
        }

        #userInput {
            width: 100%;
            padding: 15px;
            border: 2px solid #bdc3c7;
            border-radius: 6px;
            font-size: 16px;
            box-sizing: border-box;
            margin-bottom: 15px;
            display: block;
        }

        #userInput:focus {
            outline: none;
            border-color: #3498db;
        }

        #inputStatus {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            min-height: 20px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
        }

        .stats-container {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 13px;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 5px 10px;
        }

        .stat-value {
            font-weight: bold;
            font-size: 16px;
            color: #2c3e50;
        }

        .stat-label {
            font-size: 11px;
            color: #7f8c8d;
            margin-top: 2px;
        }

        .stat-avito {
            color: #e74c3c;
        }

        .stat-yandex {
            color: #3498db;
        }

        .stat-total {
            color: #27ae60;
        }

        .content-area {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid #ecf0f1;
            border-radius: 6px;
            margin-top: 15px;
            background: white;
        }

        .history-item {
            padding: 8px;
            margin-bottom: 5px;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 3px solid #3498db;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .history-content {
            flex: 1;
        }

        .history-time {
            font-size: 12px;
            color: #7f8c8d;
            margin-right: 10px;
        }

        .history-command {
            font-weight: bold;
            color: #2c3e50;
        }

        .history-type {
            font-size: 12px;
            color: #3498db;
            margin-left: 10px;
            padding: 2px 6px;
            background: #ecf0f1;
            border-radius: 3px;
        }

        .empty-history {
            color: #95a5a6;
            text-align: center;
            padding: 40px 20px;
            font-style: italic;
        }

        .history-actions {
            display: flex;
            gap: 5px;
        }

        .copy-btn {
            background: none;
            border: 1px solid #3498db;
            color: #3498db;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.3s;
        }

        .copy-btn:hover {
            background: #3498db;
            color: white;
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
    status.textContent = 'Введите команду и нажмите Enter';

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
    // Проверяем, что строка состоит ровно из 10 цифр
    if (/^\d{10}$/.test(command)) {
        // Проверяем, начинается ли с "50"
        if (/^50/.test(command)) {
            return 'АВИТОПРИЕМКА';
        } else {
            return 'АВИТОВЫДАЧА';
        }
    } else {
        return 'ЯНДЕКС';
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

    // Функция для обновления отображения статистики
    function updateStatsDisplay() {
        const stats = calculateStats();
        avitoValue.textContent = stats.avito;
        avitoValue1.textContent = stats.avito1;
        yandexValue.textContent = stats.yandex;
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
        if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://pvz.avito.ru/deliver/scan/'+text+'/'+text)) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }
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
       /* if (tab && !tab.closed) {
            tab.focus();
            try {
                if (!tab.location.href.includes('https://hubs.market.yandex.ru/tpl-outlet/148822177/issuing')) {
                    tab.location.href = url;
                }
            } catch (e) {}
            return tab;
        }*/
        return window.open(url, windowName);
    }

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
        }
        if (commandType === 'АВИТОПРИЕМКА') {
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

    // Добавляем возможность перетаскивания окна
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    header.addEventListener('mousedown', function(e) {
        if (e.target === title || e.target === header) {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            container.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            container.style.left = (e.clientX - dragOffset.x + container.offsetWidth / 2) + 'px';
            container.style.top = (e.clientY - dragOffset.y + container.offsetHeight / 2) + 'px';
            container.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        container.style.cursor = '';
    });
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

    let currentURL = location.href;
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