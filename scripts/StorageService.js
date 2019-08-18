const STORAGE_LANG_KEY = "langCookie";

class StorageService {

    static async init() {
        browser.cookies.onChanged.addListener(function (changeInfo) {
            if (changeInfo.cause === "overwrite" && changeInfo.cookie.name === "googtrans") {
                CachedStorageLocal.save(STORAGE_LANG_KEY, { value: changeInfo.cookie.value });
            }
        });
    }

    static async shouldAlwaysTranslate(domain) {
        const domainData = await getDomainDataOrDefaults(domain); 
        return domainData.shouldAlwaysTranslate;
    }

    static async toggleTranslateDomain(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        domainData.shouldAlwaysTranslate = !domainData.shouldAlwaysTranslate
        await CachedStorageLocal.save(domain, domainData)
        return domainData.shouldAlwaysTranslate;
    }

    static async setHasCsp(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        domainData.hasCSP = true;
        await CachedStorageLocal.save(domain, domainData)
    }

    static async hasCsp(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        return domainData.hasCSP;
    }

    static async setLangCookie(domain) {
        const langCookie = await getGoogtransCookie();
        browser.cookies.set({
            url: domain,
            name: "googtrans",
            value: langCookie.value
        });
    }

}

async function getDomainDataOrDefaults(domain) {
    return CachedStorageLocal.getFromCacheStorageOrDefault(domain, {
        shouldAlwaysTranslate: false,
        hasCSP: false
    });
}

async function getGoogtransCookie() {
    return CachedStorageLocal.getFromCacheStorageOrDefault(STORAGE_LANG_KEY, "/auto/en");
}

const cache = [];
class CachedStorageLocal {
    static async getFromCacheStorageOrDefault(key, defaultValue) {
        if (cache[key]) {
            return cache[key];
        }
        const item = await browser.storage.local.get(key);
        if (item[key]) {
            cache[key] = item[key];
            return item[key];
        }
        CachedStorageLocal.save(key, defaultValue);
        return defaultValue;
    }

    static async save(key, value) {
        cache[key] = value;
        let objectToStore = {};
        objectToStore[key] = value;
        return browser.storage.local.set(objectToStore);
    }

}

StorageService.init();