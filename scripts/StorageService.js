let allDomainsData = [];
let langCookie = {
    value: "/auto/en"
}

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

    static async getGoogtransCookie() {
        const item = await browser.storage.local.get("langCookie");
        if (item && item.langCookie && item.langCookie.value) {
            return item.langCookie.value
        } else {
            return langCookie.value
        }
    }

    static setLangCookie(domain) {
        browser.cookies.set({
            url: domain,
            name: "googtrans",
            value: langCookie.value
        });
    }

    static async init() {
        langCookie.value = await StorageService.getGoogtransCookie();
        browser.cookies.onChanged.addListener(function (changeInfo) {
            if (changeInfo.cause === "overwrite" && changeInfo.cookie.name === "googtrans") {
                langCookie.value = changeInfo.cookie.value;
                browser.storage.local.set({ langCookie: langCookie });
            }
        });
    }

}

StorageService.init();