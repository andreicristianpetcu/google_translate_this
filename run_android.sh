cat manifest_android.json > manifest.json
web-ext run -s . -t firefox-android --android-device=b0254ffd --firefox-apk org.mozilla.firefox
rm -rf manifest.json