/**
 * AI Review Harvester - Modern 2025 JavaScript
 * Interactive functionality for premium user experience
 */

// ===== DOM UTILITIES =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeLoader();
    initializeNavigation();
    initializeDarkMode();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeCounters();
    initializeBackToTop();
    initializeNewsletterForm();
    initializeSearchSystem();
    initializeAOS();
    initializeImageHandling();
    injectImageStyles();
    initializeImageGallery();
    
    console.log('🤖 AI Review Harvester - Modern 2025 Design Loaded with Image Handling & Professional Gallery');
});

// ===== LOADING SCREEN =====
function initializeLoader() {
    const loader = $('#loading-screen');
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 1500); // Show loader for at least 1.5 seconds for effect
    });
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const navMenu = $('.nav-menu');
    
    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
    }
    
    // Close mobile menu when clicking nav links
    function closeMobileMenu() {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
    
    // Event listeners
    window.addEventListener('scroll', throttle(handleScroll, 100));
    hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            closeMobileMenu();
        }
    });
}

// ===== DARK MODE =====
function initializeDarkMode() {
    const themeToggle = $('#theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Get saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    themeToggle?.addEventListener('click', toggleTheme);
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Handle anchor links
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = $('#navbar')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    $$('.review-card, .category-card, .feature-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== ANIMATED COUNTERS =====
function initializeCounters() {
    const counters = $$('.stat-number[data-count]');
    let hasAnimated = false;
    
    function animateCounters() {
        if (hasAnimated) return;
        hasAnimated = true;
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const isDecimal = target % 1 !== 0;
            let current = 0;
            const increment = target / 50; // 50 steps
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 50);
        });
    }
    
    // Trigger animation when stats section is visible
    const statsSection = $('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = $('#backToTop');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    backToTop?.addEventListener('click', scrollToTop);
}

// ===== NEWSLETTER FORM =====
function initializeNewsletterForm() {
    const form = $('.subscribe-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const originalText = button.innerHTML;
            
            if (!email.value) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email.value)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Subscribing...</span>';
            button.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for subscribing! Welcome to AI Review Harvester.', 'success');
                email.value = '';
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

// ===== SEARCH SYSTEM =====
function initializeSearchSystem() {
    const searchInput = $('#search-input');
    const searchForm = $('.search-form');
    const searchResults = $('#search-results');
    
    if (!searchInput || !searchForm || !searchResults) return;
    
    // Search database - in a real app, this would come from an API
    const searchDatabase = [
        {
            id: 'steam-deck-oled',
            title: 'Steam Deck OLED Review 2025',
            description: 'The ultimate handheld gaming experience with OLED display and better battery life',
            category: 'Gaming',
            url: 'reviews/steam-deck-oled-review.html',
            icon: 'fas fa-gamepad',
            keywords: ['steam', 'deck', 'oled', 'gaming', 'handheld', 'portable', 'valve']
        },
        {
            id: 'iphone-15-pro',
            title: 'iPhone 15 Pro Long-Term Review',
            description: 'Still worth it in 2025? 14 months later analysis with real user experiences',
            category: 'Smartphones',
            url: 'reviews/iphone-15-pro-review.html',
            icon: 'fas fa-mobile-alt',
            keywords: ['iphone', '15', 'pro', 'apple', 'smartphone', 'mobile', 'titanium']
        },
        {
            id: 'air-fryers-2025',
            title: 'Best Air Fryers 2025',
            description: 'Ninja Max XL vs Cosori TurboBlaze comparison from 2000+ verified purchases',
            category: 'Kitchen Appliances',
            url: 'reviews/best-air-fryers-2025.html',
            icon: 'fas fa-utensils',
            keywords: ['air', 'fryer', 'ninja', 'cosori', 'kitchen', 'cooking', 'appliance']
        },
        {
            id: 'electronics-category',
            title: 'Electronics Reviews',
            description: 'Smartphones, laptops, gaming devices, and cutting-edge gadgets - comprehensive AI-powered reviews',
            category: 'Category',
            url: 'categories/electronics.html',
            icon: 'fas fa-laptop',
            keywords: ['technology', 'tech', 'gadgets', 'electronics', 'smartphones', 'laptops', 'gaming']
        },
        {
            id: 'kitchen-category',
            title: 'Kitchen & Home Reviews',
            description: 'Kitchen appliances, air fryers, coffee makers, and home essentials with real user insights',
            category: 'Category',
            url: 'categories/kitchen.html',
            icon: 'fas fa-utensils',
            keywords: ['home', 'kitchen', 'appliances', 'air fryer', 'coffee', 'cooking', 'house']
        }
    ];
    
    let searchTimeout;
    let currentQuery = '';
    
    // Real-time search as user types
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        currentQuery = query;
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // Debounce search
    });
    
    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-search')) {
            hideSearchResults();
        }
    });
    
    // Keyboard navigation for results
    searchInput.addEventListener('keydown', function(e) {
        const activeResult = searchResults.querySelector('.search-result-item.active');
        const results = searchResults.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeResult) {
                    const next = activeResult.nextElementSibling;
                    if (next && next.classList.contains('search-result-item')) {
                        activeResult.classList.remove('active');
                        next.classList.add('active');
                    }
                } else if (results.length > 0) {
                    results[0].classList.add('active');
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (activeResult) {
                    const prev = activeResult.previousElementSibling;
                    if (prev && prev.classList.contains('search-result-item')) {
                        activeResult.classList.remove('active');
                        prev.classList.add('active');
                    }
                }
                break;
                
            case 'Enter':
                if (activeResult) {
                    e.preventDefault();
                    activeResult.click();
                }
                break;
                
            case 'Escape':
                hideSearchResults();
                searchInput.blur();
                break;
        }
    });
    
    function performSearch(query) {
        const results = searchDatabase.filter(item => {
            const searchTerms = query.toLowerCase().split(' ');
            return searchTerms.some(term => 
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.keywords.some(keyword => keyword.includes(term))
            );
        });
        
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <div>No results found for "${query}"</div>
                    <div style="font-size: 0.875rem; margin-top: 0.5rem; color: var(--gray-400);">
                        Try different keywords or browse our categories
                    </div>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${highlightSearchTerms(result.title, query)}</div>
                        <div class="search-result-description">${highlightSearchTerms(result.description, query)}</div>
                    </div>
                </a>
            `).join('');
        }
        
        showSearchResults();
    }
    
    function highlightSearchTerms(text, query) {
        const terms = query.toLowerCase().split(' ');
        let highlightedText = text;
        
        terms.forEach(term => {
            if (term.length > 1) {
                const regex = new RegExp(`(${term})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<strong style="background: var(--primary-color); color: white; padding: 1px 3px; border-radius: 2px;">$1</strong>');
            }
        });
        
        return highlightedText;
    }
    
    function showSearchResults() {
        searchResults.classList.add('show');
        searchResults.setAttribute('aria-hidden', 'false');
    }
    
    function hideSearchResults() {
        searchResults.classList.remove('show');
        searchResults.setAttribute('aria-hidden', 'true');
        // Remove active states
        searchResults.querySelectorAll('.search-result-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Add click handlers for search results
    searchResults.addEventListener('click', function(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            hideSearchResults();
            searchInput.value = '';
            
            // Track search analytics (in a real app)
            console.log('Search result clicked:', {
                query: currentQuery,
                result: resultItem.querySelector('.search-result-title').textContent,
                url: resultItem.href
            });
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    $$('.notification').forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Add styles for notification if not exists
    if (!$('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                z-index: 10000;
                background: white;
                border-radius: 0.75rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
            }
            
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            
            .notification-close {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: auto;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .notification {
                    left: 1rem;
                    right: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== ENHANCED INTERACTIONS =====

// Add hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    // Review card interactions
    $$('.review-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Category card interactions
    $$('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button hover effects
    $$('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// ===== SCROLL PROGRESS INDICATOR =====
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.innerHTML = '<div id="scroll-progress-bar"></div>';
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        #scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 10000;
        }
        
        #scroll-progress-bar {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        $('#scroll-progress-bar').style.width = Math.min(scrolled, 100) + '%';
    }
    
    window.addEventListener('scroll', throttle(updateProgress, 10));
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initializeScrollProgress);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=250&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop&crop=center&auto=format&q=80'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = $('#hamburger');
        const navMenu = $('.nav-menu');
        
        if (hamburger?.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }
    
    // Enter key activates buttons
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
});

// Focus management
document.addEventListener('DOMContentLoaded', function() {
    // Add focus indicators
    $$('.nav-link, .btn-primary, .btn-secondary, .btn-outline').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// ===== IMAGE HANDLING & FALLBACK SYSTEM =====
function initializeImageHandling() {
    // Comprehensive image error handling and fallback system
    const images = $$('img');
    
    images.forEach(img => {
        // Add loading state
        img.classList.add('image-loading');
        
        // Handle successful image load
        img.addEventListener('load', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-loaded');
        });
        
        // Enhanced error handling for images without onerror
        img.addEventListener('error', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-error');
            
            if (!this.hasAttribute('onerror') && !this.dataset.fallbackUsed) {
                console.warn(`Image failed to load: ${this.src}`);
                this.dataset.fallbackUsed = 'true';
                this.src = createFallbackImage(this.alt || 'Product Image');
            }
        });
    });
}

// Create a dynamic fallback image with text
function createFallbackImage(altText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // Add border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 380, 280);
    
    // Add icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📷', 200, 120);
    
    // Add text
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Image Not Available', 200, 170);
    
    // Add alt text if provided
    if (altText && altText !== 'Product Image') {
        ctx.font = '14px Arial';
        const words = altText.split(' ');
        let line = '';
        let y = 200;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > 350 && n > 0) {
                ctx.fillText(line, 200, y);
                line = words[n] + ' ';
                y += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 200, y);
    }
    
    return canvas.toDataURL();
}

// Add loading animations with CSS
function injectImageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .image-loading {
            position: relative;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: imageLoading 1.5s infinite;
            min-height: 200px;
        }

        .image-loaded {
            animation: imageSlideIn 0.5s ease-out;
        }

        .image-error {
            opacity: 0.8;
            filter: grayscale(10%);
            border: 2px dashed #ccc;
        }

        @keyframes imageLoading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        @keyframes imageSlideIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }

        /* Lazy loading placeholder */
        img[data-src] {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: imageLoading 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Image handling initialized in main DOMContentLoaded listener

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ===== CONSOLE BRANDING =====
console.log(`
🤖 AI Review Harvester - Modern 2025 Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Premium UI/UX Experience Loaded
🎨 Featuring: Glassmorphism, Animations & Dark Mode
📱 Fully Responsive & Accessible
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with modern web technologies
`);

// ===== PROFESSIONAL IMAGE GALLERY SYSTEM =====
function initializeImageGallery() {
    let currentImageIndex = 0;
    let galleryImages = [];
    let lightboxOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create lightbox modal HTML
    function createLightboxModal() {
        const existingModal = $('#lightbox-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'lightbox-modal';
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <div class="lightbox-content">
                <img id="lightbox-image" class="lightbox-image" src="" alt="">
                <div id="lightbox-caption" class="lightbox-caption"></div>
                <button id="lightbox-close" class="lightbox-close" aria-label="Close gallery">
                    <i class="fas fa-times"></i>
                </button>
                <button id="lightbox-prev" class="lightbox-nav lightbox-prev" aria-label="Previous image">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button id="lightbox-next" class="lightbox-nav lightbox-next" aria-label="Next image">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div id="lightbox-counter" class="lightbox-counter">
                    <span id="current-index">1</span> / <span id="total-images">1</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Open lightbox with specific image
    function openLightbox(index) {
        const modal = $('#lightbox-modal') || createLightboxModal();
        const lightboxImage = $('#lightbox-image');
        const lightboxCaption = $('#lightbox-caption');
        const currentIndexSpan = $('#current-index');
        const totalImagesSpan = $('#total-images');

        if (!galleryImages.length) return;

        currentImageIndex = index;
        lightboxOpen = true;

        // Update image and caption
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
        lightboxCaption.textContent = galleryImages[currentImageIndex].caption || galleryImages[currentImageIndex].alt;

        // Update counter
        currentIndexSpan.textContent = currentImageIndex + 1;
        totalImagesSpan.textContent = galleryImages.length;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        modal.focus();

        // Add event listeners
        setupLightboxEventListeners();
    }

    // Close lightbox
    function closeLightbox() {
        const modal = $('#lightbox-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            lightboxOpen = false;
            removeLightboxEventListeners();
        }
    }

    // Navigate to next image
    function nextImage() {
        if (galleryImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        }
    }

    // Navigate to previous image
    function prevImage() {
        if (galleryImages.length > 1) {
            currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
            updateLightboxImage();
        }
    }

    // Update lightbox image without reopening
    function updateLightboxImage() {
        const lightboxImage = $('#lightbox-image');
        const lightboxCaption = $('#lightbox-caption');
        const currentIndexSpan = $('#current-index');

        if (lightboxImage && galleryImages[currentImageIndex]) {
            // Add fade effect
            lightboxImage.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImage.src = galleryImages[currentImageIndex].src;
                lightboxImage.alt = galleryImages[currentImageIndex].alt;
                lightboxCaption.textContent = galleryImages[currentImageIndex].caption || galleryImages[currentImageIndex].alt;
                currentIndexSpan.textContent = currentImageIndex + 1;
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    }

    // Setup event listeners for lightbox
    function setupLightboxEventListeners() {
        const modal = $('#lightbox-modal');
        const closeBtn = $('#lightbox-close');
        const prevBtn = $('#lightbox-prev');
        const nextBtn = $('#lightbox-next');

        // Click events
        closeBtn?.addEventListener('click', closeLightbox);
        prevBtn?.addEventListener('click', prevImage);
        nextBtn?.addEventListener('click', nextImage);

        // Click outside to close
        modal?.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        // Touch/swipe support
        modal?.addEventListener('touchstart', handleTouchStart, { passive: true });
        modal?.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Remove event listeners
    function removeLightboxEventListeners() {
        document.removeEventListener('keydown', handleKeydown);
    }

    // Keyboard navigation handler
    function handleKeydown(e) {
        if (!lightboxOpen) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
        }
    }

    // Touch handlers for mobile swipe
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevImage(); // Swipe right = previous
            } else {
                nextImage(); // Swipe left = next
            }
        }
    }

    // Initialize gallery from existing images
    function initializeGalleryFromImages() {
        const galleryItems = $$('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption')?.textContent || img?.alt || '';
            
            if (img) {
                galleryImages.push({
                    src: img.src,
                    alt: img.alt || '',
                    caption: caption
                });

                // Add click listener to gallery item
                item.addEventListener('click', () => openLightbox(index));
                item.style.cursor = 'pointer';
                
                // Add keyboard accessibility
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.setAttribute('aria-label', `View image: ${img.alt || 'Gallery image'}`);
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
            }
        });
    }

    // Enhanced FAQ functionality
    function initializeEnhancedFAQ() {
        const faqItems = $$('.faq-item');
        
        faqItems.forEach(item => {
            const header = item.querySelector('h4');
            const content = item.querySelector('.faq-content');
            const icon = header?.querySelector('i');
            
            if (header && content) {
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherIcon = otherItem.querySelector('h4 i');
                            if (otherIcon) {
                                otherIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    } else {
                        item.classList.add('active');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                });

                // Keyboard accessibility for FAQ
                header.setAttribute('tabindex', '0');
                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        header.click();
                    }
                });
            }
        });
    }

    // Auto-resize lightbox image based on screen size
    function handleLightboxResize() {
        const lightboxImage = $('#lightbox-image');
        if (lightboxImage && lightboxOpen) {
            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.8;
            
            lightboxImage.style.maxWidth = maxWidth + 'px';
            lightboxImage.style.maxHeight = maxHeight + 'px';
        }
    }

    // Initialize gallery components
    initializeGalleryFromImages();
    initializeEnhancedFAQ();

    // Handle window resize for lightbox
    window.addEventListener('resize', debounce(handleLightboxResize, 250));

    // Create initial lightbox modal
    createLightboxModal();

    // Make gallery functions available globally for external use
    window.AIGallery = {
        openLightbox,
        closeLightbox,
        nextImage,
        prevImage,
        addImage: function(src, alt, caption) {
            galleryImages.push({ src, alt, caption });
        },
        getImages: function() {
            return [...galleryImages];
        }
    };
}

// ===== ENHANCED IMAGE LAZY LOADING =====
function initializeLazyLoading() {
    const lazyImages = $$('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('lazy-loading');
                    
                    img.onload = () => {
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-loaded');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize lazy loading on DOM ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Export functions for external use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        isValidEmail,
        throttle,
        debounce,
        initializeImageGallery
    };
}