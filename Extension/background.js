chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    fetch("http://localhost:8080/drive", {
      method: "POST",
      body: JSON.stringify({ data: { body: request.message } }),
      headers: {'Content-Type': 'application/json'}
    });
  }catch {
    
  }
});

var tabToUrl = {};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabToUrl[tabId] = tab.url;
});

chrome.tabs.onRemoved.addListener(function (tabId, removed) {
  try {
    if(tabToUrl[tabId].includes("https://drive.google.com/")) {
      fetch("http://localhost:8080/drive", {
        method: "POST",
        body: JSON.stringify({ data: { body: "clear" } }),
        headers: {'Content-Type': 'application/json'}
      })
    }
  }catch {

  }
  delete tabToUrl[tabId];
});