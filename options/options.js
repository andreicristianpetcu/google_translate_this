function storeSettings() {

  function getSince() {
    const since = document.querySelector("#since");
    return since.value;
  }

  const since = getSince();
  browser.storage.local.set({
    since
  });
}

function updateUI(restoredSettings) {
  const selectList = document.querySelector("#since");
  selectList.value = restoredSettings.since;
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
