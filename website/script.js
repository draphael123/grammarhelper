// Website JavaScript for GrammarGuard

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  const animatedElements = document.querySelectorAll('.feature-card, .benefit-item, .error-type-card, .testimonial-card, .install-step');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
  });

  // Demo error highlighting
  const demoErrors = document.querySelectorAll('.demo-error');
  demoErrors.forEach(error => {
    error.addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#fff3cd';
      this.style.padding = '2px 4px';
      this.style.margin = '0 -4px';
      this.style.borderRadius = '3px';
    });

    error.addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'transparent';
      this.style.padding = '0';
      this.style.margin = '0';
    });
  });

  // Animate stats counter
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format number with K/M suffix
      let displayValue = Math.floor(current);
      if (target >= 1000000) {
        displayValue = (current / 1000000).toFixed(1) + 'M';
      } else if (target >= 1000) {
        displayValue = (current / 1000).toFixed(0) + 'K';
      }
      
      element.textContent = displayValue;
    }, 16);
  };

  // Observe hero stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const value = entry.target.textContent;
        const numValue = value.includes('K') ? parseFloat(value) * 1000 
                       : value.includes('M') ? parseFloat(value) * 1000000
                       : parseFloat(value);
        
        if (!isNaN(numValue)) {
          animateCounter(entry.target, numValue);
          entry.target.dataset.animated = 'true';
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-value').forEach(stat => {
    statsObserver.observe(stat);
  });

  // Download button functionality
  const downloadButtons = document.querySelectorAll('.btn-primary');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.textContent.includes('Download') || btn.textContent.includes('Install')) {
        e.preventDefault();
        
        // Show download instructions
        const modal = createModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
      }
    });
  });

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>Install GrammarGuard</h2>
        <div class="modal-body">
          <p>To install the GrammarGuard extension:</p>
          <ol>
            <li>Download or clone this project folder</li>
            <li>Open Chrome and go to <code>chrome://extensions</code></li>
            <li>Enable "Developer mode" in the top right</li>
            <li>Click "Load unpacked" and select the project folder</li>
            <li>Start writing with confidence!</li>
          </ol>
          <div class="modal-note">
            <strong>Note:</strong> This extension is currently in development. 
            Once published to the Chrome Web Store, you'll be able to install it with one click.
          </div>
        </div>
        <button class="modal-btn">Got it!</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .download-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .download-modal.show {
        opacity: 1;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
      }

      .modal-content {
        position: relative;
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: translateY(-20px);
        transition: transform 0.3s;
      }

      .download-modal.show .modal-content {
        transform: translateY(0);
      }

      .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #999;
        line-height: 1;
        padding: 0;
        width: 32px;
        height: 32px;
      }

      .modal-close:hover {
        color: #333;
      }

      .modal-content h2 {
        margin-bottom: 20px;
        color: #27ae60;
      }

      .modal-body ol {
        margin: 20px 0;
        padding-left: 25px;
      }

      .modal-body li {
        margin: 10px 0;
        line-height: 1.8;
      }

      .modal-body code {
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: monospace;
        color: #667eea;
      }

      .modal-note {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 14px;
        border-left: 4px solid #f39c12;
      }

      .modal-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: transform 0.2s;
      }

      .modal-btn:hover {
        transform: translateY(-2px);
      }
    `;
    modal.appendChild(style);

    // Close functionality
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-btn').addEventListener('click', closeModal);

    return modal;
  }

  // Add parallax effect to hero
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Floating download button visibility
  const floatingDownload = document.getElementById('floatingDownload');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show after scrolling 300px
    if (currentScroll > 300) {
      floatingDownload.style.display = 'block';
      floatingDownload.style.opacity = '1';
    } else {
      floatingDownload.style.opacity = '0';
      setTimeout(() => {
        if (window.pageYOffset <= 300) {
          floatingDownload.style.display = 'none';
        }
      }, 300);
    }
    
    lastScroll = currentScroll;
  });

  // Track download clicks
  const downloadButtons = document.querySelectorAll('a[download], a[href*="github.com"]');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isDownload = btn.hasAttribute('download');
      console.log(isDownload ? '📥 Extension download initiated!' : '🔗 GitHub link clicked!');
      
      // Show thank you message for downloads
      if (isDownload) {
        showDownloadNotification();
      }
    });
  });

  function showDownloadNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <div style="font-size: 16px;">Download Started! 🎉</div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Follow installation guide below</div>
        </div>
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      notification.style.transform = 'translateX(400px)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Initial hide for floating button
  if (floatingDownload) {
    floatingDownload.style.display = 'none';
    floatingDownload.style.transition = 'opacity 0.3s ease';
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Interactive Demo
  const liveEditor = document.getElementById('liveEditor');
  const loadSampleBtn = document.getElementById('loadSample');
  const clearTextBtn = document.getElementById('clearText');
  const toggleErrorsBtn = document.getElementById('toggleErrors');
  const errorsCountEl = document.getElementById('errorsCount');
  const wordsCountEl = document.getElementById('wordsCount');
  let errorsVisible = true;

  const sampleTexts = {
    english: "Their are many benefits to using GrammarGuard for you're writing needs. Its a great tool that helps catch alot of common mistakes. We recieved positive feedback from users who says it makes their writing better.  Weather your a student or professional,GrammarGuard can help you write more good.",
    filipino: "Ang mga mga estudyante ay nag ka roon ng magandang resulta. Gusto ko nang magpunta sa palengke kase kailangan ko rin ng mga pamili. Pag dating namin doon, bibili kami ng mga prutas at gulay. May roon akong kaibigan na mayroon din ng sariling tindahan. Hindi mayroon sila ng sapat na oras para mag linis ng kanilang bahay. Ang pag asa ko ay maging mas mabuti ang lahat."
  };
  
  let currentLanguage = 'english';

  const englishRules = [
    // Common misspellings
    { pattern: /\bteh\b/gi, type: 'spelling', message: 'Use "the"' },
    { pattern: /\bthi\b/gi, type: 'spelling', message: 'Use "this"' },
    { pattern: /\bthsi\b/gi, type: 'spelling', message: 'Use "this"' },
    { pattern: /\bia\b/gi, type: 'spelling', message: 'Use "is" or "a"' },
    { pattern: /\bsiad\b/gi, type: 'spelling', message: 'Use "said"' },
    { pattern: /\bwere\s+is\b/gi, type: 'grammar', message: 'Use "where is"' },
    { pattern: /\btheir\s+are\b/gi, type: 'grammar', message: 'Use "There are"' },
    { pattern: /\byour\s+going\b/gi, type: 'grammar', message: 'Use "you\'re going"' },
    { pattern: /\byou're\s+writing\b/gi, type: 'grammar', message: 'Use "your writing"' },
    { pattern: /\byour\s+welcome\b/gi, type: 'grammar', message: 'Use "you\'re welcome"' },
    { pattern: /\bits\s+a\b/gi, type: 'grammar', message: 'Use "it\'s" (it is)' },
    { pattern: /\balot\b/gi, type: 'spelling', message: 'Use "a lot"' },
    { pattern: /\brecieved\b/gi, type: 'spelling', message: 'Use "received"' },
    { pattern: /\bsays\b(?=\s+(it|that|we|they))/gi, type: 'grammar', message: 'Use "say"' },
    { pattern: /\bweather\b(?=\s+your?)/gi, type: 'spelling', message: 'Use "whether"' },
    { pattern: /\bwich\b/gi, type: 'spelling', message: 'Use "which"' },
    { pattern: /\bthier\b/gi, type: 'spelling', message: 'Use "their"' },
    { pattern: /\bwierd\b/gi, type: 'spelling', message: 'Use "weird"' },
    { pattern: /\bdefinate\b/gi, type: 'spelling', message: 'Use "definite"' },
    { pattern: /\bdefinately\b/gi, type: 'spelling', message: 'Use "definitely"' },
    { pattern: /\bseperate\b/gi, type: 'spelling', message: 'Use "separate"' },
    { pattern: /\boccurence\b/gi, type: 'spelling', message: 'Use "occurrence"' },
    { pattern: /\bshould of\b/gi, type: 'grammar', message: 'Use "should have"' },
    { pattern: /\bcould of\b/gi, type: 'grammar', message: 'Use "could have"' },
    { pattern: /\bwould of\b/gi, type: 'grammar', message: 'Use "would have"' },
    { pattern: /\bto\s+(much|many)\b/gi, type: 'grammar', message: 'Use "too"' },
    { pattern: /,(\w)/g, type: 'spacing', message: 'Add space after comma' },
    { pattern: /\s{2,}/g, type: 'spacing', message: 'Extra space' },
    { pattern: /\bmore\s+good\b/gi, type: 'grammar', message: 'Use "better"' },
    { pattern: /(^|[.!?]\s+)([a-z])/g, type: 'capitalization', message: 'Capitalize first letter' }
  ];
  
  const filipinoRules = [
    // Common Filipino/Tagalog errors
    { pattern: /\bmga\s+mga\b/gi, type: 'grammar', message: 'Dapat "mga" lang (huwag ulit-ulit)' },
    { pattern: /\bng\s+ng\b/gi, type: 'grammar', message: 'Dapat "ng" lang (huwag ulit-ulit)' },
    { pattern: /\bkase\b/gi, type: 'spelling', message: 'Dapat "kasi"' },
    { pattern: /\bnag\s+ka\s+(\w+)/gi, type: 'spelling', message: 'Dapat "nagka" + salita (walang puwang)' },
    { pattern: /\bpinaka\s+(\w+)/gi, type: 'spelling', message: 'Dapat "pinaka" + salita (walang puwang)' },
    { pattern: /\bpag\s+(\w+ing)\b/gi, type: 'spelling', message: 'Dapat "pag" + salita (walang puwang)' },
    { pattern: /\bgusto\s+ko\s+nang\b/gi, type: 'grammar', message: 'Dapat "gusto ko ng" (possession)' },
    { pattern: /\bmayroon\s+ako\b/gi, type: 'grammar', message: 'Dapat "may ako" (use "may" with pronouns)' },
    { pattern: /\bhindi\s+mayroon\b/gi, type: 'style', message: 'Mas maganda: "wala"' },
    { pattern: /\bpag\s+asa\b/gi, type: 'spelling', message: 'Dapat "pag-asa" (may gitling)' },
    { pattern: /\bd\s+rin\b/gi, type: 'grammar', message: 'Dapat "din" pagkatapos ng "d"' },
    { pattern: /\bt\s+rin\b/gi, type: 'grammar', message: 'Dapat "din" pagkatapos ng "t"' },
    { pattern: /\bs\s+rin\b/gi, type: 'grammar', message: 'Dapat "din" pagkatapos ng "s"' },
    { pattern: /\bmag\s+(\w{4,})/gi, type: 'spelling', message: 'Dapat "mag" + salita (walang puwang)' },
    { pattern: /\bpag\s+dating\b/gi, type: 'spelling', message: 'Dapat "pagdating" (walang puwang)' },
    { pattern: /\bpaki\s+usap\b/gi, type: 'spelling', message: 'Dapat "pakiusap" (walang puwang)' },
    { pattern: /\bmay\s+roon\b/gi, type: 'spelling', message: 'Dapat "mayroon" (isang salita)' },
    { pattern: /\s{2,}/g, type: 'spacing', message: 'Sobrang puwang' },
    { pattern: /(^|[.!?]\s+)([a-z])/g, type: 'capitalization', message: 'Dapat malaking letra sa simula' }
  ];

  function checkGrammar(text) {
    const errors = [];
    const rules = currentLanguage === 'filipino' ? filipinoRules : englishRules;
    
    rules.forEach(rule => {
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        errors.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          type: rule.type,
          message: rule.message
        });
      }
      rule.pattern.lastIndex = 0; // Reset regex
    });
    return errors;
  }

  function highlightErrors() {
    if (!liveEditor) return;
    
    const text = liveEditor.textContent || liveEditor.innerText || '';
    
    // Update word count
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordsCountEl) wordsCountEl.textContent = wordCount;
    
    // If text is empty, reset
    if (!text.trim()) {
      if (errorsCountEl) errorsCountEl.textContent = '0';
      if (wordsCountEl) wordsCountEl.textContent = '0';
      return;
    }
    
    const errors = checkGrammar(text);
    
    // Update error count
    if (errorsCountEl) errorsCountEl.textContent = errors.length;
    
    if (!errorsVisible || errors.length === 0) {
      liveEditor.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }

    // Sort errors by position (reverse) to replace from end to start
    errors.sort((a, b) => b.start - a.start);
    
    // Create HTML with highlighted errors
    let html = text;
    errors.forEach(error => {
      const before = html.substring(0, error.start);
      const errorText = html.substring(error.start, error.end);
      const after = html.substring(error.end);
      html = before + `<mark class="error-highlight" title="${error.message}" style="background-color: rgba(245, 158, 11, 0.3); padding: 2px 4px; border-radius: 3px; cursor: help; border-bottom: 2px dotted #f59e0b;">${errorText}</mark>` + after;
    });
    
    liveEditor.innerHTML = html;
  }

  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      liveEditor.textContent = sampleTexts[currentLanguage];
      highlightErrors();
    });
  }
  
  // Language selector
  const languageSelector = document.getElementById('languageSelector');
  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      currentLanguage = e.target.value;
      if (liveEditor.textContent.trim()) {
        highlightErrors();
      }
    });
  }

  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      liveEditor.textContent = '';
      errorsCountEl.textContent = '0';
      wordsCountEl.textContent = '0';
    });
  }

  if (toggleErrorsBtn) {
    toggleErrorsBtn.addEventListener('click', () => {
      errorsVisible = !errorsVisible;
      document.getElementById('toggleText').textContent = errorsVisible ? 'Hide Errors' : 'Show Errors';
      highlightErrors();
    });
  }

  if (liveEditor) {
    let debounceTimer;
    
    // Handle input with debounce
    liveEditor.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        highlightErrors();
      }, 300);
    });
    
    // Also handle paste events
    liveEditor.addEventListener('paste', (e) => {
      setTimeout(() => {
        highlightErrors();
      }, 100);
    });
    
    // Initial check if there's content
    if (liveEditor.textContent) {
      highlightErrors();
    }
  }

  // Fetch GitHub Stars
  async function fetchGitHubStars() {
    try {
      const response = await fetch('https://api.github.com/repos/draphael123/grammarhelper');
      const data = await response.json();
      const stars = data.stargazers_count || 0;
      const starsEl = document.getElementById('githubStars');
      if (starsEl) {
        starsEl.textContent = `★ ${stars}`;
      }
    } catch (error) {
      console.log('Could not fetch GitHub stars');
      const starsEl = document.getElementById('githubStars');
      if (starsEl) {
        starsEl.textContent = '★ Star Us!';
      }
    }
  }

  fetchGitHubStars();

  // Animate Social Proof Numbers
  const proofNumbers = document.querySelectorAll('.proof-number');
  const observerOptions = {
    threshold: 0.5
  };

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseFloat(entry.target.dataset.target);
        animateNumber(entry.target, target);
        entry.target.dataset.animated = 'true';
      }
    });
  }, observerOptions);

  proofNumbers.forEach(num => numberObserver.observe(num));

  function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number
      let displayValue;
      if (target >= 1000) {
        displayValue = (current / 1000).toFixed(1) + 'K';
      } else {
        displayValue = Math.floor(current).toFixed(1);
      }
      
      element.textContent = displayValue;
    }, 16);
  }

  console.log('GrammarGuard website loaded successfully! ✓');
  console.log('🚀 Ready for downloads!');
  console.log('✨ Interactive features enabled!');
});

