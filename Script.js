
// Navigation active state
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});


// Enhanced Mobile menu functionality
const navToggler = document.getElementById('navToggler');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

// Enhanced mobile menu toggle with better UX
navToggler.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    navToggler.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close sidebar when clicking on a link (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
            sidebar.classList.remove('open');
            navToggler.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 991 && 
        sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !navToggler.contains(e.target)) {
        sidebar.classList.remove('open');
        navToggler.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only process horizontal swipes if they're more significant than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0 && sidebar.classList.contains('open')) {
            // Swipe left to close menu
            sidebar.classList.remove('open');
            navToggler.classList.remove('active');
            document.body.style.overflow = '';
        } else if (diffX < 0 && !sidebar.classList.contains('open') && touchStartX < 50) {
            // Swipe right from left edge to open menu
            sidebar.classList.add('open');
            navToggler.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        sidebar.classList.remove('open');
        navToggler.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Style switcher toggle
const styleSwitcherToggler = document.querySelector('.style-switcher-toggler');
const styleSwitcher = document.getElementById('styleSwitcher');

styleSwitcherToggler.addEventListener('click', () => {
    styleSwitcher.classList.toggle('open');
});

// Day/Night mode toggle
const dayNight = document.getElementById('dayNight');

dayNight.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = dayNight.querySelector('i');
    
    if (document.body.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        dayNight.querySelector('i').classList.remove('fa-moon');
        dayNight.querySelector('i').classList.add('fa-sun');
    }

    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--skin-color', savedColor);
    }
});

// Change theme color
function setActiveStyle(color) {
    document.documentElement.style.setProperty('--skin-color', color);
    localStorage.setItem('themeColor', color);
}


// Smooth scroll for navigation
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

// Hide style switcher on scroll
let scrollTimer;
window.addEventListener('scroll', () => {
    if (styleSwitcher.classList.contains('open')) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            styleSwitcher.classList.remove('open');
        }, 1000);
    }
});

// Typing effect
const typingText = document.querySelector('.typing');
const textArray = ['Software Engineer', 'Web Developer', 'Full Stack Developer', 'UI/UX Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

// Start typing effect
setTimeout(typeEffect, 1000);

// Animate progress bars on scroll - VERSION CORRIGÉE
const progressBars = document.querySelectorAll('.progress-in');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const targetWidth = progressBar.getAttribute('data-width');
            
            // Ajouter un petit délai pour l'animation
            setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
            }, 100);
            
            // Arrêter d'observer une fois animé
            progressObserver.unobserve(progressBar);
        }
    });
}, observerOptions);

// Observer toutes les barres de progression
progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Alerte visuelle simple
function showAlert() {
const box = document.getElementById("alertBox");
box.style.display = "block";
setTimeout(() => { box.style.display = "none"; }, 2000);
return false;
}

// Obfuscation légère du JavaScript
(function(){
const msg = ["Ce site appartient à Joseph Yedidya", "Toute copie est interdite 🚫"];
console.log(msg[Math.floor(Math.random()*msg.length)]);
})();

