(document.getElementById('poiskovik') as HTMLInputElement)!.value = "https://www.google.com/search?&udm=50&&ntc=1&sa=X&biw=1411&bih=1075&dpr=1.35&q="

function getValue(id: string): string {
  return (document.getElementById(id) as HTMLInputElement)!.value
}

function setValue(id: string, value: any): void {
  (document.getElementById(id) as HTMLInputElement)!.value = value;
}

chrome.storage.local.get(['domen', 'enabled', 'kekSelector', 'poiskovik'], ({domen, enabled, kekSelector, poiskovik}) => {
  (document.getElementById('enabled') as HTMLInputElement)!.checked = enabled as boolean;
  setValue('domen', domen);
  setValue('kekSelector', kekSelector);
  setValue('poiskovik', poiskovik);
});

document.getElementById('save')!.onclick = async () => {
  function openNewTab(url: string): Promise<chrome.tabs.Tab> {
    return new Promise(resolve => {
      chrome.tabs.create(
        { url },
        (tab) => resolve(tab),
      );
    });
  }

  const derivedTab = await openNewTab(`https://github.com/?q=helloworld`);

  if (!derivedTab || !derivedTab.id) {
    return;
  }

  chrome.storage.local.set({
    domen: getValue('domen'),
    enabled: (document.getElementById('enabled') as HTMLInputElement)!.checked,
    kekSelector: getValue('kekSelector'),
    poiskovik: getValue('poiskovik'),
    derivedTabId: derivedTab.id
  });
};
