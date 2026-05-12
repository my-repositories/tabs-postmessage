type Tabik = {parent: number, derived: number};
let tabiki: Tabik[] = [];

chrome.runtime.onMessage.addListener(
  async (message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (!sender || sender.id !== chrome.runtime.id) {
      console.error('Oops!');
      return;
    }

    console.info({ message, sender });

    switch (message.action) {
      case 'new': {
        tabiki.push({ parent: sender.tab?.id!, derived: message.derivedTabId });
        break;
      }
      case 'request': {
        const tabik = tabiki.find(t => t.parent === sender.tab?.id!)
        if (!tabik) {
          return;
        }

        chrome.tabs.sendMessage(tabik.derived, { action: 'request', payload: message.payload });
        break;
      }

      default: throw '???';
    }

    sendResponse({ ok: true });
    return true;
  }
);

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  tabiki = tabiki.filter(t => t.derived === tabId || t.parent === tabId) 
});