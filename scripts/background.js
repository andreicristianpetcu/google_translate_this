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

function parseCsp(policy) {
  return policy.split(';').reduce((result, directive) => {
    const trimmed = directive.trim();
    if (!trimmed) {
      return result;
    }
    const split = trimmed.split(/\s+/g);
    const key = split.shift();
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = split;
    }
    return result;
  }, {});
};

function joinCsp(parsedCsp) {
  let directives = [];
  for (var directiveName in parsedCsp) {
    let directiveValue = parsedCsp[directiveName];
    let directivePartToAppend;
    if (directiveValue.length === 0) {
      directivePartToAppend = directiveName;
    } else if (directiveValue.length === 1) {
      directivePartToAppend = directiveName + " " + directiveValue[0];
    } else {
      directivePartToAppend = directiveName + " " + directiveValue.join(" ");
    }
    directives.push(directivePartToAppend);
  }
  return directives.join('; ');
}

function rewriteCSPHeader(e) {
  if (e.type === "main_frame") {
    for (var header of e.responseHeaders) {
      if (header.name.toLowerCase() === "content-security-policy") {
        const parsedCsp = parseCsp(header.value);
        const defaultSrc = parsedCsp['default-src'];
        let newValue = parsedCsp;
        newValue = insertOrAppend('script-src', "'unsafe-inline'", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "'unsafe-eval'", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "translate.googleapis.com", newValue, defaultSrc);
        //google news ++
        newValue = insertOrAppend('script-src', "www.gstatic.com", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "ssl.gstatic.com", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "www.google.com", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "apis.google.com", newValue, defaultSrc);
        newValue = insertOrAppend('script-src', "www.google-analytics.com", newValue, defaultSrc);
        //google news --
        newValue = insertOrAppend('connect-src', "translate.googleapis.com", newValue);
        //google news++
        newValue = insertOrAppend('style-src', "'unsafe-inline'", newValue, defaultSrc);
        newValue = insertOrAppend('style-src', "'unsafe-eval'", newValue, defaultSrc);
        newValue = insertOrAppend('style-src', "www.gstatic.com", newValue, defaultSrc);
        //google news--
        newValue = insertOrAppend('style-src', "translate.googleapis.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "translate.googleapis.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "translate.google.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "www.gstatic.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "www.google.com", newValue, defaultSrc);
        //google news++
        newValue = insertOrAppend('img-src', "ssl.gstatic.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "*.googleusercontent.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "www.google-analytics.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "*.youtube.com", newValue, defaultSrc);
        newValue = insertOrAppend('img-src', "stats.g.doubleclick.net", newValue, defaultSrc);
        //google news--
        const joinedCsp = joinCsp(newValue);
        console.log("\n..." + e.url + " " + e.type);
        console.log("---" + header.value);
        console.log("+++" + joinedCsp);
        console.log(header.value === joinedCsp);
        header.value = joinedCsp;
      }
    }
  }
  return { responseHeaders: e.responseHeaders };
}

function removeNounce(directiveValues) {
  if (directiveValues) {
    let cleanedValues = [];
    for (let value of directiveValues) {
      if (value.indexOf('nonce-') == -1) {
        cleanedValues.push(value);
      }
    }
    return cleanedValues;
  } else {
    return directiveValues
  }
}

function insertOrAppend(typeOfContent, domain, oldValue, defaultSrc) {
  oldValue[typeOfContent] = removeNounce(oldValue[typeOfContent]);
  if (!oldValue[typeOfContent]) {
    if (defaultSrc) {
      oldValue[typeOfContent] = defaultSrc.slice();
    } else {
      oldValue[typeOfContent] = ["'self'", "'unsafe-inline'"];
    }
  }
  if (oldValue[typeOfContent].indexOf(domain) === -1) {
    oldValue[typeOfContent].push(domain);
  }
  return oldValue;
}

browser.webRequest.onHeadersReceived.addListener(rewriteCSPHeader,
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]);
