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
    
    // Add a visible test button
    this.addTestButton(element);

    let timeout;
    element.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('⌨️ Input event triggered, checking text...');
        this.checkText(element);
      }, 500);
    });
    
    // Also check on blur
    element.addEventListener('blur', () => {
      console.log('👁️ Blur event triggered, checking text...');
      this.checkText(element);
    });

    // Check initial text if any
    if (element.value || element.textContent) {
      console.log('📝 Element has initial text, checking immediately...');
      setTimeout(() => this.checkText(element), 1000);
    }
  }
  
  addTestButton(element) {
    // Add a floating "Check Grammar" button
    const btn = document.createElement('button');
    btn.textContent = '🔍 Check';
    btn.className = 'grammarguard-test-btn';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    btn.onclick = () => {
      console.log('🖱️ Manual check button clicked!');
      this.checkText(element);
    };
    
    // Remove existing button
    const existing = document.querySelector('.grammarguard-test-btn');
    if (existing) existing.remove();
    
    document.body.appendChild(btn);
    console.log('✅ Added manual check button to page');
  }

  checkText(element) {
    const text = element.value || element.textContent || '';
    
    console.log('🔍 Checking text:', text.substring(0, 100));
    console.log('   Text length:', text.length, 'characters');

    if (!text.trim()) {
      console.log('⚠️ Text is empty, skipping check');
      return;
    }

    const errors = this.findErrors(text);
    console.log(`📊 Found ${errors.length} errors:`, errors);

    if (errors.length > 0) {
      console.log('🎨 Attempting to display errors...');
      this.displayErrors(element, errors);
    } else {
      console.log('✅ No errors found in this text');
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
    console.log('🎨 Displaying', errors.length, 'errors for element:', element);
    
    // Show alert for debugging
    if (errors.length > 0) {
      console.log('⚠️ ERRORS FOUND! Adding visual indicators...');
      
      // Add a very visible border to the element
      element.style.border = '3px solid red';
      element.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
      
      // Create a floating error message
      this.showFloatingMessage(element, `Found ${errors.length} error${errors.length !== 1 ? 's' : ''}!`);
    }
    
    // For contenteditable elements, add inline highlighting
    if (element.isContentEditable) {
      try {
        const text = element.textContent;
        errors.sort((a, b) => b.start - a.start);
        
        let html = text;
        errors.forEach(error => {
          const before = html.substring(0, error.start);
          const errorText = html.substring(error.start, error.end);
          const after = html.substring(error.end);
          html = before + 
            `<span style="background-color: rgba(239, 68, 68, 0.5) !important; border-bottom: 3px solid #ef4444 !important; padding: 3px !important; border-radius: 3px !important; cursor: pointer !important; font-weight: bold !important;" title="${error.message}">${errorText}</span>` + 
            after;
        });
        
        element.innerHTML = html;
        console.log('✅ Applied HTML highlighting to contenteditable');
      } catch (e) {
        console.error('❌ Error applying highlighting:', e);
      }
    } else {
      // For inputs/textareas, add a very visible badge and underline effect
      this.addErrorBadge(element, errors.length);
      element.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      console.log('✅ Applied badge and background to input/textarea');
    }
  }
  
  showFloatingMessage(element, message) {
    const existing = document.querySelector('.grammarguard-float-msg');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'grammarguard-float-msg';
    msg.textContent = message;
    msg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.3s';
      setTimeout(() => msg.remove(), 300);
    }, 3000);
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

