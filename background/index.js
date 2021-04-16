var bgInstance = (function () {
  const _self = {}
  function init() {
    chrome.management.getSelf(function (self) {
      _self['id'] = self.id
    })
  }
  function showInformation() {
    console.table(_self)
  }

  function openLinkInTab(link) {
    chrome.tabs.create({ url: link })
  }

  function openExtPages(file) {
    chrome.tabs.query(
      { windowId: chrome.windows.WINDOW_ID_CURRENT },
      function (tabs) {
        // 需要tabs权限
        let isOpened = false
        let tabId
        let reg = new RegExp(
          '^chrome-extension://' + _self.id + '/pages/' + file + '/index.html$',
          'i'
        )
        for (let i = 0, len = tabs.length; i < len; i++) {
          if (reg.test(tabs[i].url)) {
            isOpened = true
            tabId = tabs[i].id
            break
          }
        }
        if (isOpened) {
          chrome.tabs.update(tabId, { highlighted: true })
        } else {
          chrome.tabs.create({
            url: `pages/${file}/index.html`,
            active: true,
          })
        }
      }
    )
  }

  return {
    init,
    showInformation,
    openLinkInTab,
    openExtPages,
  }
})()

bgInstance.init()
