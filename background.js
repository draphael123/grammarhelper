// Background Service Worker for GrammarGuard

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      autoCorrect: false,
      checkSpelling: true,
      checkGrammar: true,
      checkStyle: true
    });

    // Initialize statistics
    chrome.storage.local.set({
      totalCorrections: 0,
      totalWords: 0,
      errorTypes: {
        spelling: 0,
        grammar: 0,
        style: 0
      }
    });

    // Open welcome page
    chrome.tabs.create({
      url: 'website/index.html'
    });
  }
});

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkGrammar',
    title: 'Check with GrammarGuard',
    contexts: ['editable']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkGrammar') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'checkSelection',
      text: info.selectionText
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    updateStatistics(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'getSettings') {
    chrome.storage.sync.get(['enabled', 'autoCorrect', 'checkSpelling', 'checkGrammar', 'checkStyle'], (result) => {
      sendResponse(result);
    });
    return true; // Will respond asynchronously
  }
});

// Update statistics
function updateStatistics(data) {
  chrome.storage.local.get(['totalCorrections', 'totalWords', 'errorTypes'], (result) => {
    const stats = {
      totalCorrections: (result.totalCorrections || 0) + (data.corrections || 0),
      totalWords: (result.totalWords || 0) + (data.words || 0),
      errorTypes: {
        spelling: (result.errorTypes?.spelling || 0) + (data.errorTypes?.spelling || 0),
        grammar: (result.errorTypes?.grammar || 0) + (data.errorTypes?.grammar || 0),
        style: (result.errorTypes?.style || 0) + (data.errorTypes?.style || 0)
      }
    };
    
    chrome.storage.local.set(stats);
  });
}

// Badge to show active status
chrome.storage.sync.get(['enabled'], (result) => {
  const enabled = result.enabled !== undefined ? result.enabled : true;
  updateBadge(enabled);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#27ae60' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

