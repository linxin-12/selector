/**
 * Selector Extension — Background Service Worker
 * Handles toolbar icon click to toggle the editor on the active tab.
 */

const EDITOR_ID = "ai-editor-root-marker";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

  // Check if editor is already active
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => !!document.querySelector(".ai-editor-root"),
  });

  if (result.result) {
    // Remove editor
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const destroyFn = window.__selectorDestroy;
        if (destroyFn) { destroyFn(); delete window.__selectorDestroy; }
      },
    });
    chrome.action.setIcon({ tabId: tab.id, path: {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png",
    }});
  } else {
    // Inject editor
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["editor.css"],
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.action.setIcon({ tabId: tab.id, path: {
      "16": "icons/icon-active16.png",
      "32": "icons/icon-active32.png",
      "48": "icons/icon-active48.png",
      "128": "icons/icon-active128.png",
    }});
  }
});
