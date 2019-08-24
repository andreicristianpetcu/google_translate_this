function getTranslationMode() {
  const translationMode = document.querySelector("#translationMode");
  return translationMode.value;
}

function storeSettings() {
  const translationMode = getTranslationMode();
  getStorage().set({ translationMode });
}

async function initOptionsPage() {
  const saveButton = document.querySelector("#save-button");
  saveButton.addEventListener("click", storeSettings);
  const restoredSettings = await getStorage().get("translationMode");
  const translationModeSelect = document.querySelector("#translationMode");
  if(!!restoredSettings.translationMode) {
    translationModeSelect.value = restoredSettings.translationMode;
  } else {
    translationModeSelect.value = "alwaysDomain";
    storeSettings();
  }
}

function getStorage() {
  if (!!browser.storage.sync) {
    return browser.storage.sync;
  } else {
    return browser.storage.local;
  }
}

initOptionsPage();