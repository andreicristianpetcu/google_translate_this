platform=$1
mkdir -p "out/$platform"
cp -r _locales "out/$platform"
cp -r images "out/$platform"
cp -r options "out/$platform"
cp -r scripts "out/$platform"
cat "manifest_$platform.json" > "out/$platform/manifest.json"
