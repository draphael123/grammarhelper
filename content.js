// GrammarGuard v2.0 - Enhanced Content Script

class GrammarGuardV2 {
  constructor() {
    this.activeElement = null;
    this.tooltipContainer = null;
    this.corrections = new Map();
    this.settings = {};
    this.customDictionary = [];
    this.excludedDomains = [];
    this.ignoredErrors = new Set();
    this.readabilityScore = null;
    
    this.init();
  }

  async init() {
    // Load settings
    await this.loadSettings();
    
    // Check if domain is excluded
    if (this.isDomainExcluded()) {
      console.log('GrammarGuard: Domain excluded');
      return;
    }
    
    // Check if extension is enabled
    if (!this.settings.enabled) {
      console.log('GrammarGuard: Disabled');
      return;
    }
    
    // Setup listeners
    this.setupListeners();
    
    // Log usage for streak tracking
    chrome.runtime.sendMessage({ action: 'logUsage' });
    
    console.log('GrammarGuard v2.0 initialized ✓');
  }

  isDomainExcluded() {
    const hostname = window.location.hostname;
    return this.excludedDomains.some(domain => hostname.includes(domain));
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (syncData) => {
        chrome.storage.local.get(['customDictionary', 'excludedDomains'], (localData) => {
          this.settings = syncData;
          this.customDictionary = localData.customDictionary || [];
          this.excludedDomains = localData.excludedDomains || [];
          resolve();
        });
      });
    });
  }

  setupListeners() {
    // Listen for input events on text fields
    document.addEventListener('focusin', (e) => this.handleFocusIn(e), true);
    document.addEventListener('input', (e) => this.handleInput(e), true);
    document.addEventListener('focusout', (e) => this.handleFocusOut(e), true);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e), true);
    
    // Monitor for dynamically added elements
    this.observeContentEditable();
    
    // Listen for messages from background/popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sendResponse);
      return true;
    });
  }

  handleMessage(request, sendResponse) {
    if (request.action === 'getStats') {
      sendResponse({
        correctionsFound: this.corrections.size,
        enabled: this.settings.enabled
      });
    } else if (request.action === 'showAllErrors') {
      if (this.activeElement) {
        const errors = this.corrections.get(this.activeElement) || [];
        this.showErrorsList(errors, this.activeElement);
      }
    } else if (request.action === 'checkSelection') {
      // Check selected text
      this.checkSelectedText(request.text);
    } else if (request.action === 'toggle') {
      this.settings.enabled = request.enabled;
      if (!request.enabled) {
        this.clearAllErrors();
      }
    }
  }

  handleKeyboard(e) {
    // Alt + Enter: Accept first suggestion
    if (e.altKey && e.key === 'Enter') {
      if (this.activeElement) {
        const errors = this.corrections.get(this.activeElement) || [];
        if (errors.length > 0) {
          e.preventDefault();
          this.applyCorrection(this.activeElement, errors[0]);
        }
      }
    }
    
    // Escape: Dismiss tooltip
    if (e.key === 'Escape') {
      this.hideTooltip();
    }
  }

  handleFocusIn(e) {
    const element = e.target;
    if (this.isEditableElement(element) && !this.shouldExcludeElement(element)) {
      this.activeElement = element;
      this.addGrammarGuardIndicator(element);
      
      if (this.settings.autoCheck !== false) {
        this.checkText(element);
      }
    }
  }

  handleInput(e) {
    const element = e.target;
    if (this.isEditableElement(element) && this.settings.autoCheck !== false) {
      this.debounce(() => this.checkText(element), this.settings.checkDelay || 500);
    }
  }

  handleFocusOut(e) {
    // Keep corrections visible
  }

  shouldExcludeElement(element) {
    // Password fields
    if (this.settings.excludePasswords !== false && element.type === 'password') {
      return true;
    }
    
    // Code editors
    if (this.settings.excludeCode !== false) {
      const codeClasses = ['CodeMirror', 'monaco-editor', 'ace_editor', 'cm-editor'];
      if (codeClasses.some(cls => element.closest(`.${cls}`))) {
        return true;
      }
    }
    
    // Search boxes
    if (this.settings.excludeSearch) {
      if (element.type === 'search' || element.getAttribute('role') === 'searchbox') {
        return true;
      }
    }
    
    return false;
  }

  isEditableElement(element) {
    // Standard editable elements
    if (element.tagName === 'TEXTAREA') return true;
    if (element.tagName === 'INPUT' && ['text', 'email', 'search', 'url'].includes(element.type)) return true;
    if (element.isContentEditable) return true;
    
    // Slack-specific editors
    if (element.classList && (
      element.classList.contains('ql-editor') ||
      element.classList.contains('ql-blank') ||
      element.getAttribute('data-slate-editor') ||
      element.getAttribute('data-lexical-editor') ||
      (element.classList.contains('notranslate') && element.getAttribute('role') === 'textbox')
    )) return true;
    
    // Gmail-specific editors
    if (element.getAttribute('role') === 'textbox' && element.getAttribute('aria-label')) {
      const label = element.getAttribute('aria-label').toLowerCase();
      if (label.includes('message') || label.includes('compose') || label.includes('subject')) {
        return true;
      }
    }
    
    // Google Docs
    if (element.classList && element.classList.contains('kix-lineview-text-block')) return true;
    
    // Contenteditable divs
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

    // Calculate readability if enabled
    if (text.length > 100) {
      this.readabilityScore = this.calculateReadability(text);
    }

    const errors = this.analyzeText(text);
    
    // Filter by custom dictionary
    const filteredErrors = errors.filter(error => {
      const word = error.original.toLowerCase().trim();
      return !this.customDictionary.includes(word) && !this.ignoredErrors.has(`${error.start}-${error.end}`);
    });
    
    // Filter by severity settings
    const finalErrors = filteredErrors.filter(error => {
      const severity = error.severity || 'medium';
      if (severity === 'critical' && this.settings.showCritical === false) return false;
      if (severity === 'medium' && this.settings.showMedium === false) return false;
      if (severity === 'minor' && this.settings.showMinor === false) return false;
      return true;
    });
    
    this.corrections.set(element, finalErrors);
    this.displayUnderlines(element, finalErrors);
    
    // Update analytics
    this.updateAnalytics(text, finalErrors);
  }

  getElementText(element) {
    if (element.isContentEditable) {
      return element.innerText;
    }
    return element.value;
  }

  calculateReadability(text) {
    // Flesch Reading Ease
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const syllables = this.countSyllables(text);
    
    if (words === 0 || sentences === 0) return null;
    
    const avgSyllablesPerWord = syllables / words;
    const avgWordsPerSentence = words / sentences;
    
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    let grade = 'Unknown';
    if (fleschScore >= 90) grade = 'Very Easy (5th grade)';
    else if (fleschScore >= 80) grade = 'Easy (6th grade)';
    else if (fleschScore >= 70) grade = 'Fairly Easy (7th grade)';
    else if (fleschScore >= 60) grade = 'Standard (8th-9th grade)';
    else if (fleschScore >= 50) grade = 'Fairly Difficult (10th-12th grade)';
    else if (fleschScore >= 30) grade = 'Difficult (College)';
    else grade = 'Very Difficult (College graduate)';
    
    return {
      score: Math.max(0, Math.min(100, fleschScore)).toFixed(1),
      grade: grade,
      sentences,
      words,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1)
    };
  }

  countSyllables(text) {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    return words.reduce((total, word) => {
      return total + this.countSyllablesInWord(word);
    }, 0);
  }

  countSyllablesInWord(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  analyzeText(text) {
    // This will be loaded from our existing rules plus new ones with severity
    // For brevity, I'll include a representative sample
    
    const errors = [];
    const rules = this.getEnhancedRules();
    
    rules.forEach(rule => {
      if (rule.type === 'none') return;
      
      // Check if this error type is enabled
      if (rule.category && !this.isErrorTypeEnabled(rule.category)) return;
      
      let match;
      const regex = new RegExp(rule.pattern);
      
      while ((match = regex.exec(text)) !== null) {
        if (rule.test && !rule.test(match[0], text)) {
          continue;
        }

        const start = match.index;
        const end = start + match[0].length;
        const original = match[0];
        const replacement = typeof rule.replacement === 'function' 
          ? rule.replacement(match[0], match[1], match[2])
          : original.replace(new RegExp(rule.pattern, 'i'), rule.replacement);

        if (original.toLowerCase() !== replacement.toLowerCase()) {
          errors.push({
            start,
            end,
            original,
            replacement,
            message: rule.message,
            type: rule.category || 'grammar',
            severity: rule.severity || 'medium',
            explanation: rule.explanation || ''
          });
        }
      }
    });

    // Remove duplicates
    const uniqueErrors = errors.filter((error, index, self) =>
      index === self.findIndex(e => e.start === error.start && e.end === error.end)
    );

    return uniqueErrors;
  }

  isErrorTypeEnabled(category) {
    const mapping = {
      'spelling': 'checkSpelling',
      'grammar': 'checkGrammar',
      'style': 'checkStyle',
      'punctuation': 'checkPunctuation',
      'capitalization': 'checkCapitalization',
      'spacing': 'checkSpacing'
    };
    
    const settingKey = mapping[category];
    return settingKey ? (this.settings[settingKey] !== false) : true;
  }

  getEnhancedRules() {
    // Sample of enhanced rules with severity and explanations
    return [
      {
        pattern: /\bi\s/gi,
        replacement: 'I ',
        message: 'Capitalize "I"',
        category: 'capitalization',
        severity: 'critical',
        explanation: 'The pronoun "I" should always be capitalized in English.'
      },
      {
        pattern: /\btheir\s+are\b/gi,
        replacement: 'There are',
        message: 'Use "There are"',
        category: 'grammar',
        severity: 'critical',
        explanation: '"Their" shows possession. Use "there are" to indicate existence or location.'
      },
      // ... (rest of rules from original content.js, enhanced with severity and explanations)
    ];
  }

  updateAnalytics(text, errors) {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    chrome.storage.local.get(null, (data) => {
      const updates = {
        totalWords: (data.totalWords || 0) + wordCount,
        totalErrors: (data.totalErrors || 0) + errors.length,
        todayWords: (data.todayWords || 0) + wordCount,
        todayErrors: (data.todayErrors || 0) + errors.length,
        errorTypes: data.errorTypes || {},
        commonMistakes: data.commonMistakes || {}
      };
      
      // Count error types
      errors.forEach(error => {
        const type = error.type || 'other';
        updates.errorTypes[type] = (updates.errorTypes[type] || 0) + 1;
        
        // Track common mistakes
        const mistake = error.original.toLowerCase();
        updates.commonMistakes[mistake] = (updates.commonMistakes[mistake] || 0) + 1;
      });
      
      chrome.storage.local.set(updates);
    });
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
    // Enhanced implementation with yellow highlighting
    const text = element.innerText;
    if (!text) return;
    
    // Sort errors
    errors.sort((a, b) => b.start - a.start);
    
    let html = text;
    errors.forEach((error, index) => {
      const before = html.substring(0, error.start);
      const errorText = html.substring(error.start, error.end);
      const after = html.substring(error.end);
      
      const opacity = (this.settings.highlightOpacity || 25) / 100;
      const backgroundColor = this.settings.yellowHighlight !== false 
        ? `rgba(245, 158, 11, ${opacity})` 
        : 'transparent';
      
      const underlineColor = this.getUnderlineColor(error.type);
      const underlineStyle = error.severity === 'critical' ? 'solid' : 'dotted';
      
      html = before + 
        `<span class="grammar-guard-error" data-error-index="${index}" 
              style="background-color: ${backgroundColor}; 
                     border-bottom: 2px ${underlineStyle} ${underlineColor}; 
                     cursor: pointer; padding: 2px 0; border-radius: 2px;"
              title="${error.message}">${errorText}</span>` + 
        after;
    });
    
    element.innerHTML = html;
    
    // Add click listeners
    element.querySelectorAll('.grammar-guard-error').forEach(span => {
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(span.dataset.errorIndex);
        this.showTooltip(errors[index], span, element);
      });
    });
  }

  getUnderlineColor(type) {
    const colors = {
      spelling: '#ef4444',
      grammar: '#f59e0b',
      style: '#3b82f6',
      punctuation: '#8b5cf6',
      capitalization: '#3b82f6',
      spacing: '#9b59b6'
    };
    return colors[type] || '#f59e0b';
  }

  displayInputUnderlines(element, errors) {
    // Show error count badge and store errors
    if (errors.length > 0) {
      element.classList.add('grammar-guard-has-errors');
      this.addErrorIndicator(element, errors.length);
    }
    
    element.dataset.grammarErrors = JSON.stringify(errors);
    
    if (!element.dataset.grammarListener) {
      element.addEventListener('click', () => {
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
    const existing = element.parentElement.querySelector('.grammar-guard-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'grammar-guard-indicator';
    indicator.textContent = errorCount;
    indicator.title = `${errorCount} issue${errorCount > 1 ? 's' : ''} found. Click to view.`;
    indicator.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: linear-gradient(135deg, #f59e0b, #ef4444);
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
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.5);
      animation: pulse 2s infinite;
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
    // Enhanced errors list with severity indicators and explanations
    this.hideTooltip();
    
    const list = document.createElement('div');
    list.className = 'grammar-guard-errors-list';
    list.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      max-height: 500px;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';
    header.innerHTML = `
      <div style="font-weight: 700; font-size: 18px; color: #1e293b;">
        ${errors.length} Issue${errors.length > 1 ? 's' : ''} Found
      </div>
      <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;">×</button>
    `;
    list.appendChild(header);
    
    // Add readability score if available
    if (this.readabilityScore) {
      const scoreCard = document.createElement('div');
      scoreCard.style.cssText = `
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 14px;
      `;
      scoreCard.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">📊 Readability Score</div>
        <div>${this.readabilityScore.grade}</div>
        <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
          ${this.readabilityScore.words} words, ${this.readabilityScore.sentences} sentences
        </div>
      `;
      list.appendChild(scoreCard);
    }
    
    errors.forEach((error, index) => {
      const errorItem = this.createErrorItem(error, index, element);
      list.appendChild(errorItem);
    });
    
    document.body.appendChild(list);
    
    // Position list
    const rect = element.getBoundingClientRect();
    list.style.top = Math.min(rect.bottom + 10, window.innerHeight - list.offsetHeight - 10) + 'px';
    list.style.left = Math.max(10, Math.min(rect.left, window.innerWidth - list.offsetWidth - 10)) + 'px';
    
    list.querySelector('.close-btn').addEventListener('click', () => list.remove());
    
    this.tooltipContainer = list;
  }

  createErrorItem(error, index, element) {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 15px;
      margin-bottom: 12px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid ${this.getUnderlineColor(error.type)};
    `;
    
    const severityEmoji = {
      critical: '🔴',
      medium: '🟠',
      minor: '🟡'
    };
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">
          ${severityEmoji[error.severity]} ${error.type}
        </span>
      </div>
      <div style="font-size: 13px; color: #475569; margin-bottom: 8px;">${error.message}</div>
      <div style="font-size: 14px; margin-bottom: 10px;">
        <span style="text-decoration: line-through; color: #ef4444;">${error.original}</span>
        <span style="margin: 0 8px; color: #64748b;">→</span>
        <strong style="color: #10b981;">${error.replacement}</strong>
      </div>
      ${error.explanation ? `<div style="font-size: 12px; color: #64748b; margin-bottom: 10px; font-style: italic;">${error.explanation}</div>` : ''}
      <div style="display: flex; gap: 8px;">
        <button class="apply-btn" data-index="${index}" style="
          flex: 1; padding: 8px; background: linear-gradient(135deg, #10b981, #059669);
          color: white; border: none; border-radius: 6px; font-size: 13px;
          font-weight: 600; cursor: pointer; transition: transform 0.2s;">
          Apply Fix
        </button>
        <button class="ignore-btn" data-index="${index}" style="
          padding: 8px 12px; background: white; color: #64748b;
          border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px;
          font-weight: 600; cursor: pointer;">
          Ignore
        </button>
      </div>
    `;
    
    item.querySelector('.apply-btn').addEventListener('click', () => {
      this.applyCorrection(element, error);
      item.style.opacity = '0.5';
      item.querySelector('.apply-btn').textContent = '✓ Applied';
      setTimeout(() => {
        if (this.tooltipContainer) this.tooltipContainer.remove();
        this.checkText(element);
      }, 500);
    });
    
    item.querySelector('.ignore-btn').addEventListener('click', () => {
      this.ignoredErrors.add(`${error.start}-${error.end}`);
      item.remove();
      if (this.tooltipContainer && this.tooltipContainer.querySelectorAll('[data-index]').length === 0) {
        this.tooltipContainer.remove();
      }
    });
    
    return item;
  }

  showTooltip(error, anchorElement, textElement) {
    // Similar to showErrorsList but for single error
    this.hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'grammar-guard-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      max-width: 350px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    tooltip.innerHTML = `
      <div style="font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">
        ${error.type}
      </div>
      <div style="color: #1e293b; margin-bottom: 12px; font-weight: 500;">${error.message}</div>
      <div style="padding: 10px; background: #f8fafc; border-radius: 6px; margin-bottom: 12px;">
        <span style="text-decoration: line-through; color: #ef4444;">${error.original}</span>
        <span style="margin: 0 8px;">→</span>
        <strong style="color: #10b981;">${error.replacement}</strong>
      </div>
      ${error.explanation ? `<div style="font-size: 13px; color: #64748b; margin-bottom: 12px; font-style: italic;">${error.explanation}</div>` : ''}
      <div style="display: flex; gap: 8px;">
        <button class="apply-btn" style="
          flex: 1; padding: 10px; background: linear-gradient(135deg, #10b981, #059669);
          color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
          Apply
        </button>
        <button class="ignore-btn" style="
          padding: 10px 15px; background: #f1f5f9; color: #64748b;
          border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
          Ignore
        </button>
      </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position
    const rect = anchorElement.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.left = Math.max(10, Math.min(rect.left, window.innerWidth - tooltip.offsetWidth - 10)) + 'px';
    
    tooltip.querySelector('.apply-btn').addEventListener('click', () => {
      this.applyCorrection(textElement, error);
      this.hideTooltip();
    });
    
    tooltip.querySelector('.ignore-btn').addEventListener('click', () => {
      this.ignoredErrors.add(`${error.start}-${error.end}`);
      this.hideTooltip();
      this.checkText(textElement);
    });
    
    this.tooltipContainer = tooltip;
  }

  hideTooltip() {
    if (this.tooltipContainer) {
      this.tooltipContainer.remove();
      this.tooltipContainer = null;
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
    
    // Update analytics
    chrome.storage.local.get(['totalCorrections'], (data) => {
      chrome.storage.local.set({
        totalCorrections: (data.totalCorrections || 0) + 1
      });
    });
    
    // Re-check
    setTimeout(() => this.checkText(element), 100);
  }

  clearUnderlines(element) {
    const indicator = element.parentElement?.querySelector('.grammar-guard-indicator');
    if (indicator) indicator.remove();
    
    element.classList.remove('grammar-guard-has-errors');
    
    if (element.isContentEditable) {
      // Remove error spans but keep text
      const errors = element.querySelectorAll('.grammar-guard-error');
      errors.forEach(span => {
        const text = span.textContent;
        span.replaceWith(text);
      });
    }
  }

  clearAllErrors() {
    document.querySelectorAll('[data-grammarguard]').forEach(el => {
      this.clearUnderlines(el);
    });
    this.hideTooltip();
  }

  observeContentEditable() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && this.isEditableElement(node)) {
            this.addGrammarGuardIndicator(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkSelectedText(text) {
    // Check specific text and show results
    const errors = this.analyzeText(text);
    alert(`Found ${errors.length} error${errors.length !== 1 ? 's' : ''} in selected text.`);
  }
}

// Initialize
const grammarGuard = new GrammarGuardV2();

