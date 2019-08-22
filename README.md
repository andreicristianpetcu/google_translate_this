# Google Translate This
This WebExtension translates the current page with Google Translate. It does so on demand so it does not change the page unless the user selected this.

# [Desktop install](https://github.com/andreicristianpetcu/google_translate_this/releases/download/v2.2.12/google_translate_this_page-2.2.12-fx.xpi)

# [Android install](https://github.com/andreicristianpetcu/google_translate_this/releases/download/v2.2.12/google_translate_this_page-2.2.12-an.xpi)

![Alt text](https://raw.githubusercontent.com/andreicristianpetcu/google_translate_this/master/images/google_translate_this_print_screen.png)

# Why is this not on AMO?
This extension [executes remote code from Google in your current page](https://github.com/andreicristianpetcu/google_translate_this/blob/81b7f16858650f127ec3e54250a7089ca9b03219/scripts/inject_google_translate_content.js#L17) and this is against [AMO rules](https://developer.mozilla.org/en-US/Add-ons/AMO/Policy/Reviews). If you use Chrome it does the same thing.
I hope I can make it get into AMO soon but it depends on a lot of things.

# Privacy considerations
This extension by default does [not transmit any info to any site](https://github.com/andreicristianpetcu/google_translate_this/blob/d3f1344e1ed0382a34e385fdfa2584b88eb2ee18/scripts/background.js#L38-L47). ONCE YOU CLICK TRANSLATE CONSIDER THE PAGE SENT TO GOOGLE! Unfortunately this is how Google Translate works. This is the best I could do with the APIs that are avilable. I tried to isolate the page somehow but it is really difficult. Not only this but the extension grabs code from google translate and injects it in your current page. This only happens after you click translate, if you don't interact with the extension, nothing gets send.

This extension was designed for people leaving Chrome for Firefox. Some really need this feature and don't mind the downsides. If you want a more privacy frinedly extension, check out [AMO](https://addons.mozilla.org/firefox/search/?q=translate&sort=users&type=extension) it has quite a few of them. Unfortunately they are not as user friendly as this one.

# Planned features
I hope it will work in Android soon since I am using WebExtension APIs and they work in Android also.
