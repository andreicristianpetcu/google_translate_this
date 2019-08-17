#build desktop
zip tr.zip manifest.json scripts/* images/* _locales/*

#build android
mv manifest.json manifest_desktop.json
cp manifest_android.json manifest.json
zip android_tr.zip manifest.json scripts/* images/* _locales/*
mv manifest_desktop.json manifest.json