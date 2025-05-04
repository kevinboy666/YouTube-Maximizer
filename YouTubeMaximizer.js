// ==UserScript==
// @name         YouTube Maximizer 網頁全螢幕
// @namespace    http://tampermonkey.net/
// @license     MIT
// @version      1.4
// @description  Maximizes the YouTube player to fill the entire browser viewport when in theater mode
// @author       sharlxeniy <sharlxeniy@gmail.com>
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528565/YouTube%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/528565/YouTube%20Maximizer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定义样式表
    const styleSheet = `
        #masthead-container {
            transition: opacity 0.3s ease;
            opacity: 0; /* 初始隐藏顶部导航栏 */
            pointer-events: auto;
        }
        #page-manager {
            margin-top: 0 !important;
        }
        #full-bleed-container {
            height: 100vh !important; /* 填满屏幕 */
            max-height: 100vh !important;
        }
        #movie_player {
            width: 100vw !important; /* 视频宽度为全屏 */
            height: 100vh !important; /* 视频高度为全屏 */
        }
    `;

    function addStyles() {
        if (!document.querySelector('#custom-youtube-style')) {
            const style = document.createElement('style');
            style.id = 'custom-youtube-style';
            style.textContent = styleSheet;
            document.head.appendChild(style);
        }
    }

    function isWatchPage() {
        return location.pathname === '/watch';
    }

    function updateStyles() {
        if (document.cookie.includes('wide=1')) {
            addStyles();
        } else {
            const style = document.querySelector('#custom-youtube-style');
            if (style) style.remove();
        }
    }

    function dismissPromo() {
        const dismissButton = document.querySelector('#dismiss-button button');
        if (dismissButton) {
            console.log('發現Premium廣告，已自動關閉');
            dismissButton.click();
        }
    }

    function handleScroll() {
        const navbar = document.querySelector('#masthead-container');
        if (!navbar) return;

        if (window.scrollY > 0) {
            navbar.style.opacity = '1';
            navbar.style.pointerEvents = 'auto';
        } else {
            navbar.style.opacity = '0';
            navbar.style.pointerEvents = 'none';
        }
    }

    updateStyles();
    dismissPromo();
    const observer = new MutationObserver(() => {
        updateStyles();
        dismissPromo();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', handleScroll);

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[YouTube Maximizer] URL changed, reapplying...');
            updateStyles();
            dismissPromo();
        }
    }, 500);
    
})();
