// ==UserScript==
// @name         PVZ Reminders (Local Config, SPA)
// @namespace    pvz_reminders_local
// @version      2.1
// @description  Напоминания для сайтов без Google Sheets (SPA, draggable)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* ================= НАСТРОЙКИ ================= */

    const REMINDERS = [
        {
            match: "pvz.avito.ru/accept",
            title: "Габариты для приемки",
            message: `- Максимальная сумма сторон 2.4м
- Одна сторона не более 120см`,
        },
      {
            match: "https://hubs.market.yandex.ru/tpl-outlet/148822177/acceptance-request",
            title: "Что нельзя отправлять через Яндекс Доставку",
            message: `-Вещества, способные к детонации или взрыву
-Газы, легко воспламеняющиеся при нормальных условиях
-Жидкости с низкой температурой воспламенения
-Твёрдые вещества, способные к самовозгоранию
-Окислители, способные вызывать возгорание других веществ
-Ядовитые вещества и биологически опасные материалы
-Источники ионизирующего излучения
-Едкие и коррозирующие вещества, вызывающие разрушение материалов и способные причинить вред здоровью
-Материалы и устройства, представляющие угрозу при перевозке
-Оружие всех типов, боеприпасы, а также средства самообороны в том числе и муляжи
-Контролируемые вещества, влияющие на психику
-Драгоценные металлы и натуральные драгоценные камни и изделия их содержащие
-Денежные средства и иные ценные финансовые документы
-Животные и их части, насекомые
-Любые продукты животного и растительного происхождения, а также любые продукты питания и корма для животных
-Останки, органы и биоматериалы человека
-Алкогольная пищевая спиртосодержащая продукция как имеющая, так и не имеющая акцизную марку
-Табак всех видов и его производные, а также электронные сигареты и относящиеся к ним товары
-Официальные документы, подтверждающие личность
-Изделия, имеющие историческую, научную или культурную ценность
-Продукция, подлежащая экспортному контролю и имеющая военное назначение
-Продукция, содержащая сцены порнографического характера
-Продукция, нарушающая права или интересы граждан и государства
-Товары с неустановленным или подозрительным содержанием
-Живые растения и цветы
-Любые иные предметы, оборот которых запрещен или ограничен на территории Российской Федерации
-Предметы, которые требуют для перевозки специально оборудованные транспортные средства (имеющие датчики температуры/влажности/кантования/наклона/удара и т.д.)
-Любые медикаменты и медицинские препараты. Биологически активные добавки и лекарственные травы`,
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
            top:20px;
            right:20px;
            width:320px;
            max-height:70vh;
            background:#fff;
            border:1px solid #ccc;
            border-radius:10px;
            padding:15px;
            box-shadow:0 2px 12px rgba(0,0,0,0.25);
            z-index:999999;
            font-family:Arial,sans-serif;
            cursor:move;
            overflow:hidden;
        `;

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-weight:bold;font-size:16px;">${title}</div>
                <button id="rem_close_btn"
                    style="background:#d9534f;color:#fff;border:none;
                           padding:4px 8px;border-radius:6px;
                           cursor:pointer;font-size:14px;">×</button>
            </div>
            <div style="
                font-size:14px;
                white-space:pre-wrap;
                word-wrap:break-word;
                overflow-y:auto;
                max-height:calc(70vh - 50px);
            ">${msg}</div>
        `;

        document.body.appendChild(box);

        box.querySelector("#rem_close_btn").onclick = () => {
            box.remove();
            reminderBox = null;
        };

        // ---- drag ----
        let dragging = false, offsetX = 0, offsetY = 0;

        box.addEventListener("mousedown", e => {
            if (e.target.tagName !== "BUTTON") {
                dragging = true;
                offsetX = box.offsetLeft - e.clientX;
                offsetY = box.offsetTop - e.clientY;
            }
        });

        document.addEventListener("mouseup", () => dragging = false);
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

})();
