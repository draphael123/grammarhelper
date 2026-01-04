// GrammarGuard Achievements Page
console.log('🏆 Achievements page loaded');

let gamification;
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing achievements page...');
  
  // Initialize gamification system
  gamification = new GamificationSystem();
  await gamification.init();
  
  // Load and display achievements
  loadAchievements();
  updateStats();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('✅ Achievements page initialized');
});

// === LOAD ACHIEVEMENTS ===
function loadAchievements(filter = 'all') {
  const grid = document.getElementById('achievementsGrid');
  const allAchievements = gamification.getAchievementDefinitions();
  const unlockedIds = gamification.data.unlockedAchievements;
  
  // Get current progress for each achievement
  const achievementsWithProgress = allAchievements.map(achievement => {
    const unlocked = unlockedIds.includes(achievement.id);
    const progress = getAchievementProgress(achievement);
    
    return {
      ...achievement,
      unlocked,
      progress: progress.current,
      progressMax: progress.max,
      progressPercent: progress.percent
    };
  });
  
  // Filter achievements
  let filteredAchievements = achievementsWithProgress;
  
  if (filter === 'unlocked') {
    filteredAchievements = achievementsWithProgress.filter(a => a.unlocked);
  } else if (filter === 'locked') {
    filteredAchievements = achievementsWithProgress.filter(a => !a.unlocked);
  } else if (filter !== 'all') {
    filteredAchievements = achievementsWithProgress.filter(a => a.type === filter);
  }
  
  // Sort: unlocked first, then by requirement
  filteredAchievements.sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return a.requirement - b.requirement;
  });
  
  // Display achievements
  if (filteredAchievements.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No achievements found for this filter</div>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredAchievements.map(achievement => 
    createAchievementCard(achievement)
  ).join('');
}

// === CREATE ACHIEVEMENT CARD ===
function createAchievementCard(achievement) {
  const lockedClass = achievement.unlocked ? 'unlocked' : 'locked';
  const description = getAchievementDescription(achievement);
  const requirementText = getRequirementText(achievement);
  
  let progressHTML = '';
  if (!achievement.unlocked && achievement.progressMax > 0) {
    progressHTML = `
      <div class="achievement-progress">
        <div class="progress-text">${achievement.progress} / ${achievement.progressMax}</div>
        <div class="mini-progress-bar">
          <div class="mini-progress-fill" style="width: ${achievement.progressPercent}%"></div>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="achievement-card ${lockedClass}">
      ${achievement.unlocked ? '<div class="unlock-badge">Unlocked</div>' : ''}
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-description">${description}</div>
      <div class="achievement-requirement">${requirementText}</div>
      ${progressHTML}
      <div class="achievement-xp">⭐ ${achievement.xp} XP</div>
    </div>
  `;
}

// === GET ACHIEVEMENT PROGRESS ===
function getAchievementProgress(achievement) {
  const data = gamification.data;
  let current = 0;
  let max = achievement.requirement;
  
  switch (achievement.type) {
    case 'words':
      current = data.totalWords;
      break;
    case 'streak':
      current = data.currentStreak;
      break;
    case 'corrections':
      current = data.totalCorrections;
      break;
    case 'accuracy':
      current = data.accuracyToday;
      break;
    case 'level':
      current = data.level;
      break;
    case 'dailyGoal':
      current = data.dailyGoalProgress >= 100 ? 1 : 0;
      max = 1;
      break;
    case 'sessions':
      current = data.sessionsToday;
      break;
    default:
      current = 0;
  }
  
  const percent = Math.min(100, Math.floor((current / max) * 100));
  
  return {
    current: Math.min(current, max),
    max,
    percent
  };
}

// === GET ACHIEVEMENT DESCRIPTION ===
function getAchievementDescription(achievement) {
  const descriptions = {
    // Words
    'first_100': 'Write your first 100 words',
    'first_1k': 'Write 1,000 words total',
    'first_10k': 'Write 10,000 words total',
    'first_50k': 'Write 50,000 words total',
    'first_100k': 'Write 100,000 words total',
    
    // Streaks
    'streak_3': 'Write for 3 consecutive days',
    'streak_7': 'Maintain a 7-day writing streak',
    'streak_30': 'Write for 30 days in a row',
    'streak_100': 'Achieve a 100-day streak',
    
    // Corrections
    'corrections_10': 'Accept 10 grammar corrections',
    'corrections_100': 'Accept 100 corrections',
    'corrections_1000': 'Accept 1,000 corrections',
    
    // Accuracy
    'accuracy_95': 'Achieve 95% accuracy in a session',
    'accuracy_99': 'Achieve 99% accuracy in a session',
    'accuracy_100': 'Write with perfect accuracy',
    
    // Level
    'level_5': 'Reach Level 5',
    'level_10': 'Reach Level 10',
    'level_25': 'Reach Level 25',
    'level_50': 'Reach Level 50',
    
    // Special
    'daily_goal': 'Complete your daily word goal',
    'first_session': 'Complete your first writing session',
  };
  
  return descriptions[achievement.id] || 'Unlock this achievement!';
}

// === GET REQUIREMENT TEXT ===
function getRequirementText(achievement) {
  const typeLabels = {
    'words': 'words',
    'streak': 'days',
    'corrections': 'corrections',
    'accuracy': '% accuracy',
    'level': 'level',
    'dailyGoal': 'daily goal',
    'sessions': 'session'
  };
  
  const label = typeLabels[achievement.type] || '';
  return `${achievement.requirement} ${label}`;
}

// === UPDATE STATS ===
function updateStats() {
  const allAchievements = gamification.getAchievementDefinitions();
  const unlocked = gamification.data.unlockedAchievements.length;
  const total = allAchievements.length;
  const percent = Math.floor((unlocked / total) * 100);
  
  document.getElementById('unlockedCount').textContent = unlocked;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('completionPercent').textContent = percent + '%';
  document.getElementById('progressFill').style.width = percent + '%';
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  // Filter tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get filter value and reload achievements
      const filter = tab.dataset.filter;
      currentFilter = filter;
      loadAchievements(filter);
    });
  });
  
  // Back button
  document.getElementById('backBtn').addEventListener('click', () => {
    window.close();
  });
}

// === AUTO-REFRESH ===
// Refresh achievements every 5 seconds to show progress
setInterval(() => {
  loadAchievements(currentFilter);
  updateStats();
}, 5000);

// === LISTEN FOR UPDATES ===
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'achievementUnlocked' || request.action === 'statsUpdated') {
    loadAchievements(currentFilter);
    updateStats();
  }
});

console.log('✅ Achievements page ready!');

