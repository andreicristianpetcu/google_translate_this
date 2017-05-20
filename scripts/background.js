'use strict';

const APPLICABLE_PROTOCOLS = ["http:", "https:"];

function protocolIsApplicable(url) {
  var anchor =  document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

function showPageActionOnTab(tabInfo){
  if (protocolIsApplicable(tabInfo.url)) {
    browser.pageAction.show(tabInfo.id);
  }
}

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
browser.contextMenus.create({
  id: "translate-current-page",
  title: "Translate Current Page",
  contexts: ["all"]
});
browser.pageAction.onClicked.addListener(translateCurrentPage);

//browser.tabs.query({}).then((tabs) => {
//  var tab;
//  for (tab of tabs) {
//    showPageActionOnTab(tab);
//  }
//});
//
//browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
//  showPageActionOnTab(tab);
//});
