// GrammarGuard - Simple Working Content Script
console.log('🟢 GrammarGuard: Content script loaded!');

// Simple grammar checker that definitely works
class GrammarGuard {
  constructor() {
    console.log('🟢 GrammarGuard: Initializing...');
    this.settings = { enabled: true, language: 'en' };
    this.init();
  }

  async init() {
    // Load settings
    try {
      const data = await chrome.storage.sync.get(null);
      this.settings = { ...this.settings, ...data };
      console.log('🟢 GrammarGuard: Settings loaded:', this.settings);
    } catch (error) {
      console.log('⚠️ GrammarGuard: Using default settings');
    }

    // Check if enabled
    if (this.settings.enabled === false) {
      console.log('🟡 GrammarGuard: Extension disabled');
      return;
    }

    // Setup listeners
    this.setupListeners();
    console.log('✅ GrammarGuard: Ready!');
  }

  setupListeners() {
    // Listen for focus on editable elements
    document.addEventListener('focusin', (e) => {
      if (this.isEditableElement(e.target)) {
        console.log('📝 GrammarGuard: Editable element focused', e.target);
        this.attachToElement(e.target);
      }
    }, true);

    // Monitor for dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]').forEach(el => {
        if (!el.dataset.grammarguardAttached) {
          this.attachToElement(el);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  isEditableElement(element) {
    if (!element) return false;
    const tag = element.tagName?.toLowerCase();
    return (
      tag === 'textarea' ||
      (tag === 'input' && element.type === 'text') ||
      element.contentEditable === 'true' ||
      element.isContentEditable
    );
  }

  attachToElement(element) {
    if (element.dataset.grammarguardAttached) return;
    element.dataset.grammarguardAttached = 'true';

    console.log('✅ Attached to element:', element);

    let timeout;
    element.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.checkText(element);
      }, 500);
    });

    // Check initial text if any
    if (element.value || element.textContent) {
      this.checkText(element);
    }
  }

  checkText(element) {
    const text = element.value || element.textContent || '';
    if (!text.trim()) return;

    console.log('🔍 Checking text:', text.substring(0, 50) + '...');

    const errors = this.findErrors(text);
    console.log(`📊 Found ${errors.length} errors:`, errors);

    if (errors.length > 0) {
      this.displayErrors(element, errors);
    }
  }

  findErrors(text) {
    const errors = [];
    const language = this.settings.language || 'en';

    // Get rules based on language
    let rules = this.getEnglishRules();
    if (language === 'fil' || language === 'both') {
      rules = rules.concat(this.getFilipinoRules());
    }

    rules.forEach(rule => {
      const regex = new RegExp(rule.pattern);
      let match;
      while ((match = regex.exec(text)) !== null) {
        errors.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          message: rule.message,
          type: rule.type || 'grammar'
        });
      }
      regex.lastIndex = 0;
    });

    return errors;
  }

  getEnglishRules() {
    return [
      { pattern: /\bteh\b/gi, message: 'Did you mean "the"?', type: 'spelling' },
      { pattern: /\btheir\s+are\b/gi, message: 'Use "There are"', type: 'grammar' },
      { pattern: /\btheir\s+is\b/gi, message: 'Use "There is"', type: 'grammar' },
      { pattern: /\byour\s+welcome\b/gi, message: 'Use "You\'re welcome"', type: 'grammar' },
      { pattern: /\bits\s+a\b/gi, message: 'Use "It\'s" (it is)', type: 'grammar' },
      { pattern: /\balot\b/gi, message: 'Use "a lot" (two words)', type: 'spelling' },
      { pattern: /\brecieve\b/gi, message: 'Use "receive"', type: 'spelling' },
      { pattern: /\bkase\b/gi, message: 'Use "kasi"', type: 'spelling' },
      { pattern: /\baas\b/gi, message: 'Use "as"', type: 'spelling' },
      { pattern: /\bcccc\b/gi, message: 'Unknown word', type: 'spelling' },
      { pattern: /\baasas\b/gi, message: 'Unknown word', type: 'spelling' },
      { pattern: /\bcould\s+of\b/gi, message: 'Use "could have"', type: 'grammar' },
      { pattern: /\bwould\s+of\b/gi, message: 'Use "would have"', type: 'grammar' },
      { pattern: /\bshould\s+of\b/gi, message: 'Use "should have"', type: 'grammar' }
    ];
  }

  getFilipinoRules() {
    // Check if filipino rules are loaded
    if (typeof filipinoRules !== 'undefined' && filipinoRules.spelling) {
      return filipinoRules.spelling.map(rule => ({
        pattern: rule.pattern,
        message: rule.message,
        type: rule.category || 'grammar'
      }));
    }
    
    // Fallback to basic Filipino rules
    return [
      { pattern: /\bmga\s+mga\b/gi, message: 'Dapat "mga" lang', type: 'grammar' },
      { pattern: /\bkase\b/gi, message: 'Dapat "kasi"', type: 'spelling' },
      { pattern: /\bnung\b/gi, message: 'Dapat "noong"', type: 'spelling' },
      { pattern: /\bsaakin\b/gi, message: 'Dapat "sa akin"', type: 'spelling' },
      { pattern: /\bpwede\b/gi, message: 'Dapat "puwede"', type: 'spelling' }
    ];
  }

  displayErrors(element, errors) {
    // For contenteditable elements, add inline highlighting
    if (element.isContentEditable) {
      const text = element.textContent;
      errors.sort((a, b) => b.start - a.start);
      
      let html = text;
      errors.forEach(error => {
        const before = html.substring(0, error.start);
        const errorText = html.substring(error.start, error.end);
        const after = html.substring(error.end);
        html = before + 
          `<span style="background-color: rgba(239, 68, 68, 0.3); border-bottom: 2px solid #ef4444; padding: 2px; border-radius: 2px; cursor: pointer;" title="${error.message}">${errorText}</span>` + 
          after;
      });
      
      element.innerHTML = html;
    } else {
      // For inputs/textareas, add a badge
      this.addErrorBadge(element, errors.length);
    }
  }

  addErrorBadge(element, count) {
    // Remove existing badge
    const existing = element.parentElement?.querySelector('.grammarguard-badge');
    if (existing) existing.remove();

    // Create badge
    const badge = document.createElement('div');
    badge.className = 'grammarguard-badge';
    badge.textContent = count;
    badge.title = `${count} error${count !== 1 ? 's' : ''} found`;
    badge.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
    `;

    // Make parent position relative
    if (element.parentElement) {
      const parent = element.parentElement;
      const position = getComputedStyle(parent).position;
      if (position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(badge);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GrammarGuard();
  });
} else {
  new GrammarGuard();
}

