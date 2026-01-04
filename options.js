// GrammarGuard Options Page

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadDictionary();
  loadExclusions();
  loadAnalytics();
  setupTabNavigation();
  setupEventListeners();
  applyTheme();
});

// Tab Navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Update buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Load Settings
function loadSettings() {
  chrome.storage.sync.get(null, (settings) => {
    // General
    document.getElementById('extensionEnabled').checked = settings.enabled !== false;
    document.getElementById('autoCheck').checked = settings.autoCheck !== false;
    document.getElementById('showBadge').checked = settings.showBadge !== false;
    document.getElementById('soundEffects').checked = settings.soundEffects || false;
    document.getElementById('checkDelay').value = settings.checkDelay || 500;
    document.getElementById('checkDelayValue').textContent = settings.checkDelay || 500;
    
    // Checking
    document.getElementById('checkSpelling').checked = settings.checkSpelling !== false;
    document.getElementById('checkGrammar').checked = settings.checkGrammar !== false;
    document.getElementById('checkStyle').checked = settings.checkStyle !== false;
    document.getElementById('checkPunctuation').checked = settings.checkPunctuation !== false;
    document.getElementById('checkCapitalization').checked = settings.checkCapitalization !== false;
    document.getElementById('checkSpacing').checked = settings.checkSpacing !== false;
    
    // Error Severity
    document.getElementById('showCritical').checked = settings.showCritical !== false;
    document.getElementById('showMedium').checked = settings.showMedium !== false;
    document.getElementById('showMinor').checked = settings.showMinor !== false;
    
    // Appearance
    document.getElementById('theme').value = settings.theme || 'auto';
    document.getElementById('yellowHighlight').checked = settings.yellowHighlight !== false;
    document.getElementById('showUnderlines').checked = settings.showUnderlines !== false;
    document.getElementById('animations').checked = settings.animations !== false;
    document.getElementById('highlightOpacity').value = settings.highlightOpacity || 25;
    document.getElementById('highlightOpacityValue').textContent = (settings.highlightOpacity || 25) + '%';
    document.getElementById('fontSize').value = settings.fontSize || 'medium';
    
    // Exclusions
    document.getElementById('excludePasswords').checked = settings.excludePasswords !== false;
    document.getElementById('excludeCode').checked = settings.excludeCode !== false;
    document.getElementById('excludeSearch').checked = settings.excludeSearch || false;
    
    // Goals
    document.getElementById('enableGoals').checked = settings.enableGoals || false;
    document.getElementById('dailyWordGoal').value = settings.dailyWordGoal || 500;
    document.getElementById('errorGoal').value = settings.errorGoal || 50;
    document.getElementById('streakTracking').checked = settings.streakTracking !== false;
  });
  
  // Load streak data
  chrome.storage.local.get(['currentStreak', 'todayWords', 'todayErrors'], (data) => {
    document.getElementById('currentStreak').textContent = data.currentStreak || 0;
    document.getElementById('todayWords').textContent = data.todayWords || 0;
    document.getElementById('todayErrors').textContent = data.todayErrors || 0;
  });
}

