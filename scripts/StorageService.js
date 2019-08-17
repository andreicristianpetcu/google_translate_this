let allDomainsData = [];
const STORAGE_LANG_KEY = "langCookie";

class StorageService {
    static getDomainDataOrDefaults(domain) {
        let domainData = allDomainsData[domain];
        if (!domainData) {
            domainData = {
                shouldAlwaysTranslate: false,
                hasCSP: true
            }
            allDomainsData[domain] = domainData;
        }
        return domainData;
    }
    static shouldAlwaysTranslate(domain) {
        return StorageService.getDomainDataOrDefaults(domain).shouldAlwaysTranslate;
    }
    static toggleTranslateDomain(domain) {
        const domainData = StorageService.getDomainDataOrDefaults(domain);
        return domainData.shouldAlwaysTranslate = !domainData.shouldAlwaysTranslate;
    }

    static setHasCsp(domain) {
        StorageService.getDomainDataOrDefaults(domain).hasCSP = true;
    }

    static hasCsp(domain) {
        return StorageService.getDomainDataOrDefaults(domain).hasCSP;
    }

    static async setLangCookie(domain) {
        const langCookie = await getGoogtransCookie();
        browser.cookies.set({
            url: domain,
            name: "googtrans",
            value: langCookie.value
        });
    }

    static async init() {
        browser.cookies.onChanged.addListener(function (changeInfo) {
            if (changeInfo.cause === "overwrite" && changeInfo.cookie.name === "googtrans") {
                CachedStorageLocal.save(STORAGE_LANG_KEY, { value: changeInfo.cookie.value });
            }
        });
    }

}

async function getGoogtransCookie() {
    return CachedStorageLocal.getFromCacheStorageOrDefault(STORAGE_LANG_KEY, "/auto/en");
}

const cache = [];
class CachedStorageLocal {
    static async getFromCacheStorageOrDefault(key, defaultValue) {
        if (cache[key]) {
            console.log(">>cache " + key + " " + JSON.stringify(cache[key]));
            return cache[key];
        }
        const item = await browser.storage.local.get(key);
        if (item[key]) {
            cache[key] = item[key];
            console.log(">>storage " + key + " " + JSON.stringify(cache[key]));
            return item[key];
        }
        CachedStorageLocal.save(key, defaultValue);
        console.log(">>default " + key + " " + JSON.stringify(defaultValue));
        return defaultValue;
    }

    static async save(key, value) {
        cache[key] = value;
        let objectToStore = {};
        objectToStore[key] = value;
        console.log("<<save " + JSON.stringify(objectToStore));
        return browser.storage.local.set(objectToStore);
    }

}


StorageService.init();