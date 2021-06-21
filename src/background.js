const _SELF = {};

chrome.management.getSelf(function (self) {
  _SELF['id'] = self.id;
});

chrome.action.onClicked.addListener(() => {
    const link = "options/options.html";
    chrome.tabs.query(
      { windowId: chrome.windows.WINDOW_ID_CURRENT },
      function (tabs) {
        // 需要tabs权限
        let isOpened = false;
        let tabId;
        let reg = new RegExp(
          "^chrome-extension://" + _SELF['id'] + "/" + link + "$",
          "i"
        );
        for (let i = 0, len = tabs.length; i < len; i++) {
          if (reg.test(tabs[i].url)) {
            isOpened = true;
            tabId = tabs[i].id;
            break;
          }
        }
        if (isOpened) {
          chrome.tabs.update(tabId, { highlighted: true });
        } else {
          chrome.tabs.create({
            url: link,
            active: true,
          });
        }
      }
    );
  });
  