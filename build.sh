version=$1

generate_update_json() {
  new_version=$1
  browser_type=$2
  update_file_name="updates.json"
  addon_id="e34d5840-6b3b-49d8-92c2-9696798c4e2a"
  build_fragment="fx"
  if [ "$browser_type" == "android" ]; then
    update_file_name="updates_android.json"
    addon_id="aaaa5840-6b3b-49d8-92c2-9696798c4e2a"
    build_fragment="an"
  fi
  sed -i "/$new_version/d" versions.txt
  echo "{
  \"addons\": {
    \"{$addon_id}\": {
      \"updates\": [" > "$update_file_name"

  while IFS= read -r old_version; do
    echo "        {
          \"version\": \"$old_version\",
          \"update_link\": \"https://github.com/andreicristianpetcu/google_translate_this/releases/download/v$old_version/google_translate_this_page-$old_version-$build_fragment.xpi\"
        }," >>"$update_file_name"
  done <versions.txt

  printf "$new_version\n" >>versions.txt
  echo "        {
          \"version\": \"$new_version\",
          \"update_link\": \"https://github.com/andreicristianpetcu/google_translate_this/releases/download/v$new_version/google_translate_this_page-$new_version-$build_fragment.xpi\"
        }
     ]
    }
  }
}" >>"$update_file_name"
}

sed -i -E "s/\"version\":(.*)/\"version\": \"$version\",/" manifest_desktop.json
sed -i -E "s/\"version\":(.*)/\"version\": \"$version\",/" manifest_android.json
cat rm_template.md > README.md
sed -i -E "s/NEW_VERSION/$version/" README.md

generate_update_json "$version" "android"
generate_update_json "$version" "desktop"

#build desktop
cat manifest_desktop.json > manifest.json
web-ext lint -s . --self-hosted -i "*.sh"
zip tr_desktop.zip manifest.json scripts/* images/* _locales/**/*
rm -rf manifest.json

#build android
cat manifest_android.json > manifest.json
web-ext lint -s . --self-hosted -i "*.sh"
zip tr_android.zip manifest.json scripts/* images/* _locales/**/*
rm -rf manifest.json

# git add .
# git commit -m "Release v$version"
# git tag "v$version"

xdg-open https://addons.mozilla.org/en-US/developers/addon/60f12ab296874cd39fef/versions
xdg-open https://addons.mozilla.org/en-US/developers/addon/google-translate-this-page1/versions
xdg-open https://github.com/andreicristianpetcu/google_translate_this/releases
