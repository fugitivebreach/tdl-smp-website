// TDL SMP Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initForms();
    initModals();
    initUtilities();
});

// Navigation functionality
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        tab.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Form handling
function initForms() {
    const appealForm = document.getElementById('appealForm');
    if (appealForm) {
        appealForm.addEventListener('submit', handleAppealSubmission);
    }
    
    // Form validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Age validation
    if (field.name === 'age' && value) {
        const age = parseInt(value);
        if (age < 13 || age > 99) {
            showFieldError(field, 'Age must be between 13 and 99');
            return false;
        }
    }
    
    // Discord username validation
    if (field.name === 'discordUsername' && value) {
        if (value.length < 2 || value.length > 32) {
            showFieldError(field, 'Discord username must be between 2-32 characters');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Modal functionality
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        const modalCloseBtn = modal.querySelector('#modalClose');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => closeModal(modal));
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function showModal(title, message, type = 'info') {
    let modal = document.getElementById('responseModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = createModal();
        document.body.appendChild(modal);
    }
    
    const modalTitle = modal.querySelector('#modalTitle');
    const modalMessage = modal.querySelector('#modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Add type-specific styling
    modal.className = `modal modal-${type}`;
    
    modal.style.display = 'block';
    
    // Auto-close success modals after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            closeModal(modal);
        }, 3000);
    }
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'responseModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Status</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p id="modalMessage"></p>
            </div>
            <div class="modal-footer">
                <button id="modalClose" class="btn btn-secondary">Close</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close');
    const modalCloseBtn = modal.querySelector('#modalClose');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    modalCloseBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    return modal;
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Show modal with title, message and type
function showModal(title, message, type = 'info') {
    // Remove existing modal if any
    const existingModal = document.getElementById('responseModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'responseModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const iconClass = type === 'success' ? 'fas fa-check-circle' : 
                     type === 'error' ? 'fas fa-exclamation-triangle' : 
                     'fas fa-info-circle';
    
    const iconColor = type === 'success' ? '#10b981' : 
                     type === 'error' ? '#ef4444' : 
                     '#3b82f6';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">
                    <i class="${iconClass}" style="color: ${iconColor}; margin-right: 0.5rem;"></i>
                    ${title}
                </h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p id="modalMessage">${message}</p>
            </div>
            <div class="modal-footer">
                <button id="modalClose" class="btn btn-secondary">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close');
    const modalCloseBtn = modal.querySelector('#modalClose');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modalCloseBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function initUtilities() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type !== 'submit') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Report...';
            
            try {
                // Get form data (keep as FormData for file upload)
                const formData = new FormData(this);
                
                const response = await fetch('/submit-report', {
                    method: 'POST',
                    body: formData // Don't set Content-Type header, let browser set it for multipart/form-data
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Show success modal
                    showModal('Appeal Submitted Successfully! ⚖️', result.message, 'success');
                    this.reset();
                } else {
                    // Show error modal
                    showModal('Submission Failed', result.error || 'An error occurred while submitting your appeal.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showModal('Network Error', 'Unable to submit appeal. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!', 'success');
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8',
        color: 'white',
        borderRadius: '8px',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Loading overlay
function showLoading() {
    let overlay = document.getElementById('loadingOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
        
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            color: 'white',
            fontSize: '1.2rem'
        });
        
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Form auto-save (for appeal form)
function initAutoSave() {
    const appealForm = document.getElementById('appealForm');
    if (!appealForm) return;
    
    const formFields = appealForm.querySelectorAll('input, textarea, select');
    
    // Load saved data
    formFields.forEach(field => {
        const savedValue = localStorage.getItem(`appeal_${field.name}`);
        if (savedValue && field.type !== 'checkbox') {
            field.value = savedValue;
        } else if (savedValue && field.type === 'checkbox') {
            field.checked = savedValue === 'true';
        }
    });
    
    // Save data on input
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.type === 'checkbox') {
                localStorage.setItem(`appeal_${field.name}`, field.checked);
            } else {
                localStorage.setItem(`appeal_${field.name}`, field.value);
            }
        });
    });
    
    // Clear saved data on successful submission
    appealForm.addEventListener('submit', () => {
        setTimeout(() => {
            formFields.forEach(field => {
                localStorage.removeItem(`appeal_${field.name}`);
            });
        }, 1000);
    });
}

// Initialize auto-save when DOM is loaded
document.addEventListener('DOMContentLoaded', initAutoSave);

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
    }
    
    .loading-spinner {
        text-align: center;
    }
    
    .loading-spinner i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #8B0000;
    }
`;
document.head.appendChild(style);
