function storeSettings() {

  function getTranslationMode() {
    const translationMode = document.querySelector("#translationMode");
    return translationMode.value;
  }

  const translationMode = getTranslationMode();
  browser.storage.local.set({
    translationMode
  });
}

function updateUI(restoredSettings) {
  const translationModeSelect = document.querySelector("#translationMode");
  translationModeSelect.value = restoredSettings.translationMode;
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
