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

  console.log('GrammarGuard website loaded successfully! ✓');
  console.log('🚀 Ready for downloads!');
});

