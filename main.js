/* ===================================================================
   MAIN JAVASCRIPT - B.L VERDANTIX WEBSITE
   Common JavaScript functions used across all pages
   =================================================================== */

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const overlay = document.getElementById('overlay');

if (hamburger && navMenu && overlay) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
}

// ===== AI CHATBOT FUNCTIONALITY =====
const aiChatButton = document.getElementById('aiChatButton');
const aiChatWindow = document.getElementById('aiChatWindow');
const aiCloseChat = document.getElementById('aiCloseChat');
const aiChatInput = document.getElementById('aiChatInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatMessages = document.getElementById('aiChatMessages');
const aiTypingIndicator = document.getElementById('aiTypingIndicator');

// Open chat window
if (aiChatButton && aiChatWindow) {
    aiChatButton.addEventListener('click', function() {
        aiChatWindow.classList.add('active');
        aiChatInput.focus();
    });
}

// Close chat window
if (aiCloseChat && aiChatWindow) {
    aiCloseChat.addEventListener('click', function() {
        aiChatWindow.classList.remove('active');
    });
}

// Send message on button click
if (aiSendBtn && aiChatInput) {
    aiSendBtn.addEventListener('click', sendAIMessage);
}

// Send message on Enter key
if (aiChatInput) {
    aiChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
}

// Send AI Message Function
function sendAIMessage() {
    const message = aiChatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Clear input
    aiChatInput.value = '';
    
    // Show typing indicator
    if (aiTypingIndicator) {
        aiTypingIndicator.style.display = 'block';
    }
    
    // Simulate bot response delay
    setTimeout(function() {
        // Hide typing indicator
        if (aiTypingIndicator) {
            aiTypingIndicator.style.display = 'none';
        }
        
        // Get bot response
        const botResponse = getAIResponse(message);
        addMessageToChat('bot', botResponse);
    }, 1500);
}

// Add message to chat
function addMessageToChat(sender, message) {
    if (!aiChatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'ai-message-bubble';
    
    if (sender === 'bot') {
        const avatar = document.createElement('span');
        avatar.className = 'ai-bot-avatar';
        avatar.textContent = '🌾';
        bubbleDiv.appendChild(avatar);
    }
    
    const textSpan = document.createElement('span');
    textSpan.innerHTML = message.replace(/\n/g, '<br>');
    bubbleDiv.appendChild(textSpan);
    
    messageDiv.appendChild(bubbleDiv);
    aiChatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

// Get AI Response (Hindi responses)
function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('नमस्ते') || lowerMessage.includes('हैलो') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'नमस्ते! 🙏<br>मैं B.L Verdantix का AI सहायक हूँ।<br>मैं आपकी कैसे मदद कर सकता हूँ?';
    }
    
    // Contact information
    if (lowerMessage.includes('संपर्क') || lowerMessage.includes('contact') || lowerMessage.includes('फोन') || lowerMessage.includes('phone') || lowerMessage.includes('नंबर')) {
        return '<div class="ai-contact-info"><strong>📞 संपर्क करें:</strong><br>फोन: +91 90585 45076<br><br><strong>📧 ईमेल:</strong><br>b.l.verdantix2026@gmail.com<br><br><strong>📍 पता:</strong><br>CCS University, Meerut</div>';
    }
    
    // Services
    if (lowerMessage.includes('सेवा') || lowerMessage.includes('service') || lowerMessage.includes('क्या करते') || lowerMessage.includes('what do')) {
        return 'हम निम्नलिखित सेवाएं प्रदान करते हैं:<br><br>🌱 पौधों की पहचान और रोग निदान<br>💧 सिंचाई समाधान<br>📊 कृषि कैलकुलेटर<br>🗺️ GPS भूमि माप<br>🌿 पौधों की ऑनलाइन बिक्री<br><br>अधिक जानकारी के लिए हमसे संपर्क करें!';
    }
    
    // Plant identification
    if (lowerMessage.includes('पौधा') || lowerMessage.includes('plant') || lowerMessage.includes('पहचान') || lowerMessage.includes('identify') || lowerMessage.includes('स्कैन') || lowerMessage.includes('scan')) {
        return 'हमारी AI-powered Plant Scanner से आप:<br><br>📸 पौधों की तुरंत पहचान कर सकते हैं<br>🔬 रोगों का निदान कर सकते हैं<br>💊 उपचार की सलाह ले सकते हैं<br><br>17,000+ पौधों की प्रजातियां<br>98% सटीकता दर<br><br>अभी scan करें!';
    }
    
    // Calculators
    if (lowerMessage.includes('कैलकुलेटर') || lowerMessage.includes('calculator') || lowerMessage.includes('गणना') || lowerMessage.includes('calculate')) {
        return 'हमारे पास विभिन्न कृषि कैलकुलेटर हैं:<br><br>🌾 Fertilizer Calculator<br>💧 Irrigation Calculator<br>📊 Bulk Density Calculator<br>🌳 Tree Dose Calculator<br>📏 Area Converter<br>🗺️ GPS Land Calculator<br><br>Services पेज पर जाएं!';
    }
    
    // Store/Shop
    if (lowerMessage.includes('दुकान') || lowerMessage.includes('store') || lowerMessage.includes('खरीद') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
        return 'हमारे Plant Store में उपलब्ध है:<br><br>🌺 Flowering Plants<br>🏠 Indoor Plants<br>🌿 Medicinal Plants<br>🎁 Combo Packs<br>🌱 Seeds<br>🎨 Garden Decor<br><br>✅ Free Delivery ₹499+ पर<br>💰 Cash on Delivery उपलब्ध<br><br>Shop Now!';
    }
    
    // Price/Cost
    if (lowerMessage.includes('कीमत') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('दाम')) {
        return 'हमारे पौधों की कीमतें बहुत उचित हैं:<br><br>🌱 ₹99 से शुरू<br>🎁 Combo Packs में छूट<br>🚚 Free Delivery ₹499+<br><br>सभी कीमतों के लिए Plant Store देखें!';
    }
    
    // Location/Address
    if (lowerMessage.includes('कहाँ') || lowerMessage.includes('where') || lowerMessage.includes('पता') || lowerMessage.includes('address') || lowerMessage.includes('location')) {
        return '📍 हमारा पता:<br><br>CCS University<br>Meerut, Uttar Pradesh<br>India<br><br>हम निम्नलिखित राज्यों में सक्रिय हैं:<br>• Uttar Pradesh<br>• Punjab<br>• Haryana<br>• Uttarakhand<br>• Bihar';
    }
    
    // Working hours
    if (lowerMessage.includes('समय') || lowerMessage.includes('time') || lowerMessage.includes('खुला') || lowerMessage.includes('open') || lowerMessage.includes('बंद') || lowerMessage.includes('close')) {
        return '⏰ कार्य समय:<br><br>सोमवार - शनिवार:<br>9:00 AM - 6:00 PM<br><br>रविवार: बंद<br><br>24/7 ऑनलाइन सहायता उपलब्ध!';
    }
    
    // Help/Support
    if (lowerMessage.includes('मदद') || lowerMessage.includes('help') || lowerMessage.includes('सहायता') || lowerMessage.includes('support')) {
        return 'मैं आपकी मदद के लिए यहाँ हूँ! 😊<br><br>आप मुझसे पूछ सकते हैं:<br><br>• हमारी सेवाओं के बारे में<br>• पौधों की जानकारी<br>• संपर्क विवरण<br>• कीमतें और ऑफर<br>• कैलकुलेटर की जानकारी<br><br>कुछ भी पूछें!';
    }
    
    // Thank you
    if (lowerMessage.includes('धन्यवाद') || lowerMessage.includes('thanks') || lowerMessage.includes('thank you') || lowerMessage.includes('शुक्रिया')) {
        return 'आपका स्वागत है! 🙏<br><br>यदि आपको और कोई सहायता चाहिए तो बेझिझक पूछें।<br><br>B.L Verdantix के साथ जुड़े रहें! 🌿';
    }
    
    // About company
    if (lowerMessage.includes('के बारे में') || lowerMessage.includes('about') || lowerMessage.includes('कंपनी') || lowerMessage.includes('company')) {
        return 'B.L Verdantix Agri Technologies 🌾<br><br>हम AI-powered कृषि समाधान प्रदान करते हैं:<br><br>✅ 2000 से स्थापित<br>✅ 10,000+ किसान सेवित<br>✅ 5 राज्यों में सक्रिय<br>✅ 24/7 तकनीकी सहायता<br><br>हमारा उद्देश्य: तकनीक से कृषि को सशक्त बनाना! 💪';
    }
    
    // Default response
    return 'धन्यवाद आपके संदेश के लिए! 🙏<br><br>कृपया अधिक जानकारी के लिए हमसे संपर्क करें:<br><br>📞 +91 90585 45076<br>📧 b.l.verdantix2026@gmail.com<br><br>या आप हमारी सेवाओं, पौधों, कीमतों, या संपर्क जानकारी के बारे में पूछ सकते हैं।';
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== FADE IN ON SCROLL ANIMATION =====
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

// Run on scroll and on load
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== CONSOLE MESSAGE =====
console.log('%c🌿 B.L Verdantix Agri Technologies', 'color: #2e7d32; font-size: 20px; font-weight: bold;');
console.log('%cAI-Powered Agriculture Solutions', 'color: #66bb6a; font-size: 14px;');
console.log('%c🌾 Empowering Farmers with Technology', 'color: #388e3c; font-size: 12px;');

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #2e7d32, #66bb6a);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.4);
    transition: all 0.3s ease;
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) scale(1.1)';
    this.style.boxShadow = '0 6px 16px rgba(46, 125, 50, 0.5)';
});

backToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.4)';
});

// ===== PREVENT EMPTY FORM SUBMISSIONS =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 2000);
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('कृपया सभी आवश्यक फ़ील्ड भरें।\nPlease fill all required fields.');
        }
    });
});

// ===== INITIALIZE EVERYTHING ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('B.L Verdantix website loaded successfully! 🌿');
    
    // Run fade in animation on page load
    fadeInOnScroll();
    
    // Focus on first input in forms
    const firstInput = document.querySelector('form input:not([type="hidden"])');
    if (firstInput) {
        firstInput.focus();
    }
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
});

// ===== EXPORT FUNCTIONS FOR OTHER SCRIPTS =====
window.BLVerdantix = {
    addMessageToChat: addMessageToChat,
    getAIResponse: getAIResponse,
    sendAIMessage: sendAIMessage
};
