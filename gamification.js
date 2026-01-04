// GrammarGuard Gamification System
console.log('🎮 Gamification module loaded');

class GamificationSystem {
  constructor() {
    this.data = {
      // User Progress
      level: 1,
      xp: 0,
      totalWords: 0,
      totalErrors: 0,
      totalCorrections: 0,
      
      // Streaks
      currentStreak: 0,
      longestStreak: 0,
      lastUsedDate: null,
      
      // Stats
      sessionsToday: 0,
      wordsToday: 0,
      errorsToday: 0,
      accuracyToday: 100,
      timeWritingToday: 0,
      
      // Achievements
      unlockedAchievements: [],
      
      // Goals
      dailyWordGoal: 500,
      dailyGoalProgress: 0,
      
      // Preferences
      theme: 'light',
      soundEnabled: true,
      mascot: 'quill',
      
      // Records
      bestAccuracy: 0,
      longestSession: 0,
      mostWordsInDay: 0
    };
    
    this.init();
  }
  
  async init() {
    await this.loadData();
    this.checkStreak();
    this.checkDailyReset();
  }
  
  async loadData() {
    return new Promise((resolve) => {
      chrome.storage.local.get('gamificationData', (result) => {
        if (result.gamificationData) {
          this.data = { ...this.data, ...result.gamificationData };
        }
        console.log('🎮 Gamification data loaded:', this.data);
        resolve();
      });
    });
  }
  
