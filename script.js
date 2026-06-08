/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PORTFOLIO INITIALIZATION & INTERACTION SYSTEM
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Handles all dynamic portfolio interactions including:
 * - Page load animations and transitions
 * - Custom cursor behavior with interactive morphing
 * - Parallax orb animations on mouse movement
 * - Scroll-triggered reveal animations
 * - Tab switching for experience section
 * - Skill bar animations on viewport entry
 * - 3D card tilt effects
 * - Navigation state management
 */

/**
 * PAGE LOADER — Initial Site Load Animation
 * Displays animated loader orbs for 1.2 seconds on page load
 */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1200);
});


/**
 * CUSTOM CURSOR SYSTEM — Interactive Morphing Pill Effect
 * 
 * Renders a smooth custom cursor that:
 * - Follows the mouse pointer with pixel precision
 * - Creates a trailing effect behind the main cursor
 * - Morphs into a pill shape when hovering over interactive elements
 * - Updates color and size based on element interaction
 */
const cursorElement = document.getElementById('cur');
const cursorTrailElement = document.getElementById('curT');

let mouseX = 0, mouseY = 0;      // Current mouse position
let trailX = 0, trailY = 0;      // Lagged trail position

// Update main cursor position in real-time
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorElement.style.left = mouseX + 'px';
  cursorElement.style.top = mouseY + 'px';
});

// Create laggy trail effect using RAF for smooth performance
(function animateTrail() {
  trailX += (mouseX - trailX) * 0.18;
  trailY += (mouseY - trailY) * 0.18;
  cursorTrailElement.style.left = trailX + 'px';
  cursorTrailElement.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();

// Transform cursor to pill shape on interactive elements
document.querySelectorAll('a, button, .pill, .pj-tg, .edp-pill').forEach((element) => {
  element.addEventListener('mouseenter', () => cursorElement.classList.add('pill'));
  element.addEventListener('mouseleave', () => cursorElement.classList.remove('pill'));
});


/**
 * PARALLAX EFFECT — Dynamic Orb Movement
 * 
 * Creates depth perception by moving background orbs based on mouse position.
 * Each orb has a different speed multiplier to create layered parallax depth.
 * Only active orbs in visible sections are animated for performance optimization.
 */
document.addEventListener('mousemove', (event) => {
  const normalizedX = (event.clientX / window.innerWidth) - 0.5;
  const normalizedY = (event.clientY / window.innerHeight) - 0.5;

  document.querySelectorAll('.orb').forEach((orb, index) => {
    const parallaxSpeed = ((index % 5) + 1) * 6;
    const parentSection = orb.closest('section');
    const sectionBounds = parentSection?.getBoundingClientRect();

    // Only animate if orb is visible in viewport
    if (sectionBounds && sectionBounds.top < window.innerHeight && sectionBounds.bottom > 0) {
      orb.style.transform = `translate(${normalizedX * parallaxSpeed}px, ${normalizedY * parallaxSpeed}px)`;
    }
  });
});


/**
 * SCROLL REVEAL SYSTEM — Progressive Content Animation
 * 
 * Uses Intersection Observer API to trigger staggered entrance animations
 * when elements enter the viewport. Creates smooth sequential reveals with
 * configurable delay increments for smooth cascading effects.
 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation with increasing delay for each element
      setTimeout(() => {
        entry.target.classList.add('vis');
      }, index * 80);
    }
  });
}, { threshold: 0.08 });

// Observe all elements with reveal animation classes
document.querySelectorAll('.rev, .rev-l, .rev-r, .rev-s').forEach((element) => {
  revealObserver.observe(element);
});


/**
 * SKILL BAR ANIMATION — Viewport-Triggered Progress Reveal
 * 
 * Animates skill proficiency bars from 0% to their target width when
 * the skills section enters the viewport. Uses data-w attribute to
 * store target width percentage for each skill.
 */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Trigger width animation for all skill bars in this section
      entry.target.querySelectorAll('.sk-f').forEach((skillBar) => {
        const targetWidth = skillBar.dataset.w;
        skillBar.style.width = '0';
        setTimeout(() => {
          skillBar.style.width = targetWidth;
        }, 400);
      });
      // Remove observer after first trigger to avoid re-animation
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Observe skills section
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  skillObserver.observe(skillsSection);
}


/**
 * 3D CARD TILT EFFECT — Mouse Position Tracking
 * 
 * Creates perspective-based tilt on hero and project cards based on mouse position.
 * Calculates rotation angles relative to card center for depth perception effect.
 * Disabled on mouse leave to restore flat state smoothly.
 */
document.querySelectorAll('.tilt3d').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const cardBounds = card.getBoundingClientRect();
    const centerX = (event.clientX - cardBounds.left) / cardBounds.width - 0.5;
    const centerY = (event.clientY - cardBounds.top) / cardBounds.height - 0.5;
    
    card.style.transform = `perspective(600px) rotateX(${-centerY * 12}deg) rotateY(${centerX * 12}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/**
 * MAGNETIC BUTTON EFFECT — Cursor Attraction
 * 
 * Buttons subtly move towards the cursor position creating a "magnetic"
 * attraction effect. Scales up slightly for enhanced interaction feedback.
 * Effect resets on mouse leave for smooth return animation.
 */
document.querySelectorAll('.btn-dark, .btn-soft, .btn-orange, .n-cta, .soc').forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    const buttonBounds = button.getBoundingClientRect();
    const buttonCenterX = buttonBounds.left + buttonBounds.width / 2;
    const buttonCenterY = buttonBounds.top + buttonBounds.height / 2;
    
    const offsetX = event.clientX - buttonCenterX;
    const offsetY = event.clientY - buttonCenterY;
    
    button.style.transform = `translate(${offsetX * 0.25}px, ${offsetY * 0.25}px) scale(1.06)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});


