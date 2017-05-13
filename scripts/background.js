'use strict';

function translateCurrentPage() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (foundTabs) {
        var currentTabId = foundTabs[0].id;
        var executing = browser.tabs.executeScript(currentTabId, {
            file: 'scripts/inject_google_translate_content.js'
        });
    });
}

chrome.commands.onCommand.addListener(function(action) {
  if (action == "translate-current-page") {
    translateCurrentPage();
  }
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "translate-current-page") {
    translateCurrentPage();
  }
});

browser.browserAction.onClicked.addListener(translateCurrentPage);

chrome.contextMenus.create({
  id: "translate-current-page",
  title: "Translate Current Page",
  contexts: ["all"]
});
browser.pageAction.onClicked.addListener(translateCurrentPage);

browser.tabs.onActivated.addListener(function(tabInfo){
  browser.pageAction.show(tabInfo.tabId);
});
