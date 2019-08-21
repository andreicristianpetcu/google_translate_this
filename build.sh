version=$1

sed -i -E "s/\"version\":(.*)/\"version\": \"$version\",/" manifest.json
sed -i -E "s/\"version\":(.*)/\"version\": \"$version\",/" manifest_android.json
cat rm_template.md > README.md
sed -i -E "s/NEW_VERSION/$version/" README.md

sed -i "/$version/d" versions.txt

echo '{
  "addons": {
    "{e34d5840-6b3b-49d8-92c2-9696798c4e2a}": {
      "updates": [' > updates_android.json

while IFS= read -r old_version
do
echo "        {
          \"version\": \"$old_version\",
          \"update_link\": \"https://github.com/andreicristianpetcu/google_translate_this/releases/download/v$old_version/google_translate_this_page-$old_version-an.xpi\"
        }," >> updates_android.json 
done < versions.txt

printf "$version\n" >> versions.txt
echo "        {
          \"version\": \"$version\",
          \"update_link\": \"https://github.com/andreicristianpetcu/google_translate_this/releases/download/v$version/google_translate_this_page-$version-an.xpi\"
        }
     ]
    }
  }
}" >> updates_android.json


#build desktop
cat manifest.json | grep version
zip tr_desktop.zip manifest.json scripts/* images/* _locales/**/*

#build android
cat manifest.json > manifest_desktop.json
cat manifest_android.json > manifest.json
cat manifest.json | grep version
zip tr_android.zip manifest.json scripts/* images/* _locales/**/*
cat manifest_desktop.json > manifest.json
rm -rf manifest_desktop.json

xdg-open https://addons.mozilla.org/en-US/developers/addon/60f12ab296874cd39fef/versions
xdg-open https://addons.mozilla.org/en-US/developers/addon/google-translate-this-page1/versions
xdg-open https://github.com/andreicristianpetcu/google_translate_this/releases