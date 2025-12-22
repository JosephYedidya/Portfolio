// Utility functions and helpers for Finance Tracker

// Debounce function for performance optimization
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

// Format currency with improved formatting
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '0 FCFA';
    }
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

// Show loading state for elements
function showLoading(element, message = '⏳ Chargement...') {
    element.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner">⏳</div>
            <div class="loading-text">${message}</div>
        </div>
    `;
}

// Show error state for elements
function showError(element, message = '❌ Une erreur est survenue', retryCallback = null) {
    element.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <div class="error-text">${message}</div>
            ${retryCallback ? `<button class="btn btn-retry" onclick="${retryCallback}">Réessayer</button>` : ''}
        </div>
    `;
}

// Show empty state with better UX
function showEmptyState(container, message, icon = '📊', actionText = null, actionCallback = null) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <p>${message}</p>
            ${actionText && actionCallback ? `<button class="btn btn-primary" onclick="${actionCallback}">${actionText}</button>` : ''}
        </div>
    `;
}

// Performance-optimized DOM manipulation
function createElementWithContent(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

// Batch DOM updates for better performance
function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
        updates.forEach(update => {
            if (typeof update === 'function') {
                update();
            }
        });
    });
}

// Validate transaction data
function validateTransaction(transaction) {
    const errors = [];
    
    if (!transaction.description || transaction.description.trim().length === 0) {
        errors.push('La description est requise');
    }
    
    if (!transaction.amount || transaction.amount <= 0) {
        errors.push('Le montant doit être supérieur à 0');
    }
    
    if (!transaction.category) {
        errors.push('La catégorie est requise');
    }
    
    if (!transaction.type || !['revenue', 'expense'].includes(transaction.type)) {
        errors.push('Le type de transaction est invalide');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Show notification with improved UX
function showNotification(icon, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${type}`;
    toast.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Chart rendering optimization
const ChartRenderer = {
    updateQueue: new Map(),
    
    queueUpdate(chartId, updateFn, priority = 0) {
        if (!this.updateQueue.has(chartId)) {
            this.updateQueue.set(chartId, { fn: updateFn, priority: priority });
        }
    },
    
    processQueue() {
        if (this.updateQueue.size === 0) return;
        
        requestAnimationFrame(() => {
            this.updateQueue.forEach((item, chartId) => {
                try {
                    item.fn();
                } catch (error) {
                    console.error(`Chart update failed for ${chartId}:`, error);
                }
            });
            this.updateQueue.clear();
        });
    }
};

// Intersection Observer for lazy loading
function createIntersectionObserver(callback, options = {}) {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                // Optional: unobserve after first intersection
                // observer.unobserve(entry.target);
            }
        });
    }, options);
}

// Responsive utilities
const Responsive = {
    isMobile() {
        return window.innerWidth <= 768;
    },
    
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1200;
    },
    
    isDesktop() {
        return window.innerWidth > 1200;
    },
    
    getBreakpoint() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }
};

// Date utilities
const DateUtils = {
    formatDate(date, format = 'short') {
        const d = new Date(date);
        switch (format) {
            case 'short':
                return d.toLocaleDateString('fr-FR');
            case 'long':
                return d.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            case 'time':
                return d.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            default:
                return d.toLocaleDateString('fr-FR');
        }
    },
    
    isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    },
    
    isSameMonth(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    }
};

// Expose utility functions globally for the finance tracker
window.debounce = debounce;
window.formatCurrency = formatCurrency;
window.showLoading = showLoading;
window.showError = showError;
window.showEmptyState = showEmptyState;
window.createElementWithContent = createElementWithContent;
window.batchDOMUpdates = batchDOMUpdates;
window.validateTransaction = validateTransaction;
window.generateId = generateId;
window.showNotification = showNotification;
window.ChartRenderer = ChartRenderer;
window.createIntersectionObserver = createIntersectionObserver;
window.Responsive = Responsive;
window.DateUtils = DateUtils;

// Export utilities for Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        formatCurrency,
        showLoading,
        showError,
        showEmptyState,
        createElementWithContent,
        batchDOMUpdates,
        validateTransaction,
        generateId,
        showNotification,
        ChartRenderer,
        createIntersectionObserver,
        Responsive,
        DateUtils
    };
}
