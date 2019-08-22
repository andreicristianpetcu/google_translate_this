cat manifest_desktop.json > manifest.json
web-ext run -s . --url about:debugging \
    --url example.com --url https://blog.activewatch.ro/ --url https://github.com/andreicristianpetcu/google_translate_this/issues/6 \
    -u  ftp://ftp.cs.brown.edu/pub/ -v
rm -rf manifest.json