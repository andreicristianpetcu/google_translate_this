const STORAGE_LANG_KEY = "langCookie";

class StorageService {

    static async init() {
        browser.cookies.onChanged.addListener(function (changeInfo) {
            if (changeInfo.cause === "overwrite" && changeInfo.cookie.name === "googtrans") {
                LocalOrSyncStorage.save(STORAGE_LANG_KEY, { value: changeInfo.cookie.value });
            }
        });
    }

    static async getAlwaysTranslateStatus(url) {
        const domainData = await getDomainDataOrDefaults(domain); 
        return domainData.shouldTranslate;
    }

    static async shouldTranslate(domain) {
        const domainData = await getDomainDataOrDefaults(domain); 
        return domainData.shouldTranslate;
    }

    static async toggleTranslateDomain(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        domainData.shouldTranslate = !domainData.shouldTranslate;
        await LocalOrSyncStorage.save(domain, domainData)
        return domainData.shouldTranslate;
    }

    static async setTranslateDomain(domain, newValue) {
        const domainData = await getDomainDataOrDefaults(domain);
        domainData.shouldTranslate = newValue;
        await LocalOrSyncStorage.save(domain, domainData)
        return domainData.shouldTranslate;
    }

    static async setHasCsp(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        domainData.hasCSP = true;
        await LocalOrSyncStorage.save(domain, domainData)
    }

    static async hasCsp(domain) {
        const domainData = await getDomainDataOrDefaults(domain);
        return domainData.hasCSP;
    }

    static async setLangCookie(domain, storeId) {
        const langCookie = await getGoogtransCookie();
        await browser.cookies.set({   
            url: domain,
            name: "googtrans",
            value: langCookie.value,
            storeId
        });
    }

    static async getAlwaysTranslateMode(){
        return LocalOrSyncStorage.getFromCacheStorageOrDefault("translationMode", "ALWAYS_DOMAIN");
    }
}

async function getDomainDataOrDefaults(domain) {
    return LocalOrSyncStorage.getFromCacheStorageOrDefault(domain, {
        shouldTranslate: false,
        hasCSP: false
    });
}

async function getGoogtransCookie() {
    return LocalOrSyncStorage.getFromCacheStorageOrDefault(STORAGE_LANG_KEY, "/auto/en");
}

class LocalOrSyncStorage {
    static async getFromCacheStorageOrDefault(key, defaultValue) {
        let item = await this.getStorage().get(key);
        item = item[key];
        if (!item) {
            item = defaultValue;
            LocalOrSyncStorage.save(key, item);
        }
        return item;
    }

    static async save(key, value) {
        let objectToStore = {};
        objectToStore[key] = value;
        return this.getStorage().set(objectToStore);
    }

    static getStorage(){
        if(!!browser.storage.sync){
            return browser.storage.sync;
        } else {
            return browser.storage.local;
        }
    }

}

StorageService.init();