/* ===================================================================
   HOME PAGE JAVASCRIPT - B.L VERDANTIX WEBSITE
   JavaScript specific to index.html (Home Page)
   =================================================================== */

// ===== HERO ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero-badge, .hero h1, .hero p, .hero-buttons');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ===== FEATURES ANIMATION =====
function animateFeatures() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (cardTop < triggerBottom) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

// ===== SOLUTION CARDS ANIMATION =====
function animateSolutions() {
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (cardTop < triggerBottom) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
}

// ===== STEP CARDS ANIMATION =====
function animateSteps() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (cardTop < triggerBottom) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 200);
        }
    });
}

// ===== STATS COUNTER ANIMATION =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const statTop = stat.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (statTop < triggerBottom && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const target = parseInt(text.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (target >= 1000) {
                    displayValue = (displayValue / 1000).toFixed(1) + 'K';
                }
                
                if (hasPlus) displayValue += '+';
                if (hasPercent) displayValue += '%';
                
                stat.textContent = displayValue;
            }, 16);
        }
    });
}

// ===== RECOGNITION SLIDER =====
function initRecognitionSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    
    if (!sliderTrack) return;
    
    // Clone slides for infinite loop
    const slides = sliderTrack.querySelectorAll('.slider-card');
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        sliderTrack.appendChild(clone);
    });
    
    // Pause on hover
    sliderTrack.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    sliderTrack.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

// ===== INDIA MAP FLOAT ANIMATION =====
function floatAnimation() {
    const mapImage = document.querySelector('.map-image img');
    
    if (mapImage) {
        let position = 0;
        let direction = 1;
        
        setInterval(() => {
            position += direction * 0.5;
            if (position >= 20 || position <= -20) {
                direction *= -1;
            }
            mapImage.style.transform = `translateY(${position}px)`;
        }, 50);
    }
}

// ===== PARALLAX EFFECT FOR HERO =====
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ===== TYPING EFFECT FOR HERO TITLE =====
function typingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let index = 0;
    const speed = 50;
    
    function typeWriter() {
        if (index < originalText.length) {
            heroTitle.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typing after a small delay
    setTimeout(typeWriter, 500);
}

// ===== FEATURE CARD HOVER EFFECT =====
function initFeatureHover() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.feature-icon').style.transform = 'rotateY(360deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.feature-icon').style.transform = 'rotateY(0deg)';
        });
    });
}

// ===== SOLUTION CARD IMAGE PARALLAX =====
function initSolutionParallax() {
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1) rotateX(0) rotateY(0)';
            }
        });
    });
}

// ===== APP MOCKUP TILT EFFECT =====
function initAppMockupTilt() {
    const appMockup = document.querySelector('.app-mockup');
    
    if (!appMockup) return;
    
    appMockup.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        const img = this.querySelector('img');
        if (img) {
            img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    appMockup.addEventListener('mouseleave', function() {
        const img = this.querySelector('img');
        if (img) {
            img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #2e7d32, #66bb6a);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== HERO BUTTONS RIPPLE EFFECT =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                top: ${y}px;
                left: ${x}px;
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation to stylesheet
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section, .features-section, .ai-section, .how-it-works, .app-section, .recognition-section, .map-section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== LOAD MORE FUNCTIONALITY (if needed) =====
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading delay
            setTimeout(() => {
                this.innerHTML = 'Load More';
                alert('More content loaded!');
            }, 1500);
        });
    }
}

// ===== SMOOTH REVEAL ANIMATIONS =====
window.addEventListener('scroll', function() {
    animateFeatures();
    animateSolutions();
    animateSteps();
    animateStats();
});

// ===== INITIALIZE ALL HOME PAGE FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page scripts initialized! 🏠');
    
    // Initialize all features
    initRecognitionSlider();
    initFeatureHover();
    initSolutionParallax();
    initAppMockupTilt();
    initScrollProgress();
    initRippleEffect();
    initIntersectionObserver();
    initLoadMore();
    
    // Parallax effect (optional - can be heavy on performance)
    // parallaxEffect();
    
    // Typing effect (optional - uncomment if desired)
    // typingEffect();
    
    // Initial animations
    animateFeatures();
    animateSolutions();
    animateSteps();
    animateStats();
    
    // Set initial opacity for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .solution-card, .step-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.6s ease';
    });
});

// ===== HERO CTA TRACKING =====
const heroCTAs = document.querySelectorAll('.hero-buttons .btn');
heroCTAs.forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        console.log(`Hero CTA clicked: ${btnText}`);
        
        // You can add analytics tracking here
        // Example: gtag('event', 'click', { 'event_category': 'Hero CTA', 'event_label': btnText });
    });
});

// ===== FEATURES TRACKING =====
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('click', function() {
        const featureName = this.querySelector('h3').textContent;
        console.log(`Feature clicked: ${featureName}`);
        
        // Add analytics or navigation here
    });
});

// ===== AI SECTION CTA TRACKING =====
const aiSectionBtns = document.querySelectorAll('.ai-section .btn');
aiSectionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('AI Section CTA clicked');
    });
});

// ===== APP DOWNLOAD TRACKING =====
const appButtons = document.querySelectorAll('.app-btn');
appButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('span').textContent;
        console.log(`App download clicked: ${platform}`);
        alert(`${platform} app download will be available soon! 📱`);
    });
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 5s infinite';
        alert('🌈 Secret code activated! You found the B.L Verdantix Easter Egg! 🌿');
        
        // Add rainbow animation
        if (!document.getElementById('rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events for better performance
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

// Apply debounce to scroll animations
const debouncedAnimations = debounce(function() {
    animateFeatures();
    animateSolutions();
    animateSteps();
    animateStats();
}, 100);

window.addEventListener('scroll', debouncedAnimations);

// ===== EXPORT FUNCTIONS =====
window.HomePageFunctions = {
    animateFeatures,
    animateSolutions,
    animateSteps,
    animateStats,
    initRecognitionSlider,
    initFeatureHover
};

console.log('✅ Home.js loaded successfully!');
