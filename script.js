/**
 * Delhi Public Library - Enhanced GIGW Compliant JavaScript
 * Handles accessibility features, navigation, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initAccessibility();
    initNavigation();
    initSearch();
    initTabs();
    initAnimations();
    initHeaderScroll();
});

/**
 * GIGW: Accessibility Features
 * Font size controls, contrast mode, and skip links
 */
function initAccessibility() {
    // Font size state
    let fontSizeLevel = 0; // -1 = small, 0 = normal, 1 = large
    
    // Load saved preferences
    const savedFontSize = localStorage.getItem('dpl-font-size');
    const savedContrast = localStorage.getItem('dpl-high-contrast');
    
    if (savedFontSize) {
        fontSizeLevel = parseInt(savedFontSize);
        applyFontSize(fontSizeLevel);
    }
    
    if (savedContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
}

// Font size control function (called from HTML onclick)
window.changeFontSize = function(direction) {
    const html = document.documentElement;
    
    // Remove existing classes
    html.classList.remove('font-size-small', 'font-size-large');
    
    if (direction === 1) {
        html.classList.add('font-size-large');
        localStorage.setItem('dpl-font-size', '1');
    } else if (direction === -1) {
        html.classList.add('font-size-small');
        localStorage.setItem('dpl-font-size', '-1');
    } else {
        localStorage.setItem('dpl-font-size', '0');
    }
    
    // Announce change to screen readers
    announceToScreenReader('Font size changed');
};

function applyFontSize(level) {
    const html = document.documentElement;
    html.classList.remove('font-size-small', 'font-size-large');
    
    if (level === 1) {
        html.classList.add('font-size-large');
    } else if (level === -1) {
        html.classList.add('font-size-small');
    }
}

// High contrast toggle (called from HTML onclick)
window.toggleContrast = function() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    localStorage.setItem('dpl-high-contrast', isHighContrast);
    
    // Announce change to screen readers
    announceToScreenReader(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
};

// Screen reader announcement utility
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/**
 * Navigation Functionality
 * Mobile menu, dropdowns, and keyboard navigation
 */
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-close');
    
    if (mobileMenuBtn && mobileMenu) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            
            // Focus first link
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        });
        
        // Close mobile menu
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        mobileMenuBtn.focus();
    }
    
    // Dropdown keyboard navigation
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown');
        
        if (trigger && menu) {
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                    trigger.setAttribute('aria-expanded', !isExpanded);
                }
            });
        }
    });
}

/**
 * Search Overlay
 */
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = searchOverlay?.querySelector('input');
    
    if (searchToggle && searchOverlay) {
        // Open search
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchOverlay.setAttribute('aria-hidden', 'false');
            if (searchInput) searchInput.focus();
            document.body.style.overflow = 'hidden';
        });
        
        // Close search
        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
        
        // Close on backdrop click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }
    
    function closeSearch() {
        searchOverlay.classList.remove('active');
        searchOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        searchToggle.focus();
    }
}

/**
 * Tab Navigation
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                
                // Add active to clicked tab
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                
                // Here you would typically show/hide corresponding content
                // For now, we'll just announce the change
                announceToScreenReader(`${tab.textContent} tab selected`);
            });
            
            // Keyboard navigation
            tab.addEventListener('keydown', (e) => {
                let targetIndex;
                
                if (e.key === 'ArrowRight') {
                    targetIndex = index + 1 >= tabs.length ? 0 : index + 1;
                } else if (e.key === 'ArrowLeft') {
                    targetIndex = index - 1 < 0 ? tabs.length - 1 : index - 1;
                }
                
                if (targetIndex !== undefined) {
                    e.preventDefault();
                    tabs[targetIndex].focus();
                    tabs[targetIndex].click();
                }
            });
        });
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    // Animated counters
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Fade in on scroll
    const fadeElements = document.querySelectorAll('.action-card, .service-card, .news-featured, .sidebar-card');
    
    if (fadeElements.length && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(el);
        });
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number
        if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'K+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
}

/**
 * Hero Slider (Basic implementation)
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    if (slides.length <= 1) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Auto advance
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Initialize slider if exists
if (document.querySelector('.hero-slider')) {
    initSlider();
}

/**
 * Print functionality
 */
window.printPage = function() {
    window.print();
};

/**
 * Add screen reader only class if not present
 */
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);
