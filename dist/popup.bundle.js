/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/

document.addEventListener("DOMContentLoaded", () => {
    const turnOnCheckbox = document.getElementById("turn-on");
    // Load the current setting from storage
    chrome.storage.sync.get(["enableCommandMode"], (result) => {
        var _a;
        turnOnCheckbox.checked = (_a = result.enableCommandMode) !== null && _a !== void 0 ? _a : false; // Default to false
    });
    // Update the setting when the checkbox state changes
    turnOnCheckbox.addEventListener("change", () => {
        const isEnabled = turnOnCheckbox.checked;
        chrome.storage.sync.set({ enableCommandMode: isEnabled }, () => {
            // Send message to content script
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var _a;
                if ((_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "toggleCommandMode",
                        enabled: isEnabled,
                    });
                }
            });
            console.log(`Insert Mode has been ${isEnabled ? "enabled" : "disabled"}.`);
        });
    });
});

/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map