// Save Setting
function saveSetting(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => {
    showToast('Settings saved!');
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // General settings
  document.getElementById('extensionEnabled').addEventListener('change', (e) => {
    saveSetting('enabled', e.target.checked);
  });
  
  document.getElementById('autoCheck').addEventListener('change', (e) => {
    saveSetting('autoCheck', e.target.checked);
  });
  
  document.getElementById('showBadge').addEventListener('change', (e) => {
    saveSetting('showBadge', e.target.checked);
  });
  
  document.getElementById('soundEffects').addEventListener('change', (e) => {
    saveSetting('soundEffects', e.target.checked);
  });
  
  document.getElementById('checkDelay').addEventListener('input', (e) => {
    document.getElementById('checkDelayValue').textContent = e.target.value;
    saveSetting('checkDelay', parseInt(e.target.value));
  });
  
  // Checking settings
  ['checkSpelling', 'checkGrammar', 'checkStyle', 'checkPunctuation', 'checkCapitalization', 'checkSpacing'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      saveSetting(id, e.target.checked);
    });
  });
  
  // Severity
  ['showCritical', 'showMedium', 'showMinor'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      saveSetting(id, e.target.checked);
    });
  });
  
  // Appearance
  document.getElementById('theme').addEventListener('change', (e) => {
    saveSetting('theme', e.target.value);
    applyTheme();
  });
  
  document.getElementById('yellowHighlight').addEventListener('change', (e) => {
    saveSetting('yellowHighlight', e.target.checked);
  });
  
  document.getElementById('showUnderlines').addEventListener('change', (e) => {
    saveSetting('showUnderlines', e.target.checked);
  });
  
  document.getElementById('animations').addEventListener('change', (e) => {
    saveSetting('animations', e.target.checked);
  });
  
  document.getElementById('highlightOpacity').addEventListener('input', (e) => {
    document.getElementById('highlightOpacityValue').textContent = e.target.value + '%';
    saveSetting('highlightOpacity', parseInt(e.target.value));
  });
  
  document.getElementById('fontSize').addEventListener('change', (e) => {
    saveSetting('fontSize', e.target.value);
  });
  
  // Exclusions
  ['excludePasswords', 'excludeCode', 'excludeSearch'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      saveSetting(id, e.target.checked);
    });
  });
  
  // Goals
  document.getElementById('enableGoals').addEventListener('change', (e) => {
    saveSetting('enableGoals', e.target.checked);
  });
  
  document.getElementById('dailyWordGoal').addEventListener('change', (e) => {
    saveSetting('dailyWordGoal', parseInt(e.target.value));
  });
  
  document.getElementById('errorGoal').addEventListener('change', (e) => {
    saveSetting('errorGoal', parseInt(e.target.value));
  });
  
  document.getElementById('streakTracking').addEventListener('change', (e) => {
    saveSetting('streakTracking', e.target.checked);
  });
  
  // Dictionary
  document.getElementById('addWord').addEventListener('click', addWord);
  document.getElementById('newWord').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWord();
  });
  document.getElementById('clearDictionary').addEventListener('click', clearDictionary);
  document.getElementById('exportDictionary').addEventListener('click', exportDictionary);
  document.getElementById('importDictionary').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });
  
  // Exclusions
  document.getElementById('addExclusion').addEventListener('click', addExclusion);
  document.getElementById('newExclusion').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addExclusion();
  });
  
  // Settings import/export
  document.getElementById('exportSettings').addEventListener('click', exportSettings);
  document.getElementById('importSettings').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });
  
  document.getElementById('fileInput').addEventListener('change', handleFileImport);
  
  // Analytics
  document.getElementById('exportAnalytics').addEventListener('click', exportAnalytics);
  document.getElementById('resetAnalytics').addEventListener('click', resetAnalytics);
  
  // Reset
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
}

// Dictionary Functions
function loadDictionary() {
  chrome.storage.local.get(['customDictionary'], (data) => {
    const words = data.customDictionary || [];
    displayWords(words);
  });
}

function displayWords(words) {
  const container = document.getElementById('wordsList');
  container.innerHTML = '';
  
  if (words.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No custom words added yet</p>';
    return;
  }
  
  words.forEach(word => {
    const tag = document.createElement('div');
    tag.className = 'word-tag';
    tag.innerHTML = `
      <span>${word}</span>
      <button onclick="removeWord('${word}')">×</button>
    `;
    container.appendChild(tag);
  });
}

function addWord() {
  const input = document.getElementById('newWord');
  const word = input.value.trim().toLowerCase();
  
  if (!word) return;
  
  chrome.storage.local.get(['customDictionary'], (data) => {
    const words = data.customDictionary || [];
    
    if (words.includes(word)) {
      showToast('Word already in dictionary', 'warning');
      return;
    }
    
    words.push(word);
    chrome.storage.local.set({ customDictionary: words }, () => {
      displayWords(words);
      input.value = '';
      showToast('Word added!');
    });
  });
}

window.removeWord = function(word) {
  chrome.storage.local.get(['customDictionary'], (data) => {
    const words = (data.customDictionary || []).filter(w => w !== word);
    chrome.storage.local.set({ customDictionary: words }, () => {
      displayWords(words);
      showToast('Word removed');
    });
  });
};

function clearDictionary() {
  if (!confirm('Are you sure you want to clear all custom words?')) return;
  
  chrome.storage.local.set({ customDictionary: [] }, () => {
    displayWords([]);
    showToast('Dictionary cleared');
  });
}

function exportDictionary() {
  chrome.storage.local.get(['customDictionary'], (data) => {
    const words = data.customDictionary || [];
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammarguard-dictionary.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dictionary exported!');
  });
}

// Exclusions Functions
function loadExclusions() {
  chrome.storage.local.get(['excludedDomains'], (data) => {
    const domains = data.excludedDomains || [];
    displayExclusions(domains);
  });
}

function displayExclusions(domains) {
  const container = document.getElementById('exclusionsList');
  container.innerHTML = '';
  
  if (domains.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No excluded sites</p>';
    return;
  }
  
  domains.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'exclusion-item';
    item.innerHTML = `
      <span>${domain}</span>
      <button class="btn-danger" onclick="removeExclusion('${domain}')">Remove</button>
    `;
    container.appendChild(item);
  });
}

