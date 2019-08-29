./pack.sh android
web-ext run -s out/android -t firefox-android --android-device=b0254ffd --firefox-apk org.mozilla.firefox
rm -rf manifest.json