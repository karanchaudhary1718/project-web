/* ===================================================================
   CONTACT PAGE JAVASCRIPT - B.L VERDANTIX WEBSITE
   JavaScript specific to contact.html (Contact Page)
   =================================================================== */

// ===== WEB3FORMS CONFIGURATION =====
// IMPORTANT: Replace this with your actual Web3Forms Access Key
const ACCESS_KEY = "73c88023-d817-45a3-89fe-5ddc155e42ac";

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending... ⏳';
        
        // Hide previous messages
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
        
        // Get form data
        const formData = new FormData(contactForm);
        formData.append('access_key', ACCESS_KEY);
        
        // Optional: Add additional data
        formData.append('subject', 'New Contact Form Submission - B.L Verdantix');
        formData.append('from_name', 'B.L Verdantix Website');
        
        try {
            // Send to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                successMessage.classList.add('show');
                
                // Reset form
                contactForm.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
                
                // Log success
                console.log('Form submitted successfully!');
                
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            errorMessage.classList.add('show');
            errorMessage.textContent = '❌ ' + (error.message || 'Something went wrong. Please try again.');
            
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Send Message 📤';
        }
    });
}

// ===== FORM FIELD VALIDATION =====
const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');

formInputs.forEach(input => {
    // Real-time validation on blur
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    // Clear validation on input
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            this.style.borderColor = '';
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    // Validate email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            field.style.borderColor = '#e74c3c';
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Validate phone (if present)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('error');
            field.style.borderColor = '#e74c3c';
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Field is valid
    field.classList.remove('error');
    field.style.borderColor = '#66bb6a';
    return true;
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 5px;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    // Insert after field
    field.parentElement.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// ===== CHARACTER COUNTER FOR TEXTAREA =====
const messageTextarea = document.querySelector('#contactForm textarea[name="message"]');

if (messageTextarea) {
    const maxLength = 1000;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 12px;
        color: #666;
        margin-top: 5px;
    `;
    
    messageTextarea.parentElement.appendChild(counter);
    
    // Update counter
    function updateCounter() {
        const length = messageTextarea.value.length;
        counter.textContent = `${length} / ${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#e74c3c';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#666';
        }
    }
    
    messageTextarea.addEventListener('input', updateCounter);
    updateCounter();
}

// ===== FORM AUTO-SAVE (LOCAL STORAGE) =====
const STORAGE_KEY = 'bl_verdantix_contact_form';

// Save form data on input
if (contactForm) {
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 500));
    });
    
    // Load saved data on page load
    loadFormData();
}

function saveFormData() {
    const formData = {};
    
    formInputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        console.log('Form data auto-saved');
    } catch (e) {
        console.error('Failed to save form data:', e);
    }
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            formInputs.forEach(input => {
                if (input.name && formData[input.name]) {
                    input.value = formData[input.name];
                }
            });
            
            console.log('Form data loaded from auto-save');
        }
    } catch (e) {
        console.error('Failed to load form data:', e);
    }
}

function clearFormData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Form data cleared');
    } catch (e) {
        console.error('Failed to clear form data:', e);
    }
}

// Clear saved data on successful submission
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        setTimeout(clearFormData, 1000);
    });
}

// ===== DEBOUNCE UTILITY =====
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

// ===== CONTACT INFO CLICK TO COPY =====
const contactLinks = document.querySelectorAll('.contact-details a');

contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Only for email and phone links
        if (this.href.startsWith('mailto:') || this.href.startsWith('tel:')) {
            e.preventDefault();
            
            // Extract text to copy
            const textToCopy = this.href.startsWith('mailto:') 
                ? this.href.replace('mailto:', '')
                : this.href.replace('tel:', '');
            
            // Copy to clipboard
            copyToClipboard(textToCopy);
            
            // Show feedback
            showCopyFeedback(this);
        }
    });
});

function copyToClipboard(text) {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        console.log('Copied to clipboard (fallback):', text);
    } catch (err) {
        console.error('Failed to copy (fallback):', err);
    }
    
    document.body.removeChild(textarea);
}

function showCopyFeedback(element) {
    const originalText = element.textContent;
    
    // Create feedback tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Copied! ✓';
    tooltip.style.cssText = `
        position: absolute;
        background: #2e7d32;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        animation: fadeInOut 2s ease;
    `;
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - 35) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    // Add animation
    if (!document.getElementById('copy-tooltip-animation')) {
        const style = document.createElement('style');
        style.id = 'copy-tooltip-animation';
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateX(-50%) translateY(0); }
                10%, 90% { opacity: 1; transform: translateX(-50%) translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove tooltip after animation
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// ===== FEATURE CARD ANIMATIONS =====
function animateFeatureCards() {
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

// Initial styles for feature cards
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
    
    // Run animation
    animateFeatureCards();
});

// Animate on scroll
window.addEventListener('scroll', animateFeatureCards);

// ===== PHONE NUMBER FORMATTING =====
const phoneInput = document.querySelector('input[type="tel"]');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Format as +91 XXXXX XXXXX for Indian numbers
        if (value.startsWith('91') && value.length > 2) {
            value = '+91 ' + value.slice(2, 7) + (value.length > 7 ? ' ' + value.slice(7, 12) : '');
        } else if (value.length > 5) {
            value = value.slice(0, 5) + ' ' + value.slice(5, 10);
        }
        
        e.target.value = value;
    });
}

// ===== SPAM PROTECTION =====
// Add honeypot field (hidden from users)
if (contactForm) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'botcheck';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    contactForm.appendChild(honeypot);
    
    // Check honeypot on submit
    contactForm.addEventListener('submit', function(e) {
        if (honeypot.value) {
            e.preventDefault();
            console.warn('Spam detected - honeypot triggered');
            return false;
        }
    });
}

// ===== ANALYTICS TRACKING =====
function trackFormSubmission() {
    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            'event_category': 'Contact',
            'event_label': 'Contact Form',
            'value': 1
        });
    }
    
    // Console log for debugging
    console.log('Contact form submitted - tracked');
}

if (contactForm) {
    contactForm.addEventListener('submit', trackFormSubmission);
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page scripts initialized! 📧');
    
    // Focus first input
    const firstInput = document.querySelector('#contactForm input[type="text"]');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Add required field indicators
    const requiredFields = document.querySelectorAll('#contactForm [required]');
    requiredFields.forEach(field => {
        const label = field.previousElementSibling;
        if (label && label.tagName === 'LABEL' && !label.querySelector('.required')) {
            const span = document.createElement('span');
            span.className = 'required';
            span.textContent = ' *';
            span.style.color = '#e74c3c';
            label.appendChild(span);
        }
    });
    
    console.log('✅ Contact.js loaded successfully!');
});

// ===== EXPORT FUNCTIONS =====
window.ContactPageFunctions = {
    validateField,
    saveFormData,
    loadFormData,
    clearFormData,
    copyToClipboard,
    animateFeatureCards
};

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    if (e.message.includes('Web3Forms')) {
        console.error('Web3Forms Error:', e.message);
        errorMessage.classList.add('show');
        errorMessage.textContent = '❌ Form service error. Please try again or contact us directly.';
    }
});

console.log('📧 Contact form ready! Using Web3Forms API');
console.log('⚠️ Remember to update ACCESS_KEY with your actual Web3Forms key');
