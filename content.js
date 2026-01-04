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
    // Check for standard editable elements
    if (element.tagName === 'TEXTAREA') return true;
    if (element.tagName === 'INPUT' && ['text', 'email', 'search', 'url'].includes(element.type)) return true;
    if (element.isContentEditable) return true;
    
    // Check for Slack-specific editors
    if (element.classList && (
      element.classList.contains('ql-editor') || // Slack/Quill editor
      element.classList.contains('ql-blank') ||
      element.getAttribute('data-slate-editor') || // Slack's new editor
      element.getAttribute('data-lexical-editor') || // Lexical editor
      element.classList.contains('notranslate') && element.getAttribute('role') === 'textbox'
    )) return true;
    
    // Check for Gmail-specific editors
    if (element.getAttribute('role') === 'textbox' && element.getAttribute('aria-label')) {
      const label = element.getAttribute('aria-label').toLowerCase();
      if (label.includes('message') || label.includes('compose') || label.includes('subject')) {
        return true;
      }
    }
    
    // Check for Google Docs
    if (element.classList && element.classList.contains('kix-lineview-text-block')) return true;
    
    // Check for contenteditable divs commonly used in modern editors
    if (element.getAttribute('contenteditable') === 'true') return true;
    if (element.getAttribute('contenteditable') === 'plaintext-only') return true;
    
    return false;
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

    // Enhanced Grammar rules
    const rules = [
      // Capitalization
      {
        pattern: /\bi\s/gi,
        replacement: 'I ',
        message: 'Capitalize "I"',
        type: 'capitalization'
      },
      {
        pattern: /(^|[.!?]\s+)([a-z])/g,
        replacement: (match, p1, p2) => p1 + p2.toUpperCase(),
        message: 'Capitalize first letter of sentence',
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
      {
        pattern: /\b(wierd)\b/gi,
        replacement: 'weird',
        message: 'Spelling: "weird"',
        type: 'spelling'
      },
      {
        pattern: /\b(beleive)\b/gi,
        replacement: 'believe',
        message: 'Spelling: "believe"',
        type: 'spelling'
      },
      {
        pattern: /\b(achive|acheive)\b/gi,
        replacement: 'achieve',
        message: 'Spelling: "achieve"',
        type: 'spelling'
      },
      {
        pattern: /\b(neccessary)\b/gi,
        replacement: 'necessary',
        message: 'Spelling: "necessary"',
        type: 'spelling'
      },
      {
        pattern: /\b(occured)\b/gi,
        replacement: 'occurred',
        message: 'Spelling: "occurred"',
        type: 'spelling'
      },
      {
        pattern: /\b(begining)\b/gi,
        replacement: 'beginning',
        message: 'Spelling: "beginning"',
        type: 'spelling'
      },
      {
        pattern: /\b(untill)\b/gi,
        replacement: 'until',
        message: 'Spelling: "until"',
        type: 'spelling'
      },
      {
        pattern: /\b(writting)\b/gi,
        replacement: 'writing',
        message: 'Spelling: "writing"',
        type: 'spelling'
      },
      {
        pattern: /\b(truely)\b/gi,
        replacement: 'truly',
        message: 'Spelling: "truly"',
        type: 'spelling'
      },
      {
        pattern: /\b(greatful)\b/gi,
        replacement: 'grateful',
        message: 'Spelling: "grateful"',
        type: 'spelling'
      },
      {
        pattern: /\b(arguement)\b/gi,
        replacement: 'argument',
        message: 'Spelling: "argument"',
        type: 'spelling'
      },
      {
        pattern: /\b(enviroment)\b/gi,
        replacement: 'environment',
        message: 'Spelling: "environment"',
        type: 'spelling'
      },
      {
        pattern: /\b(recomend)\b/gi,
        replacement: 'recommend',
        message: 'Spelling: "recommend"',
        type: 'spelling'
      },
      {
        pattern: /\b(accomodate)\b/gi,
        replacement: 'accommodate',
        message: 'Spelling: "accommodate"',
        type: 'spelling'
      },
      {
        pattern: /\b(embarass)\b/gi,
        replacement: 'embarrass',
        message: 'Spelling: "embarrass"',
        type: 'spelling'
      },
      {
        pattern: /\b(publically)\b/gi,
        replacement: 'publicly',
        message: 'Spelling: "publicly"',
        type: 'spelling'
      },
      {
        pattern: /\b(concious)\b/gi,
        replacement: 'conscious',
        message: 'Spelling: "conscious"',
        type: 'spelling'
      },
      // Additional grammar rules
      {
        pattern: /\bshould of\b/gi,
        replacement: 'should have',
        message: 'Grammar: "should have" not "should of"',
        type: 'grammar'
      },
      {
        pattern: /\bcould of\b/gi,
        replacement: 'could have',
        message: 'Grammar: "could have" not "could of"',
        type: 'grammar'
      },
      {
        pattern: /\bwould of\b/gi,
        replacement: 'would have',
        message: 'Grammar: "would have" not "would of"',
        type: 'grammar'
      },
      {
        pattern: /\bmight of\b/gi,
        replacement: 'might have',
        message: 'Grammar: "might have" not "might of"',
        type: 'grammar'
      },
      {
        pattern: /\byour\s+(a|an|the)\b/gi,
        replacement: "you're",
        message: 'Did you mean "you\'re" (you are)?',
        type: 'grammar'
      },
      {
        pattern: /\bto\s+(much|many|little|few)\b/gi,
        replacement: 'too',
        message: 'Did you mean "too"?',
        type: 'grammar'
      },
      {
        pattern: /\bthan\s+(I|he|she|they|we)\s+(am|is|are)\b/gi,
        replacement: 'then',
        message: 'Did you mean "then"?',
        type: 'grammar'
      },
      {
        pattern: /\baffect\b/gi,
        test: (match, context) => {
          // Simple heuristic: if preceded by "the" or "an", probably should be "effect"
          const index = context.indexOf(match);
          const before = context.substring(Math.max(0, index - 10), index).toLowerCase();
          return before.includes('the ') || before.includes('an ');
        },
        replacement: 'effect',
        message: 'Did you mean "effect" (noun)?',
        type: 'grammar'
      },
      {
        pattern: /\bmakes\s+sense\b/gi,
        replacement: 'makes sense',
        message: 'Correct!',
        type: 'none'
      },
      // Double spaces
      {
        pattern: /\s{2,}/g,
        replacement: ' ',
        message: 'Extra space',
        type: 'spacing'
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
      // Skip rules marked as 'none'
      if (rule.type === 'none') return;
      
      let match;
      const regex = new RegExp(rule.pattern);
      const text_copy = text;
      
      while ((match = regex.exec(text_copy)) !== null) {
        // Skip if test function exists and returns false
        if (rule.test && !rule.test(match[0], text)) {
          continue;
        }

        const start = match.index;
        const end = start + match[0].length;
        const original = match[0];
        const replacement = typeof rule.replacement === 'function' 
          ? rule.replacement(match[0], match[1], match[2])
          : original.replace(new RegExp(rule.pattern, 'i'), rule.replacement);

        // Only add if replacement is different
        if (original.toLowerCase() !== replacement.toLowerCase()) {
          errors.push({
            start,
            end,
            original,
            replacement,
            message: rule.message,
            type: rule.type
          });
        }
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
    // For input/textarea, we'll use a different approach
    // Add yellow background to the element when errors are present
    if (errors.length > 0) {
      element.classList.add('grammar-guard-has-errors');
      element.style.position = 'relative';
      
      // Show indicator icon
      this.addErrorIndicator(element, errors.length);
    }
    
    // Store errors for tooltip display
    element.dataset.grammarErrors = JSON.stringify(errors);
    
    // Add click listener to show all errors
    if (!element.dataset.grammarListener) {
      element.addEventListener('click', (e) => {
        if (element.dataset.grammarErrors) {
          const storedErrors = JSON.parse(element.dataset.grammarErrors);
          if (storedErrors.length > 0) {
            this.showErrorsList(storedErrors, element);
          }
        }
      });
      element.dataset.grammarListener = 'true';
    }
  }
  
  addErrorIndicator(element, errorCount) {
    // Remove existing indicator
    const existingIndicator = element.parentElement.querySelector('.grammar-guard-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'grammar-guard-indicator';
    indicator.textContent = errorCount;
    indicator.title = `${errorCount} issue${errorCount > 1 ? 's' : ''} found`;
    indicator.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #f59e0b;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    `;
    
    indicator.addEventListener('click', (e) => {
      e.stopPropagation();
      const errors = JSON.parse(element.dataset.grammarErrors || '[]');
      this.showErrorsList(errors, element);
    });
    
    const parent = element.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(indicator);
  }
  
  showErrorsList(errors, element) {
    this.hideTooltip();
    
    const list = document.createElement('div');
    list.className = 'grammar-guard-errors-list';
    list.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 15px;
      max-width: 350px;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      z-index: 999999;
    `;
    
    const title = document.createElement('div');
    title.style.cssText = 'font-weight: 700; margin-bottom: 15px; color: #1e293b; font-size: 16px;';
    title.textContent = `${errors.length} Issue${errors.length > 1 ? 's' : ''} Found`;
    list.appendChild(title);
    
    errors.forEach((error, index) => {
      const errorItem = document.createElement('div');
      errorItem.style.cssText = `
        padding: 12px;
        margin-bottom: 10px;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 3px solid ${error.type === 'spelling' ? '#ef4444' : error.type === 'grammar' ? '#f59e0b' : '#3b82f6'};
      `;
      
      errorItem.innerHTML = `
        <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">${error.message}</div>
        <div style="font-size: 14px; margin-bottom: 6px;">
          <span style="text-decoration: line-through; color: #ef4444;">${error.original}</span>
          <span style="margin: 0 8px;">→</span>
          <strong style="color: #10b981;">${error.replacement}</strong>
        </div>
        <button class="apply-fix-btn" data-index="${index}" style="
          padding: 6px 12px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        ">Apply Fix</button>
      `;
      
      list.appendChild(errorItem);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
      width: 100%;
      padding: 10px;
      background: #e2e8f0;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    `;
    closeBtn.addEventListener('click', () => list.remove());
    list.appendChild(closeBtn);
    
    // Apply fix buttons
    list.querySelectorAll('.apply-fix-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const error = errors[index];
        this.applyCorrection(element, error);
        list.remove();
      });
    });
    
    document.body.appendChild(list);
    
    // Position near element
    const rect = element.getBoundingClientRect();
    list.style.top = (rect.bottom + 10) + 'px';
    list.style.left = Math.max(10, rect.left) + 'px';
    
    this.tooltipContainer = list;
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

