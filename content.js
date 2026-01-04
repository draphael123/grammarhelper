// GrammarGuard Content Script
class GrammarGuard {
  constructor() {
    this.activeElement = null;
    this.tooltipContainer = null;
    this.corrections = new Map();
    this.init();
  }

  init() {
    // Listen for input events on text fields
    document.addEventListener('focusin', (e) => this.handleFocusIn(e), true);
    document.addEventListener('input', (e) => this.handleInput(e), true);
    document.addEventListener('focusout', (e) => this.handleFocusOut(e), true);
    
    // Monitor contenteditable elements
    this.observeContentEditable();
  }

  handleFocusIn(e) {
    const element = e.target;
    if (this.isEditableElement(element)) {
      this.activeElement = element;
      this.addGrammarGuardIndicator(element);
      this.checkText(element);
    }
  }

  handleInput(e) {
    const element = e.target;
    if (this.isEditableElement(element)) {
      this.debounce(() => this.checkText(element), 500);
    }
  }

  handleFocusOut(e) {
    // Keep corrections visible even after focus out
  }

  isEditableElement(element) {
    return (
      element.tagName === 'TEXTAREA' ||
      element.tagName === 'INPUT' && ['text', 'email', 'search', 'url'].includes(element.type) ||
      element.isContentEditable
    );
  }