/**
 * NAVIGATION STATE MANAGEMENT — Scroll-Based Styling
 * 
 * Updates navigation bar appearance based on scroll position.
 * Increases background opacity and shadow when user scrolls down
 * to improve readability and visual hierarchy as page scrolls.
 */
window.addEventListener('scroll', () => {
  const navigationBar = document.getElementById('nav');
  const hasScrolled = window.scrollY > 60;

  navigationBar.style.background = hasScrolled
    ? 'rgba(240, 232, 222, 0.96)'
    : 'rgba(240, 232, 222, 0.82)';
    
  navigationBar.style.boxShadow = hasScrolled
    ? '0 4px 24px rgba(180, 140, 110, 0.16)'
    : '0 2px 20px rgba(180, 140, 110, 0.1)';
});


/**
 * EXPERIENCE SECTION DATA & MANAGEMENT
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Manages professional experience entries with dynamic tab switching system.
 * Each experience entry contains role details, description, achievements,
 * and technology stack used. Tab switching triggers smooth transitions with
 * staggered list item animations.
 */

/**
 * Experience entries data structure
 * @type {Array<Object>}
 * 
 * Each entry contains:
 * - co: Company/Role title
 * - role: Role description/type
 * - per: Time period
 * - desc: Detailed experience description
 * - items: Array of key achievements/responsibilities
 * - pills: Technology stack and tools used
 */
const experienceData = [
  {
    co:    'Web Developer',
    role:  '// Frontend & Full Stack',
    per:   '📅 2023 – 2026 · Completed',
    desc:  'Engineered and deployed production-grade web applications with expertise in full-stack development. Specialized in crafting responsive, high-performance interfaces using modern web technologies. Demonstrated proficiency in converting complex requirements into scalable solutions with optimized code architecture, delivering exceptional user experiences and measurable business impact.',
    items: [
      'Built Auraa — fully responsive e-commerce website deployed on Netlify',
      'Designed and developed Coffee Website with modern dark theme and smooth animations (3⭐ on GitHub)',
      'Created Restaurant Web — open-source project with clean UI/UX for frontend practice',
      'Mastered HTML5, CSS3, JavaScript, React, jQuery with responsive mobile-first design'
    ],
    pills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'jQuery', 'Netlify']
  },
  {
    co:    'Ethical Hacking',
    role:  '// Cybersecurity & Penetration Testing',
    per:   '📅 2026 – Present · Active',
    desc:  'Started my cybersecurity journey focused on identifying vulnerabilities, web application security, and ethical hacking practices. Learning to think like an attacker to better secure systems.',
    items: [
      'Studying OWASP Top 10 vulnerabilities — SQL Injection, XSS, CSRF, and more',
      'Learning penetration testing tools — Burp Suite, OWASP ZAP, and network scanners',
      'Building Python scripts for security automation and vulnerability assessment',
      'Mastering Linux security, network protocols (TCP/IP, DNS), and encryption fundamentals'
    ],
    pills: ['Cybersecurity', 'Ethical Hacking', 'Burp Suite', 'Python', 'Linux', 'OWASP']
  }
];

