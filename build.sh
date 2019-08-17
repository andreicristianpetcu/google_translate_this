#build desktop
zip tr_desktop.zip manifest.json scripts/* images/* _locales/**/*

#build android
mv manifest.json manifest_desktop.json
cp manifest_android.json manifest.json
zip tr_android.zip manifest.json scripts/* images/* _locales/**/*
mv manifest_desktop.json manifest.json