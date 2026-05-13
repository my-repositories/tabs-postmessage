let prevTask = '';

const bootstrap = () => {
  function sendRequest() {
    chrome.storage.local.get(['kekSelector'], ({kekSelector}) => {
      const kekValues = document.querySelectorAll(kekSelector as string) as any;
      const payload = [...kekValues]
        .map(kek => kek.value || kek.innerText || kek.innerHTML)
        .join('\r\n');

      console.log({ prevTask, payload });
      if (prevTask === payload) {
        setTimeout(sendRequest, 1000);
      } else {
        prevTask = payload;
        chrome.runtime.sendMessage({
          action: 'request',
          payload: 'Формат ответа: "%Номер варианта% - %текст варианта%".\r\n Дай правильный ответ на вопрос:\r\n' + encodeURIComponent(payload),
        });
        setTimeout(sendRequest, 5000);
      }
    });
  }
  setTimeout(sendRequest, 5000);
};

window.onload = () => {
  chrome.storage.local.get(['domen', 'derivedTabId', 'enabled'], ({domen, derivedTabId, enabled}) => {
    if (!enabled) {
      console.error('!enabled')
      return;
    }

    if (domen === window.location.host)
    {
      chrome.runtime.sendMessage({ action: 'new', derivedTabId });
      bootstrap();
    }
  });
}

chrome.runtime.onMessage.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (sender.id !== chrome.runtime.id) {
      console.error('Oops!');
      return;
    }
    
    console.info({ message, sender });

    switch (message.action) {
      case 'request': {
        chrome.storage.local.get(['poiskovik'], ({poiskovik}) => {
          window.location.href = `${poiskovik}${message.payload}`;
        });
        break;
      }
    }
    
    sendResponse({ ok: true });
    return true;
  }
);