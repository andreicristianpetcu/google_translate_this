'use strict';

function onExecuted(result) {
    console.log('We made it green');
}

function onError(error) {
    console.log('Error: ' + error);
}

function translateCurrentTab() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (foundTabs) {
        var currentTabId = foundTabs[0].id;
        var executing = browser.tabs.executeScript(currentTabId, {
            file: 'scripts/inject_google_translate_content.js'
        });
        executing.then(onExecuted, onError);
    });
}
browser.browserAction.onClicked.addListener(translateCurrentTab);