  addGrammarGuardIndicator(element) {
    if (element.dataset.grammarguard) return;
    
    element.dataset.grammarguard = 'true';
    element.style.position = 'relative';
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, wait);
  }

  checkText(element) {
    const text = this.getElementText(element);
    if (!text || text.length < 3) {
      this.clearUnderlines(element);
      return;
    }

    const errors = this.analyzeText(text);
    this.corrections.set(element, errors);
    this.displayUnderlines(element, errors);
  }

  getElementText(element) {
    if (element.isContentEditable) {
      return element.innerText;
    }
    return element.value;
  }

  analyzeText(text) {
    const errors = [];

    // Grammar rules
    const rules = [
      // Common grammar mistakes
      {
        pattern: /\bi\s/gi,
        replacement: 'I ',
        message: 'Capitalize "I"',
        type: 'capitalization'
      },
      {
        pattern: /\b(their|there|they're)\s+are\b/gi,
        test: (match) => match.toLowerCase().startsWith('there'),
        replacement: 'they\'re',
        message: 'Did you mean "they\'re"?',
        type: 'grammar'
      },
      {
        pattern: /\byour\s+(going|coming|doing)/gi,
        replacement: 'you\'re',
        message: 'Did you mean "you\'re" (you are)?',
        type: 'grammar'
      },
      {
        pattern: /\bits\s+(a|the|an|good|bad|great)/gi,
        test: (match) => !match.includes("'"),
        replacement: 'it\'s',
        message: 'Did you mean "it\'s" (it is)?',
        type: 'grammar'
      },
      {
        pattern: /\b(alot)\b/gi,
        replacement: 'a lot',
        message: '"a lot" is two words',
        type: 'spelling'
      },
      {
        pattern: /\b(teh)\b/gi,
        replacement: 'the',
        message: 'Spelling: "the"',
        type: 'spelling'
      },
      {
        pattern: /\b(recieve)\b/gi,
        replacement: 'receive',
        message: 'Spelling: "receive" (i before e except after c)',
        type: 'spelling'
      },
      {
        pattern: /\b(occurence)\b/gi,
        replacement: 'occurrence',
        message: 'Spelling: "occurrence"',
        type: 'spelling'
      },
      {
        pattern: /\b(definately)\b/gi,
        replacement: 'definitely',
        message: 'Spelling: "definitely"',
        type: 'spelling'
      },
      {
        pattern: /\b(seperete|seperate)\b/gi,
        replacement: 'separate',
        message: 'Spelling: "separate"',
        type: 'spelling'
      },
      {
        pattern: /\b(wich)\b/gi,
        replacement: 'which',
        message: 'Spelling: "which"',
        type: 'spelling'
      },
      {
        pattern: /\b(thier)\b/gi,
        replacement: 'their',
        message: 'Spelling: "their"',
        type: 'spelling'
      },
      // Double spaces
      {
        pattern: /\s{2,}/g,
        replacement: ' ',
        message: 'Extra space',
        type: 'spacing'
      },
      // Sentence should start with capital letter
      {
        pattern: /(^|[.!?]\s+)([a-z])/g,
        replacement: (match, p1, p2) => p1 + p2.toUpperCase(),
        message: 'Capitalize first letter of sentence',
        type: 'capitalization'
      },
      // Missing space after punctuation
      {
        pattern: /([.!?,])([A-Z])/g,
        replacement: '$1 $2',
        message: 'Add space after punctuation',
        type: 'spacing'
      },
      // Multiple punctuation
      {
        pattern: /([!?]){2,}/g,
        replacement: '$1',
        message: 'Remove extra punctuation',
        type: 'punctuation'
      }
    ];

    rules.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern);
      const text_copy = text;
      
      while ((match = regex.exec(text_copy)) !== null) {
        // Skip if test function exists and returns false
        if (rule.test && !rule.test(match[0])) {
          continue;
        }

        const start = match.index;
        const end = start + match[0].length;
        const original = match[0];
        const replacement = typeof rule.replacement === 'function' 
          ? rule.replacement(match[0], match[1], match[2])
          : original.replace(new RegExp(rule.pattern, 'i'), rule.replacement);

        errors.push({
          start,
          end,
          original,
          replacement,
          message: rule.message,
          type: rule.type
        });
      }
    });

    // Remove duplicate errors
    const uniqueErrors = errors.filter((error, index, self) =>
      index === self.findIndex(e => e.start === error.start && e.end === error.end)
    );

    return uniqueErrors;
  }

  displayUnderlines(element, errors) {
    this.clearUnderlines(element);

    if (element.isContentEditable) {
      this.displayContentEditableUnderlines(element, errors);
    } else {
      this.displayInputUnderlines(element, errors);
    }
  }

  displayContentEditableUnderlines(element, errors) {
    // For contenteditable, we'll use a simpler approach with CSS
    const text = element.innerText;
    const wrapper = this.getOrCreateWrapper(element);
    
    errors.forEach((error, index) => {
      const span = document.createElement('span');
      span.className = `grammar-guard-error grammar-guard-${error.type}`;
      span.dataset.errorIndex = index;
      span.textContent = error.original;
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showTooltip(error, span, element);
      });
    });
  }

  displayInputUnderlines(element, errors) {
    // Create an overlay for input/textarea elements
    const overlay = this.getOrCreateOverlay(element);
    const rect = element.getBoundingClientRect();
    
    errors.forEach((error, index) => {
      const underline = document.createElement('div');
      underline.className = `grammar-guard-underline grammar-guard-${error.type}`;
      underline.dataset.errorIndex = index;
      
      // Calculate position (simplified - real implementation would need proper text measurement)
      const charWidth = 8; // Approximate
      const left = error.start * charWidth;
      const width = (error.end - error.start) * charWidth;
      
      underline.style.left = left + 'px';
      underline.style.width = width + 'px';
      
      underline.addEventListener('click', () => {
        this.showTooltip(error, underline, element);
      });
      
      overlay.appendChild(underline);
    });
  }

  getOrCreateOverlay(element) {
    let overlay = element.parentElement.querySelector('.grammar-guard-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'grammar-guard-overlay';
      element.parentElement.style.position = 'relative';
      element.parentElement.insertBefore(overlay, element.nextSibling);
    }
    overlay.innerHTML = '';
    return overlay;
  }

  getOrCreateWrapper(element) {
    let wrapper = element.querySelector('.grammar-guard-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'grammar-guard-wrapper';
      element.appendChild(wrapper);
    }
    return wrapper;
  }

  showTooltip(error, anchorElement, textElement) {
    this.hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'grammar-guard-tooltip';
    
    const message = document.createElement('div');
    message.className = 'tooltip-message';
    message.textContent = error.message;
    
    const suggestion = document.createElement('div');
    suggestion.className = 'tooltip-suggestion';
    suggestion.innerHTML = `<strong>Suggestion:</strong> ${error.replacement}`;
    
    const actions = document.createElement('div');
    actions.className = 'tooltip-actions';
    
    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'tooltip-btn accept';
    acceptBtn.textContent = 'Accept';
    acceptBtn.addEventListener('click', () => {
      this.applyCorrection(textElement, error);
      this.hideTooltip();
    });
    
    const ignoreBtn = document.createElement('button');
    ignoreBtn.className = 'tooltip-btn ignore';
    ignoreBtn.textContent = 'Ignore';
    ignoreBtn.addEventListener('click', () => this.hideTooltip());
    
    actions.appendChild(acceptBtn);
    actions.appendChild(ignoreBtn);
    
    tooltip.appendChild(message);
    tooltip.appendChild(suggestion);
    tooltip.appendChild(actions);
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = anchorElement.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.bottom + 5) + 'px';
    tooltip.style.left = rect.left + 'px';
    
    this.tooltipContainer = tooltip;

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', this.hideTooltipHandler = (e) => {
        if (!tooltip.contains(e.target) && e.target !== anchorElement) {
          this.hideTooltip();
        }
      });
    }, 0);
  }

  hideTooltip() {
    if (this.tooltipContainer) {
      this.tooltipContainer.remove();
      this.tooltipContainer = null;
    }
    if (this.hideTooltipHandler) {
      document.removeEventListener('click', this.hideTooltipHandler);
    }
  }

  applyCorrection(element, error) {
    const text = this.getElementText(element);
    const newText = text.substring(0, error.start) + error.replacement + text.substring(error.end);
    
    if (element.isContentEditable) {
      element.innerText = newText;
    } else {
      element.value = newText;
    }
    
    // Re-check text
    this.checkText(element);
  }

  clearUnderlines(element) {
    const overlay = element.parentElement?.querySelector('.grammar-guard-overlay');
    if (overlay) {
      overlay.innerHTML = '';
    }
    
    const wrapper = element.querySelector('.grammar-guard-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
    }
  }

  observeContentEditable() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (this.isEditableElement(node)) {
              this.addGrammarGuardIndicator(node);
            }
            // Check children
            node.querySelectorAll?.('[contenteditable="true"], textarea, input[type="text"]').forEach((el) => {
              this.addGrammarGuardIndicator(el);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize GrammarGuard
const grammarGuard = new GrammarGuard();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    const stats = {
      correctionsFound: grammarGuard.corrections.size,
      enabled: true
    };
    sendResponse(stats);
  }
});

