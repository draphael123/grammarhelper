// Popup Script for GrammarGuard

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabledToggle');
  const statusBadge = document.getElementById('statusBadge');
  const correctionsCount = document.getElementById('correctionsCount');
  const wordsChecked = document.getElementById('wordsChecked');
  const spellingCount = document.getElementById('spellingCount');
  const grammarCount = document.getElementById('grammarCount');
  const styleCount = document.getElementById('styleCount');

  // Load saved state
  chrome.storage.sync.get(['enabled'], (result) => {
    const enabled = result.enabled !== undefined ? result.enabled : true;
    enabledToggle.checked = enabled;
    updateStatus(enabled);
  });

  // Toggle functionality
  enabledToggle.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.sync.set({ enabled });
    updateStatus(enabled);
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggle',
          enabled: enabled
        });
      }
    });
  });

  // Update status badge
  function updateStatus(enabled) {
    if (enabled) {
      statusBadge.className = 'status-badge active';
      statusBadge.innerHTML = '<span class="status-dot"></span><span>Active and Checking</span>';
    } else {
      statusBadge.className = 'status-badge inactive';
      statusBadge.innerHTML = '<span class="status-dot"></span><span>Inactive</span>';
    }
  }

  // Get stats from content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getStats' }, (response) => {
        if (response) {
          updateStats(response);
        }
      });
    }
  });

  // Load stored statistics
  chrome.storage.local.get(['totalCorrections', 'totalWords', 'errorTypes'], (result) => {
    const stats = {
      totalCorrections: result.totalCorrections || 0,
      totalWords: result.totalWords || 0,
      errorTypes: result.errorTypes || { spelling: 0, grammar: 0, style: 0 }
    };
    
    correctionsCount.textContent = stats.totalCorrections;
    wordsChecked.textContent = formatNumber(stats.totalWords);
    spellingCount.textContent = stats.errorTypes.spelling;
    grammarCount.textContent = stats.errorTypes.grammar;
    styleCount.textContent = stats.errorTypes.style;
  });

  function updateStats(stats) {
    if (stats.correctionsFound !== undefined) {
      correctionsCount.textContent = stats.correctionsFound;
    }
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Animate stats on load
  animateValue(correctionsCount, 0, parseInt(correctionsCount.textContent) || 0, 1000);
  
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // Footer links
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = e.target.textContent;
      
      if (text === 'Settings') {
        chrome.runtime.openOptionsPage();
      } else if (text === 'Feedback') {
        chrome.tabs.create({ url: 'https://github.com' });
      } else if (text === 'Help') {
        chrome.tabs.create({ url: 'website/index.html' });
      }
    });
  });
});

