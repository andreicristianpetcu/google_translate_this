var gtdiv = document.createElement("div");
gtdiv.setAttribute("id", "google_translate_element");
gtdiv.style.display="none";
document.body.appendChild(gtdiv);

var googleTranslateElementInitCode = "function(){ \
  new google.translate.TranslateElement({pageLanguage: 'auto', autoDisplay: true}, 'google_translate_element'); \
  setTimeout(function(){ \
    var iframe = document.getElementsByClassName('goog-te-banner-frame')[0]; \
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document; \
    iframeDocument.getElementsByClassName('goog-te-button')[0].children[0].children[0].click(); \
  }, 1000); \
}";

var globalFunctionScript = document.createElement('script');
globalFunctionScript.text = "googleTranslateElementInit = " + googleTranslateElementInitCode;
globalFunctionScript.type = "text/javascript";
document.getElementsByTagName('head')[0].appendChild(globalFunctionScript);

var gtScript = document.createElement('script');
gtScript.type = "text/javascript";
gtScript.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.getElementsByTagName('head')[0].appendChild(gtScript);
"Done loading";