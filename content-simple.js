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
        console.log('⌨️ Input event triggered, checking text...');
        this.checkText(element);
      }, 1000); // Increased to 1 second to avoid disrupting typing
    });
    
    // Also check on blur (when user leaves the field)
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

    // Track writing session
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount > 0) {
      this.trackWritingSession(wordCount, errors.length);
    }

    if (errors.length > 0) {
      console.log('🎨 Attempting to display errors...');
      this.displayErrors(element, errors);
    } else {
      console.log('✅ No errors found in this text');
    }
  }
  
  trackWritingSession(words, errors) {
    // Send stats to gamification system
    chrome.runtime.sendMessage({
      action: 'trackWriting',
      data: {
        words: words,
        errors: errors,
        timeSpent: 1, // minutes (estimate)
        accuracy: errors > 0 ? Math.round(((words - errors) / words) * 100) : 100
      }
    });
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
    
    // Remove old highlights first
    this.clearHighlights(element);
    
    if (errors.length === 0) {
      console.log('✅ No errors to display');
      return;
    }
    
    console.log('⚠️ ERRORS FOUND! Adding visual indicators...');
    
    // For contenteditable elements, use non-intrusive highlighting
    if (element.isContentEditable) {
      this.highlightContentEditableErrors(element, errors);
    } else {
      // For inputs/textareas, create an overlay with highlights
      this.createHighlightOverlay(element, errors);
    }
    
    // Create error tooltip list
    this.createErrorTooltip(element, errors);
  }
  
  clearHighlights(element) {
    // Remove any existing highlights
    element.querySelectorAll('.gg-highlight').forEach(el => el.remove());
    
    // Remove overlay
    const overlay = element.parentElement?.querySelector('.gg-highlight-overlay');
    if (overlay) overlay.remove();
    
    // Remove tooltip
    const tooltip = element.parentElement?.querySelector('.gg-error-tooltip');
    if (tooltip) tooltip.remove();
    
    // Reset styles
    element.style.border = '';
    element.style.boxShadow = '';
    element.style.backgroundColor = '';
  }
  
  highlightContentEditableErrors(element, errors) {
    try {
      // Save current cursor position
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const cursorOffset = range ? range.startOffset : 0;
      const cursorNode = range ? range.startContainer : null;
      
      console.log('📍 Saved cursor position:', cursorOffset, cursorNode);
      
      // Get all text nodes
      const textNodes = this.getTextNodes(element);
      let currentOffset = 0;
      
      // Apply highlights to text nodes without changing structure
      textNodes.forEach(node => {
        const nodeLength = node.textContent.length;
        const nodeStart = currentOffset;
        const nodeEnd = currentOffset + nodeLength;
        
        // Find errors that overlap with this text node
        const nodeErrors = errors.filter(error => 
          error.start < nodeEnd && error.end > nodeStart
        );
        
        if (nodeErrors.length > 0) {
          // Wrap this text node with highlighting
          const wrapper = document.createElement('span');
          wrapper.style.cssText = 'position: relative; display: inline;';
          
          nodeErrors.forEach(error => {
            const highlight = document.createElement('span');
            highlight.className = 'gg-highlight';
            highlight.style.cssText = `
              position: absolute;
              left: ${Math.max(0, error.start - nodeStart)}ch;
              width: ${error.end - error.start}ch;
              bottom: -2px;
              height: 3px;
              background: #ef4444;
              pointer-events: none;
              z-index: 1;
            `;
            wrapper.appendChild(highlight);
          });
          
          node.parentNode.insertBefore(wrapper, node);
          wrapper.appendChild(node);
        }
        
        currentOffset = nodeEnd;
      });
      
      // Restore cursor position
      if (cursorNode && range) {
        try {
          selection.removeAllRanges();
          range.setStart(cursorNode, cursorOffset);
          range.collapse(true);
          selection.addRange(range);
          console.log('✅ Restored cursor position');
        } catch (e) {
          console.log('⚠️ Could not restore cursor:', e);
        }
      }
      
      console.log('✅ Applied non-intrusive highlighting to contenteditable');
    } catch (e) {
      console.error('❌ Error applying highlighting:', e);
    }
  }
  
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    return textNodes;
  }
  
  createHighlightOverlay(element, errors) {
    // For textarea/input, create a visual overlay
    const text = element.value || '';
    
    // Add subtle background color
    element.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
    
    // Add error badge
    this.addErrorBadge(element, errors.length);
    
    console.log('✅ Applied overlay highlighting to input/textarea');
  }
  
  createErrorTooltip(element, errors) {
    const tooltip = document.createElement('div');
    tooltip.className = 'gg-error-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      top: -10px;
      right: 30px;
      background: #ef4444;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      z-index: 10001;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      white-space: nowrap;
      animation: fadeIn 0.3s ease;
    `;
    tooltip.textContent = `${errors.length} error${errors.length !== 1 ? 's' : ''} found`;
    
    // Make parent position relative
    if (element.parentElement) {
      const parent = element.parentElement;
      const position = getComputedStyle(parent).position;
      if (position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(tooltip);
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 0.3s';
      setTimeout(() => tooltip.remove(), 300);
    }, 3000);
  }
  
  addErrorBadge(element, count) {
    // Remove existing badge
    const existing = element.parentElement?.querySelector('.grammarguard-badge');
    if (existing) existing.remove();

    // Create badge with count
    const badge = document.createElement('div');
    badge.className = 'grammarguard-badge';
    badge.textContent = count;
    badge.title = `${count} error${count !== 1 ? 's' : ''} found - Click to review`;

    // Make parent position relative
    if (element.parentElement) {
      const parent = element.parentElement;
      const position = getComputedStyle(parent).position;
      if (position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(badge);
    }
    
    console.log('✅ Added error badge with count:', count);
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

