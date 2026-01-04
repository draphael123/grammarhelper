// GrammarGuard Enhanced Popup
console.log('🎮 Enhanced popup loaded');

let gamification;
let currentTipIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing enhanced popup...');
  
  // Initialize gamification
  gamification = new GamificationSystem();
  await gamification.init();
  
  // Load and display data
  loadStats();
  loadAchievements();
  loadDailyTip();
  loadEncouragingMessage();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check for pending celebrations
  checkPendingCelebrations();
  
  console.log('✅ Popup initialized');
});

// === LOAD DATA ===
function loadStats() {
  const stats = gamification.getStats();
  
  // Streak
  document.getElementById('streakNumber').textContent = stats.currentStreak;
  
  // Level
  document.getElementById('levelNumber').textContent = stats.level;
  document.getElementById('levelTitle').textContent = stats.levelTitle;
  
  // XP Progress
  document.getElementById('xpCurrent').textContent = stats.xpProgress.current;
  document.getElementById('xpNeeded').textContent = stats.xpProgress.needed;
  document.getElementById('xpBarFill').style.width = stats.xpProgress.percentage + '%';
  document.getElementById('xpPercentage').textContent = stats.xpProgress.percentage + '%';
  
  // Daily Goal
  document.getElementById('wordsToday').textContent = stats.wordsToday;
  document.getElementById('goalWords').textContent = gamification.data.dailyWordGoal;
  document.getElementById('goalPercentage').textContent = stats.dailyGoalProgress;
  document.getElementById('goalBarFill').style.width = stats.dailyGoalProgress + '%';
  
  // Today's Stats
  document.getElementById('statWords').textContent = stats.wordsToday;
  document.getElementById('statAccuracy').textContent = stats.accuracyToday + '%';
  document.getElementById('statErrors').textContent = stats.errorsToday;
  document.getElementById('statTime').textContent = formatTime(stats.timeWritingToday);
  
  console.log('📊 Stats loaded:', stats);
}

function loadAchievements() {
  const unlocked = gamification.getUnlockedAchievements();
  const container = document.getElementById('recentAchievements');
  
  if (unlocked.length === 0) {
    container.innerHTML = '<div class="no-achievements">Start writing to unlock achievements!</div>';
    return;
  }
  
  // Show last 3 achievements
  const recent = unlocked.slice(-3).reverse();
  container.innerHTML = recent.map(achievement => `
    <div class="achievement-badge">
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
    </div>
  `).join('');
}

function loadDailyTip() {
  const tip = gamification.getDailyTip();
  document.getElementById('tipTitle').textContent = tip.title;
  document.getElementById('tipWrong').textContent = tip.wrong;
  document.getElementById('tipRight').textContent = tip.right;
}

function loadEncouragingMessage() {
  const message = gamification.getEncouragingMessage();
  document.getElementById('encouragingMessage').textContent = message;
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Achievements button
  document.getElementById('achievementsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'achievements.html' });
  });
  
  // View all achievements
  document.getElementById('viewAchievementsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'achievements.html' });
  });
  
  // Tip next button
  document.getElementById('tipNextBtn').addEventListener('click', () => {
    currentTipIndex++;
    loadDailyTip();
  });
  
  // Goal edit button
  document.getElementById('goalEditBtn').addEventListener('click', () => {
    const newGoal = prompt('Set your daily word goal:', gamification.data.dailyWordGoal);
    if (newGoal && !isNaN(newGoal)) {
      gamification.data.dailyWordGoal = parseInt(newGoal);
      gamification.saveData();
      loadStats();
    }
  });
  
  // Extension toggle
  document.getElementById('extensionToggle').addEventListener('change', (e) => {
    chrome.storage.sync.set({ enabled: e.target.checked });
    chrome.runtime.sendMessage({ 
      action: 'toggle', 
      enabled: e.target.checked 
    });
  });
  
  // Load current toggle state
  chrome.storage.sync.get(['enabled'], (result) => {
    document.getElementById('extensionToggle').checked = result.enabled !== false;
  });
}

// === CELEBRATIONS ===
function checkPendingCelebrations() {
  // Check if there's a celebration to show
  chrome.storage.local.get(['pendingCelebration'], (result) => {
    if (result.pendingCelebration) {
      showCelebration(result.pendingCelebration);
      chrome.storage.local.remove('pendingCelebration');
    }
  });
}

function showCelebration(data) {
  const overlay = document.getElementById('celebrationOverlay');
  const icon = document.getElementById('celebrationIcon');
  const title = document.getElementById('celebrationTitle');
  const message = document.getElementById('celebrationMessage');
  
  icon.textContent = data.icon || '🎉';
  title.textContent = data.title || 'Congratulations!';
  message.textContent = data.message || '';
  
  overlay.classList.remove('hidden');
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 3000);
  
  // Click to dismiss
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });
}

// === UTILITY FUNCTIONS ===
function formatTime(minutes) {
  if (minutes < 60) {
    return minutes + 'm';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// === LISTEN FOR UPDATES ===
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'statsUpdated') {
    loadStats();
    loadAchievements();
  } else if (request.action === 'showCelebration') {
    showCelebration(request.data);
  } else if (request.action === 'achievementUnlocked') {
    showCelebration({
      icon: request.achievement.icon,
      title: 'Achievement Unlocked!',
      message: request.achievement.name
    });
    loadAchievements();
  }
});

// Auto-refresh stats every 10 seconds
setInterval(() => {
  loadStats();
}, 10000);

console.log('✅ Enhanced popup ready!');

