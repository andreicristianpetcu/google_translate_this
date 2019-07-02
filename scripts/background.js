'use strict';

const APPLICABLE_PROTOCOLS = ["http:", "https:"];

function protocolIsApplicable(url) {
  var anchor = document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

function showPageActionOnTab(tabInfo) {
  if (protocolIsApplicable(tabInfo.url)) {
    browser.pageAction.show(tabInfo.id);
  }
}

function translateCurrentPage() {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }, function (foundTabs) {
    var currentTabId = foundTabs[0].id;
    var executing = browser.tabs.executeScript(currentTabId, {
      file: 'scripts/inject_google_translate_content.js'
    });
  });
}

if (browser.commands) {
  browser.commands.onCommand.addListener(function (action) {
    if (action == "translate-current-page") {
      translateCurrentPage();
    }
  });
}

if (browser.contextMenus) {
  browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "translate-current-page") {
      translateCurrentPage();
    }
  });
  browser.contextMenus.create({
    id: "translate-current-page",
    title: browser.i18n.getMessage("translateCurrentPage"),
    contexts: ["all"]
  });
}

if (browser.browserAction) {
  browser.browserAction.setIcon({
    "path": {
      "19": "images/icon-19.png",
      "38": "images/icon-38.png"
    }
  });
  browser.browserAction.onClicked.addListener(translateCurrentPage);
}


if (browser.pageAction) {
  browser.pageAction.onClicked.addListener(translateCurrentPage);
  browser.tabs.query({}).then((tabs) => {
    var tab;
    for (tab of tabs) {
      showPageActionOnTab(tab);
    }
  });

  browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    showPageActionOnTab(tab);
  });
}

var translateStaticLocation = "translate.googleapis.com";

function rewriteCSPHeader(e) {
  console.log('3');
  for (var header of e.responseHeaders) {
    console.log('4');
    if (header.name.toLowerCase() === "content-security-policy") {
      console.log('5 ' + e.url);
      var oldHeader = header.value;
      let newValue = insertOrAppend('script-src', translateStaticLocation, header.value);
      newValue = insertOrAppend('style-src', translateStaticLocation, newValue);
      header.value = newValue;
    }
  }
  return { responseHeaders: e.responseHeaders };
}

function insertOrAppend(typeOfContent, domain, oldValue){
  var typeOfContentParts = oldValue.split(typeOfContent);
  if (typeOfContentParts.length > 1) {
    if(typeOfContentParts[1].indexOf(domain) === -1){
      let unsafeInline = '';
      if(typeOfContentParts[1].indexOf('unsafe-inline') === -1 ||  typeOfContentParts[1].indexOf('unsafe-inline') > 1) {
        unsafeInline = ' \'unsafe-inline\'';
      }
      const newValue = typeOfContentParts[0] + typeOfContent + unsafeInline + ' ' + translateStaticLocation + typeOfContentParts[1];
      console.log(typeOfContent + 'old ' + oldValue);
      console.log(typeOfContent + 'new ' + newValue);
      return newValue;
    }
  }
  return oldValue;
}

browser.webRequest.onHeadersReceived.addListener(rewriteCSPHeader,
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]);
