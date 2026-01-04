// Language Detection for GrammarGuard

class LanguageDetector {
  static detectLanguage(text) {
    if (!text || text.length < 20) {
      return 'en'; // Default to English for short text
    }
    
    const cleanText = text.toLowerCase();
    
    // Filipino/Tagalog markers
    const filipinoMarkers = [
      'ang', 'ng', 'mga', 'sa', 'ay', 'ko', 'mo', 'niya',
      'kami', 'tayo', 'kayo', 'sila', 'ka', 'natin', 'nila',
      'din', 'rin', 'daw', 'raw', 'po', 'opo', 'ho', 'oho',
      'ba', 'na', 'pa', 'naman', 'lang', 'lamang',
      'kasi', 'pero', 'at', 'o', 'kung', 'kapag', 'pag',
      'gusto', 'ayaw', 'pwede', 'hindi', 'oo', 'wala', 'may', 'mayroon',
      'saan', 'ano', 'sino', 'kailan', 'paano', 'bakit', 'ilan',
      'nang', 'noon', 'ngayon', 'bukas', 'kahapon',
      'maganda', 'pangit', 'mabuti', 'masama', 'malaki', 'maliit'
    ];
    
    // English markers  
    const englishMarkers = [
      'the', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might',
      'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
      'before', 'after', 'during', 'while', 'until', 'since',
      'although', 'because', 'if', 'unless', 'whether'
    ];
    
    let filipinoScore = 0;
    let englishScore = 0;
    
    // Count markers
    filipinoMarkers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      const matches = cleanText.match(regex);
      if (matches) filipinoScore += matches.length;
    });
    
    englishMarkers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      const matches = cleanText.match(regex);
      if (matches) englishScore += matches.length;
    });
    
    // Determine language
    if (filipinoScore > englishScore * 1.5) {
      return 'fil';
    } else if (englishScore > filipinoScore * 1.5) {
      return 'en';
    } else if (filipinoScore > 0 && englishScore > 0) {
      return 'both'; // Mixed language (Taglish)
    } else {
      return 'en'; // Default to English
    }
  }
  
  static getLanguageForSettings(text, userSetting) {
    if (userSetting === 'auto') {
      return this.detectLanguage(text);
    }
    return userSetting;
  }
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageDetector;
}

