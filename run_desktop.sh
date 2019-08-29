./pack.sh android
web-ext run -s out/desktop --url about:debugging \
    --url example.com --url https://blog.activewatch.ro/ --url https://github.com/andreicristianpetcu/google_translate_this/issues/6 \
    -u  ftp://ftp.cs.brown.edu/pub/ -v
