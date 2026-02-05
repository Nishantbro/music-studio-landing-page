// =============================================
// APEX SOUND STUDIO - JAVASCRIPT
// Mobile navigation, smooth scrolling, and UI interactions
// =============================================

(function() {
    'use strict';
    
    // ===== DOM ELEMENTS =====
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const body = document.body;
    
    // ===== MOBILE NAVIGATION =====
    if (mobileToggle && navMenu) {
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Update ARIA attributes
            const isExpanded = navMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                const isClickInsideNav = navMenu.contains(e.target);
                const isClickOnToggle = mobileToggle.contains(e.target);
                
                if (!isClickInsideNav && !isClickOnToggle) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .highlight-card, .feature-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== CONTACT FORM HANDLING =====
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Log form data (in production, this would be sent to a server)
            console.log('Form submitted with data:', data);
            
            // Show success message
            alert('Thank you for your inquiry! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
        
        // Real-time form validation feedback
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = 'var(--color-primary)';
                } else if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        this.style.borderColor = 'var(--color-primary)';
                    } else {
                        this.style.borderColor = '';
                    }
                } else {
                    this.style.borderColor = '';
                }
            });
        });
    }
    
    // ===== STATS COUNTER ANIMATION =====
    const statsNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });
    
    if (statsNumbers.length > 0) {
        statsObserver.observe(statsNumbers[0].closest('.hero-stats'));
    }
    
    function animateStats() {
        statsNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const numMatch = text.match(/\d+/);
            
            if (numMatch) {
                const targetNum = parseInt(numMatch[0]);
                const duration = 2000;
                const steps = 60;
                const increment = targetNum / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        current = targetNum;
                        clearInterval(timer);
                    }
                    
                    let displayText = Math.floor(current).toString();
                    if (hasPlus) displayText += '+';
                    
                    stat.textContent = displayText;
                }, duration / steps);
            }
        });
    }
    
    // ===== CURSOR EFFECT (Optional - Desktop only) =====
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--color-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease;
            display: none;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .highlight-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'var(--color-secondary)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--color-primary)';
            });
        });
    }
    
    // ===== PERFORMANCE LOGGING =====
    console.log('%c APEX SOUND STUDIO', 'color: #E74C3C; font-size: 24px; font-weight: bold; font-family: Orbitron;');
    console.log('%c Website loaded successfully', 'color: #8E44AD; font-size: 14px;');
    console.log('%c Ready to rock! 🎵', 'color: #3498DB; font-size: 12px;');
    
})();