/**
 * Switch active experience tab and update details panel
 * 
 * @param {number} tabIndex - Index of experience tab to activate (0 or 1)
 * 
 * Performs smooth transition with:
 * 1. Updates active state on tab buttons
 * 2. Fades out current content with scale animation
 * 3. Reconstructs HTML from experience data
 * 4. Applies staggered animations to list items
 * 5. Fades in new content with upward animation
 */
function selectExperienceTab(tabIndex) {
  // Update active tab styling
  document.querySelectorAll('.exp-tab').forEach((tab, index) => {
    tab.classList.toggle('active', index === tabIndex);
  });

  const experienceData_Item = experienceData[tabIndex];
  const detailsPanel = document.getElementById('epanel');

  // Fade out with scale animation
  detailsPanel.style.opacity = '0';
  detailsPanel.style.transform = 'translateY(14px) scale(0.97)';

  setTimeout(() => {
    // Build HTML from experience data
    const itemsHTML = experienceData_Item.items
      .map((item) => `<li>${item}</li>`)
      .join('');

    const pillsHTML = experienceData_Item.pills
      .map((pill) => `<span class="edp-pill">${pill}</span>`)
      .join('');

    // Update panel content
    detailsPanel.innerHTML = `
      <div class="edp-co">${experienceData_Item.co}</div>
      <div class="edp-role">${experienceData_Item.role}</div>
      <div class="edp-per">${experienceData_Item.per}</div>
      <p class="edp-desc">${experienceData_Item.desc}</p>
      <ul class="edp-ul">${itemsHTML}</ul>
      <div class="edp-pills">${pillsHTML}</div>
    `;

    // Stagger animations for list items
    detailsPanel.querySelectorAll('.edp-ul li').forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });

    // Fade in with upward animation
    detailsPanel.style.opacity = '1';
    detailsPanel.style.transform = 'translateY(0) scale(1)';
  }, 250);
}

// Initialize panel transition and show first tab on load
document.getElementById('epanel').style.transition = 'all 0.4s cubic-bezier(.23,1,.32,1)';


/**
 * STATISTICS COUNTER ANIMATION — Scroll-Triggered Number Reveal
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Animates numeric statistics from 0 to target value when stats section
 * becomes visible. Creates engaging visual feedback for portfolio metrics.
 */

/**
 * Animates a numeric counter from 0 to target value
 * 
 * @param {HTMLElement} element - DOM element to update
 * @param {number} targetValue - Final numeric value to reach
 * @param {string} [suffix=''] - Text appended to number (e.g., '+', '%')
 * 
 * Uses stepped increments with calculated timing to smoothly
 * transition from 0 to target over 1800ms duration
 */
function animateCounterValue(element, targetValue, suffix = '') {
  let currentValue = 0;
  const animationDuration = 1800;
  const timePerStep = animationDuration / targetValue;

  const counterInterval = setInterval(() => {
    currentValue++;
    element.textContent = currentValue + suffix;
    
    if (currentValue >= targetValue) {
      clearInterval(counterInterval);
    }
  }, timePerStep);
}

// Observe stats section and trigger animations on viewport entry
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.hsv').forEach((statsValue) => {
        const textContent = statsValue.textContent;
        
        if (textContent.includes('+')) {
          animateCounterValue(statsValue, parseInt(textContent), '+');
        } else if (textContent.includes('%')) {
          animateCounterValue(statsValue, parseInt(textContent), '%');
        }
      });
      
      // Unsubscribe after first trigger
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

// Start observing stats section if it exists
const statsContainer = document.querySelector('.hc-stats');
if (statsContainer) {
  statsObserver.observe(statsContainer);
}
