// ==UserScript==
// @name         Reminders (Local Config, SPA)
// @namespace    reminders_local
// @version      2.4
// @description  Напоминания для сайтов
// @author       Watrooshka
// @updateURL    https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @downloadURL  https://raw.githubusercontent.com/Watrooshkadev/reminders.user/refs/heads/main/reminders.user.js
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* ================= НАСТРОЙКИ ================= */

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

})();
