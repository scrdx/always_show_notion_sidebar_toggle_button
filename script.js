// ==UserScript==
// @name         always show notion sidebar toggle button
// @namespace    bias.site
// @version      2025-08-11
// @description  always show notion sidebar toggle button
// @description:zh-cn  还原notion侧边栏的历史样式，总是展示目录树的展开/收起按钮。提供更清晰的树层级结构。
// @author       scrdx
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('NOTION::TAMPERMONKEY');

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    let showToggle = function(mutations) {
        for (let mutation of mutations) {
            let treeItem = document.querySelectorAll('.notion-outliner-private-header-container div[role="tree"] div[dir="ltr"]');
            for (let item of treeItem) {
                let iconArea = item?.children[0]?.children[0];
                if (!iconArea) {
                    continue;
                }
                iconArea.classList.add('notion-sidebar-tree-item');
                let toggleButton = iconArea.children[0];
                if (toggleButton) {
                    toggleButton.style.opacity = 1;
                    toggleButton.style['grid-area']='1/1';
                }
                let iconButton = iconArea.children[1];
                if (iconButton) {
                    iconButton.style.opacity = 1;
                    iconButton.style['grid-area']='1/2';
                }
            }

            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                let newValue = mutation.target.style.opacity;
                let oldValue = mutation.oldValue;
                mutation.target.style.opacity = 1;
            }
        }
    };

    waitForElement('.notion-outliner-private-header-container', (element) => {
        const observer = new MutationObserver(showToggle);
        const config = {
            childList: true,
            subtree: true ,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['style']
        };
        observer.observe(element, config);
    });

})();
