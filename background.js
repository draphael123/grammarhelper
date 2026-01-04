// Background Service Worker for GrammarGuard v2.0

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      autoCheck: true,
      showBadge: true,
      soundEffects: false,
      checkDelay: 500,
      language: 'en', // Default to English
      checkSpelling: true,
      checkGrammar: true,
      checkStyle: true,
      checkPunctuation: true,
      checkCapitalization: true,
      checkSpacing: true,
      showCritical: true,
      showMedium: true,
      showMinor: true,
      theme: 'auto',
      yellowHighlight: true,
      showUnderlines: true,
      animations: true,
      highlightOpacity: 25,
      fontSize: 'medium',
      excludePasswords: true,
      excludeCode: true,
      excludeSearch: false,
      enableGoals: false,
      dailyWordGoal: 500,
      errorGoal: 50,
      streakTracking: true
    });

    // Initialize statistics
    chrome.storage.local.set({
      totalWords: 0,
      totalErrors: 0,
      totalCorrections: 0,
      errorTypes: {
        spelling: 0,
        grammar: 0,
        style: 0,
        punctuation: 0,
        capitalization: 0,
        spacing: 0
      },
      commonMistakes: {},
      currentStreak: 0,
      lastUsedDate: null,
      todayWords: 0,
      todayErrors: 0,
      customDictionary: [],
      excludedDomains: []
    });

    // Open welcome page
    chrome.tabs.create({
      url: 'https://grammarguard.vercel.app'
    });
  } else if (details.reason === 'update') {
    // Migration for existing users
    migrateSettings();
  }
});

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkGrammar',
    title: 'Check with GrammarGuard',
    contexts: ['editable', 'selection']
  });
  
  chrome.contextMenus.create({
    id: 'addToDictionary',
    title: 'Add "%s" to Dictionary',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'separator1',
    type: 'separator',
    contexts: ['editable']
  });
  
  chrome.contextMenus.create({
    id: 'toggleExtension',
    title: 'Toggle GrammarGuard',
    contexts: ['editable']
  });
  
  chrome.contextMenus.create({
    id: 'openOptions',
    title: 'Settings',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkGrammar') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'checkSelection',
      text: info.selectionText
    });
  } else if (info.menuItemId === 'addToDictionary') {
    const word = info.selectionText.trim().toLowerCase();
    addToDictionary(word);
  } else if (info.menuItemId === 'toggleExtension') {
    toggleExtension();
  } else if (info.menuItemId === 'openOptions') {
    chrome.runtime.openOptionsPage();
  }
});

// Add to dictionary function
function addToDictionary(word) {
  chrome.storage.local.get(['customDictionary'], (data) => {
    const dictionary = data.customDictionary || [];
    if (!dictionary.includes(word)) {
      dictionary.push(word);
      chrome.storage.local.set({ customDictionary: dictionary }, () => {
        showNotification('Word Added', `"${word}" added to dictionary`);
      });
    }
  });
}

// Toggle extension function
function toggleExtension() {
  chrome.storage.sync.get(['enabled'], (data) => {
    const newState = !data.enabled;
    chrome.storage.sync.set({ enabled: newState }, () => {
      updateBadge(newState);
      showNotification('GrammarGuard', newState ? 'Enabled' : 'Disabled');
    });
  });
}

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
  chrome.storage.sync.get(['showBadge'], (settings) => {
    if (enabled && settings.showBadge !== false) {
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

// Keyboard commands
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-extension') {
    toggleExtension();
  } else if (command === 'show-errors') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showAllErrors' });
      }
    });
  }
});

// Notifications
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message,
    priority: 1
  });
}

// Migration function for existing users
function migrateSettings() {
  chrome.storage.sync.get(null, (settings) => {
    const defaults = {
      autoCheck: true,
      showBadge: true,
      checkDelay: 500,
      checkPunctuation: true,
      checkCapitalization: true,
      checkSpacing: true,
      showCritical: true,
      showMedium: true,
      showMinor: true,
      theme: 'auto',
      yellowHighlight: true,
      showUnderlines: true,
      animations: true,
      highlightOpacity: 25,
      fontSize: 'medium',
      excludePasswords: true,
      excludeCode: true,
      streakTracking: true
    };
    
    // Only add missing settings
    const updates = {};
    for (const [key, value] of Object.entries(defaults)) {
      if (settings[key] === undefined) {
        updates[key] = value;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.sync.set(updates);
    }
  });
  
  // Initialize new storage items if missing
  chrome.storage.local.get(null, (data) => {
    const updates = {};
    
    if (!data.currentStreak) updates.currentStreak = 0;
    if (!data.customDictionary) updates.customDictionary = [];
    if (!data.excludedDomains) updates.excludedDomains = [];
    if (!data.commonMistakes) updates.commonMistakes = {};
    if (!data.lastUsedDate) updates.lastUsedDate = null;
    if (!data.todayWords) updates.todayWords = 0;
    if (!data.todayErrors) updates.todayErrors = 0;
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
}

// Daily streak tracking
function updateStreak() {
  chrome.storage.local.get(['lastUsedDate', 'currentStreak'], (data) => {
    const today = new Date().toDateString();
    const lastUsed = data.lastUsedDate;
    
    if (lastUsed !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastUsed === yesterday) {
        // Continue streak
        chrome.storage.local.set({
          currentStreak: (data.currentStreak || 0) + 1,
          lastUsedDate: today
        });
      } else {
        // Reset streak
        chrome.storage.local.set({
          currentStreak: 1,
          lastUsedDate: today,
          todayWords: 0,
          todayErrors: 0
        });
      }
    }
  });
}

// Update streak on message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logUsage') {
    updateStreak();
  }
});

// Check and update streak daily
chrome.alarms.create('dailyCheck', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyCheck') {
    updateStreak();
  }
});