  async saveData() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ gamificationData: this.data }, () => {
        console.log('💾 Gamification data saved');
        resolve();
      });
    });
  }
  
  // === STREAK SYSTEM ===
  checkStreak() {
    const today = new Date().toDateString();
    const lastUsed = this.data.lastUsedDate;
    
    if (!lastUsed) {
      // First time user
      this.data.currentStreak = 1;
      this.data.lastUsedDate = today;
      this.saveData();
      return;
    }
    
    const lastDate = new Date(lastUsed);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, do nothing
      return;
    } else if (diffDays === 1) {
      // Consecutive day - increase streak!
      this.data.currentStreak++;
      if (this.data.currentStreak > this.data.longestStreak) {
        this.data.longestStreak = this.data.currentStreak;
      }
      this.data.lastUsedDate = today;
      this.saveData();
      this.showStreakNotification();
    } else {
      // Streak broken 😢
      if (this.data.currentStreak >= 3) {
        this.showStreakBrokenNotification(this.data.currentStreak);
      }
      this.data.currentStreak = 1;
      this.data.lastUsedDate = today;
      this.saveData();
    }
  }
  
  showStreakNotification() {
    const streak = this.data.currentStreak;
    let message = `🔥 ${streak} day streak!`;
    
    if (streak === 7) message = "🎉 Week Warrior! 7 days in a row!";
    if (streak === 30) message = "🏆 Monthly Master! 30 days!";
    if (streak === 100) message = "👑 Century Champion! 100 days!";
    
    this.showNotification(message, 'success');
  }
  
  showStreakBrokenNotification(oldStreak) {
    this.showNotification(`💔 ${oldStreak}-day streak ended. Start fresh!`, 'warning');
  }
  
  // === LEVEL SYSTEM ===
  addXP(amount, reason) {
    this.data.xp += amount;
    
    const oldLevel = this.data.level;
    const newLevel = this.calculateLevel(this.data.xp);
    
    if (newLevel > oldLevel) {
      this.levelUp(newLevel);
    }
    
    this.saveData();
    console.log(`⭐ +${amount} XP (${reason})`);
  }
  
  calculateLevel(xp) {
    // Level formula: 1000 XP per level initially, increasing
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }
  
  getXPForNextLevel() {
    const nextLevel = this.data.level + 1;
    return Math.pow(nextLevel - 1, 2) * 100;
  }
  
  getXPProgress() {
    const currentLevelXP = Math.pow(this.data.level - 1, 2) * 100;
    const nextLevelXP = this.getXPForNextLevel();
    const progressXP = this.data.xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: progressXP,
      needed: neededXP,
      percentage: Math.floor((progressXP / neededXP) * 100)
    };
  }
  
  getLevelTitle(level) {
    const titles = {
      1: "Beginner Writer",
      5: "Apprentice Author",
      10: "Skilled Scribe",
      15: "Talented Writer",
      20: "Expert Wordsmith",
      25: "Master Author",
      30: "Grand Master",
      40: "Writing Legend",
      50: "Legendary Linguist"
    };
    
    for (let l = level; l >= 1; l--) {
      if (titles[l]) return titles[l];
    }
    return "Beginner Writer";
  }
  
  levelUp(newLevel) {
    this.data.level = newLevel;
    this.showLevelUpNotification(newLevel);
    this.checkAchievements('level', newLevel);
    
    // Play sound
    if (this.data.soundEnabled) {
      this.playSound('levelup');
    }
  }
  
  showLevelUpNotification(level) {
    const title = this.getLevelTitle(level);
    this.showNotification(`🎉 LEVEL UP! You're now Level ${level}: ${title}`, 'success', 5000);
    this.showConfetti();
  }
  
  // === STATS TRACKING ===
  recordWritingSession(stats) {
    // stats: { words, errors, timeSpent, accuracy }
    
    this.data.totalWords += stats.words;
    this.data.totalErrors += stats.errors;
    this.data.wordsToday += stats.words;
    this.data.errorsToday += stats.errors;
    this.data.sessionsToday++;
    this.data.timeWritingToday += stats.timeSpent || 0;
    
    // Calculate accuracy
    if (stats.words > 0) {
      this.data.accuracyToday = Math.round(((stats.words - stats.errors) / stats.words) * 100);
      
      if (this.data.accuracyToday > this.data.bestAccuracy) {
        this.data.bestAccuracy = this.data.accuracyToday;
      }
    }
    
    // Update records
    if (stats.words > this.data.mostWordsInDay) {
      this.data.mostWordsInDay = stats.words;
    }
    
    // Update daily goal
    this.data.dailyGoalProgress = Math.min(100, Math.floor((this.data.wordsToday / this.data.dailyWordGoal) * 100));
    
    // Award XP
    const xpEarned = Math.floor(stats.words / 10); // 1 XP per 10 words
    const bonusXP = stats.errors === 0 ? 50 : 0; // Bonus for perfect writing
    this.addXP(xpEarned + bonusXP, 'writing session');
    
    // Check achievements
    this.checkAchievements('words', this.data.totalWords);
    this.checkAchievements('accuracy', this.data.accuracyToday);
    this.checkAchievements('corrections', this.data.totalCorrections);
    
    if (this.data.dailyGoalProgress >= 100) {
      this.checkAchievements('dailyGoal', 1);
    }
    
    this.saveData();
  }
  
  recordCorrection() {
    this.data.totalCorrections++;
    this.addXP(5, 'error correction');
    this.checkAchievements('corrections', this.data.totalCorrections);
    this.saveData();
  }
  
  checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = this.data.lastResetDate;
    
    if (lastReset !== today) {
      // Reset daily stats
      this.data.wordsToday = 0;
      this.data.errorsToday = 0;
      this.data.sessionsToday = 0;
      this.data.timeWritingToday = 0;
      this.data.dailyGoalProgress = 0;
      this.data.lastResetDate = today;
      this.saveData();
    }
  }
  
  // === ACHIEVEMENT SYSTEM ===
  checkAchievements(type, value) {
    const achievements = this.getAchievementDefinitions();
    
    achievements.forEach(achievement => {
      if (achievement.type === type && 
          value >= achievement.requirement && 
          !this.data.unlockedAchievements.includes(achievement.id)) {
        this.unlockAchievement(achievement);
      }
    });
  }
  
  unlockAchievement(achievement) {
    this.data.unlockedAchievements.push(achievement.id);
    this.addXP(achievement.xp, `achievement: ${achievement.name}`);
    this.showAchievementNotification(achievement);
    this.saveData();
    
    if (this.data.soundEnabled) {
      this.playSound('achievement');
    }
  }
  
  showAchievementNotification(achievement) {
    this.showNotification(
      `🏆 Achievement Unlocked!\n${achievement.icon} ${achievement.name}\n+${achievement.xp} XP`,
      'achievement',
      5000
    );
  }
  
  getAchievementDefinitions() {
    return [
      // Word Count Achievements
      { id: 'first_100', name: 'First Steps', icon: '👶', type: 'words', requirement: 100, xp: 50 },
      { id: 'first_1k', name: 'First Draft', icon: '📝', type: 'words', requirement: 1000, xp: 100 },
      { id: 'first_10k', name: 'Prolific Writer', icon: '📚', type: 'words', requirement: 10000, xp: 500 },
      { id: 'first_50k', name: 'Novelist', icon: '📖', type: 'words', requirement: 50000, xp: 1000 },
      { id: 'first_100k', name: 'Writing Machine', icon: '🚀', type: 'words', requirement: 100000, xp: 2000 },
      
      // Streak Achievements
      { id: 'streak_3', name: 'Habit Former', icon: '🔥', type: 'streak', requirement: 3, xp: 50 },
      { id: 'streak_7', name: 'Week Warrior', icon: '⚔️', type: 'streak', requirement: 7, xp: 150 },
      { id: 'streak_30', name: 'Monthly Master', icon: '📅', type: 'streak', requirement: 30, xp: 500 },
      { id: 'streak_100', name: 'Century Champion', icon: '💯', type: 'streak', requirement: 100, xp: 2000 },
      
      // Correction Achievements
      { id: 'corrections_10', name: 'Learning Curve', icon: '📈', type: 'corrections', requirement: 10, xp: 50 },
      { id: 'corrections_100', name: 'Perfectionist', icon: '✨', type: 'corrections', requirement: 100, xp: 200 },
      { id: 'corrections_1000', name: 'Grammar Guru', icon: '🎓', type: 'corrections', requirement: 1000, xp: 1000 },
      
      // Accuracy Achievements
      { id: 'accuracy_95', name: 'Accuracy Ace', icon: '🎯', type: 'accuracy', requirement: 95, xp: 200 },
      { id: 'accuracy_99', name: 'Near Perfect', icon: '💎', type: 'accuracy', requirement: 99, xp: 500 },
      { id: 'accuracy_100', name: 'Flawless', icon: '👑', type: 'accuracy', requirement: 100, xp: 1000 },
      
      // Level Achievements
      { id: 'level_5', name: 'Apprentice', icon: '🔰', type: 'level', requirement: 5, xp: 100 },
      { id: 'level_10', name: 'Skilled', icon: '⚡', type: 'level', requirement: 10, xp: 300 },
      { id: 'level_25', name: 'Master', icon: '🏆', type: 'level', requirement: 25, xp: 1000 },
      { id: 'level_50', name: 'Legend', icon: '👑', type: 'level', requirement: 50, xp: 5000 },
      
      // Special Achievements
      { id: 'daily_goal', name: 'Goal Crusher', icon: '💪', type: 'dailyGoal', requirement: 1, xp: 100 },
      { id: 'first_session', name: 'Welcome!', icon: '👋', type: 'sessions', requirement: 1, xp: 25 },
    ];
  }
  
  getUnlockedAchievements() {
    const allAchievements = this.getAchievementDefinitions();
    return allAchievements.filter(a => this.data.unlockedAchievements.includes(a.id));
  }
  
  getLockedAchievements() {
    const allAchievements = this.getAchievementDefinitions();
    return allAchievements.filter(a => !this.data.unlockedAchievements.includes(a.id));
  }
  
  // === NOTIFICATION SYSTEM ===
  showNotification(message, type = 'info', duration = 3000) {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      message: message,
      type: type,
      duration: duration
    });
  }
  
  showConfetti() {
    chrome.runtime.sendMessage({ action: 'showConfetti' });
  }
  
  playSound(soundName) {
    chrome.runtime.sendMessage({ action: 'playSound', sound: soundName });
  }
  
  // === ENCOURAGING MESSAGES ===
  getEncouragingMessage() {
    const messages = {
      welcome: [
        "Ready to write something amazing? ✨",
        "Let's make your words shine! 🌟",
        "Your writing buddy is here! 📝"
      ],
      goodAccuracy: [
        "Wow! Excellent writing! 🎉",
        "You're crushing it today! 💪",
        "That's some impressive accuracy! 🎯",
        "Keep up the great work! ⭐"
      ],
      milestone: [
        "You're on fire! 🔥",
        "Amazing progress! 📈",
        "You're getting better every day! 🚀",
        "What a milestone! 🏆"
      ],
      streak: [
        `${this.data.currentStreak} days strong! 🔥`,
        "Don't break the chain! 💪",
        "Consistency is key! ⭐",
        "You're building a habit! 🎯"
      ],
      goalProgress: [
        `${this.data.dailyGoalProgress}% towards your goal! 🎯`,
        "Almost there! Keep going! 💪",
        "You've got this! 🌟",
        "So close to your goal! 🏁"
      ]
    };
    
    // Choose appropriate message based on context
    if (this.data.currentStreak >= 3) {
      return this.randomFrom(messages.streak);
    }
    
    if (this.data.dailyGoalProgress >= 80) {
      return this.randomFrom(messages.goalProgress);
    }
    
    if (this.data.accuracyToday >= 95) {
      return this.randomFrom(messages.goodAccuracy);
    }
    
    return this.randomFrom(messages.welcome);
  }
  
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // === DAILY TIP ===
  getDailyTip() {
    const tips = [
      {
        title: "Use Active Voice",
        wrong: "The ball was thrown by John.",
        right: "John threw the ball.",
        explanation: "Active voice makes your writing clearer and more direct."
      },
      {
        title: "Avoid Redundancy",
        wrong: "Free gift",
        right: "Gift",
        explanation: "All gifts are free, so 'free' is redundant."
      },
      {
        title: "Its vs It's",
        wrong: "The dog wagged it's tail.",
        right: "The dog wagged its tail.",
        explanation: "It's = it is. Its = possession."
      },
      {
        title: "Filipino: Ng vs Nang",
        wrong: "Gusto ko nang libro",
        right: "Gusto ko ng libro",
        explanation: "Use 'ng' for possession/need, 'nang' for manner/time."
      },
      {
        title: "Eliminate Filler Words",
        wrong: "I think that maybe we should...",
        right: "We should...",
        explanation: "Cut unnecessary words for stronger writing."
      }
    ];
    
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return tips[dayOfYear % tips.length];
  }
  
  // === DATA ACCESS ===
  getData() {
    return this.data;
  }
  
  getStats() {
    return {
      level: this.data.level,
      levelTitle: this.getLevelTitle(this.data.level),
      xp: this.data.xp,
      xpProgress: this.getXPProgress(),
      currentStreak: this.data.currentStreak,
      longestStreak: this.data.longestStreak,
      totalWords: this.data.totalWords,
      totalCorrections: this.data.totalCorrections,
      wordsToday: this.data.wordsToday,
      errorsToday: this.data.errorsToday,
      accuracyToday: this.data.accuracyToday,
      dailyGoalProgress: this.data.dailyGoalProgress,
      achievements: this.getUnlockedAchievements().length,
      timeWritingToday: this.data.timeWritingToday
    };
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.GamificationSystem = GamificationSystem;
}

// Export for Chrome extension
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('✅ Gamification system ready');
}

