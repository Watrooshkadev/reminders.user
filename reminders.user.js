// ==UserScript==
// @name         PVZ Reminders (Local Config, SPA)
// @namespace    pvz_reminders_local
// @version      2.0
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
