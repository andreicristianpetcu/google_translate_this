var gtdiv = document.createElement("div");
gtdiv.setAttribute("id", "google_translate_element");
document.body.appendChild(gtdiv);

var googleTranslateElementInitCode = "function(){ \
  console.log(\"calling googleTranslateElementIniu from source\"); \
  new google.translate.TranslateElement({layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element'); \
}";

var globalFunctionScript = document.createElement('script');
globalFunctionScript.text = "googleTranslateElementInit = " + googleTranslateElementInitCode;
globalFunctionScript.type = "text/javascript";
document.getElementsByTagName('head')[0].appendChild(globalFunctionScript);

var gtScript = document.createElement('script');
gtScript.type = "text/javascript";
gtScript.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.getElementsByTagName('head')[0].appendChild(gtScript);