function addExclusion() {
  const input = document.getElementById('newExclusion');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) return;
  
  chrome.storage.local.get(['excludedDomains'], (data) => {
    const domains = data.excludedDomains || [];
    
    if (domains.includes(domain)) {
      showToast('Domain already excluded', 'warning');
      return;
    }
    
    domains.push(domain);
    chrome.storage.local.set({ excludedDomains: domains }, () => {
      displayExclusions(domains);
      input.value = '';
      showToast('Domain excluded!');
    });
  });
}

window.removeExclusion = function(domain) {
  chrome.storage.local.get(['excludedDomains'], (data) => {
    const domains = (data.excludedDomains || []).filter(d => d !== domain);
    chrome.storage.local.set({ excludedDomains: domains }, () => {
      displayExclusions(domains);
      showToast('Domain removed');
    });
  });
};

// Analytics Functions
function loadAnalytics() {
  chrome.storage.local.get(null, (data) => {
    // Total stats
    document.getElementById('totalWords').textContent = (data.totalWords || 0).toLocaleString();
    document.getElementById('totalErrors').textContent = (data.totalErrors || 0).toLocaleString();
    document.getElementById('totalCorrections').textContent = (data.totalCorrections || 0).toLocaleString();
    
    const accuracy = data.totalWords > 0 
      ? (((data.totalWords - data.totalErrors) / data.totalWords) * 100).toFixed(1)
      : 0;
    document.getElementById('accuracyRate').textContent = accuracy + '%';
    
    // Error breakdown
    const errorTypes = data.errorTypes || { spelling: 0, grammar: 0, style: 0, punctuation: 0 };
    const total = Object.values(errorTypes).reduce((a, b) => a + b, 0) || 1;
    
    document.getElementById('spellingCount').textContent = errorTypes.spelling || 0;
    document.getElementById('grammarCount').textContent = errorTypes.grammar || 0;
    document.getElementById('styleCount').textContent = errorTypes.style || 0;
    document.getElementById('punctuationCount').textContent = errorTypes.punctuation || 0;
    
    document.getElementById('spellingBar').style.width = ((errorTypes.spelling / total) * 100) + '%';
    document.getElementById('grammarBar').style.width = ((errorTypes.grammar / total) * 100) + '%';
    document.getElementById('styleBar').style.width = ((errorTypes.style / total) * 100) + '%';
    document.getElementById('punctuationBar').style.width = ((errorTypes.punctuation / total) * 100) + '%';
    
    // Common mistakes
    const mistakes = data.commonMistakes || {};
    const sorted = Object.entries(mistakes).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    const list = document.getElementById('commonMistakes');
    if (sorted.length > 0) {
      list.innerHTML = sorted.map(([mistake, count]) => 
        `<li>"${mistake}" (${count} times)</li>`
      ).join('');
    } else {
      list.innerHTML = '<li>No data yet</li>';
    }
  });
}

function exportAnalytics() {
  chrome.storage.local.get(null, (data) => {
    const analytics = {
      totalWords: data.totalWords || 0,
      totalErrors: data.totalErrors || 0,
      totalCorrections: data.totalCorrections || 0,
      errorTypes: data.errorTypes || {},
      commonMistakes: data.commonMistakes || {},
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammarguard-analytics.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Analytics exported!');
  });
}

function resetAnalytics() {
  if (!confirm('Are you sure you want to reset all statistics? This cannot be undone.')) return;
  
  chrome.storage.local.set({
    totalWords: 0,
    totalErrors: 0,
    totalCorrections: 0,
    errorTypes: { spelling: 0, grammar: 0, style: 0, punctuation: 0 },
    commonMistakes: {},
    currentStreak: 0,
    todayWords: 0,
    todayErrors: 0
  }, () => {
    loadAnalytics();
    loadSettings();
    showToast('Statistics reset');
  });
}

// Import/Export Functions
function exportSettings() {
  chrome.storage.sync.get(null, (settings) => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammarguard-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Settings exported!');
  });
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (Array.isArray(data)) {
        // Dictionary import
        chrome.storage.local.set({ customDictionary: data }, () => {
          loadDictionary();
          showToast('Dictionary imported!');
        });
      } else {
        // Settings import
        chrome.storage.sync.set(data, () => {
          loadSettings();
          showToast('Settings imported!');
        });
      }
    } catch (error) {
      showToast('Invalid file format', 'error');
    }
  };
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

function resetSettings() {
  if (!confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) return;
  
  chrome.storage.sync.clear(() => {
    loadSettings();
    showToast('Settings reset to default');
  });
}

// Theme
function applyTheme() {
  chrome.storage.sync.get(['theme'], (data) => {
    const theme = data.theme || 'auto';
    
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.body.classList.remove('dark-mode');
    } else {
      // Auto - use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  });
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

