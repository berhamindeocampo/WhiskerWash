// ====================== PRELOADER ======================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }, 800);
    }
});

// ====================== SCROLL ANIMATIONS ======================
document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(
        '.fade-in, .service-card, .service_row, .product-card, .product_card, .blog-card, .blog_card'
    );

    // Stagger delay for cards
    const cards = document.querySelectorAll(
        '.service_row, .product_card, .blog_card, .service-card, .product-card, .blog-card'
    );
    cards.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Swap logo based on theme
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        // Detect if page is in a subdirectory by checking pathname or image src attribute
        const isSubDir = window.location.pathname.includes('/blog/') ||
                         window.location.pathname.includes('/products/') ||
                         window.location.pathname.includes('/services/') ||
                         (logoImg.getAttribute('src') && logoImg.getAttribute('src').startsWith('../'));
        const basePath = isSubDir ? '../assets/images/' : 'assets/images/';

        if (theme === 'dark') {
            logoImg.src = basePath + 'whiskerwashdarkmode.png';
        } else {
            logoImg.src = basePath + 'whisker_wash_logo.png';
        }
    }
}

// Set initial theme
setTheme(currentTheme);

// Toggle on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });
}

// ====================== DYNAMIC CHATBOT LOAD ======================
document.addEventListener("DOMContentLoaded", () => {
    // Determine the base path depending on subdirectory depth
    const isSubDir = window.location.pathname.includes('/blog/') ||
                     window.location.pathname.includes('/products/') ||
                     window.location.pathname.includes('/services/');
    const basePath = isSubDir ? '../' : '';

    // Check if chatbot.js is already imported
    if (!document.querySelector('script[src*="chatbot.js"]')) {
        const chatScript = document.createElement('script');
        chatScript.src = basePath + 'assets/js/chatbot.js';
        chatScript.defer = true;
        document.body.appendChild(chatScript);
    }
});

// ====================== DYNAMIC CART LOAD ======================
document.addEventListener("DOMContentLoaded", () => {
    const isSubDir = window.location.pathname.includes('/blog/') ||
                     window.location.pathname.includes('/products/') ||
                     window.location.pathname.includes('/services/');
    const basePath = isSubDir ? '../' : '';

    if (!document.querySelector('script[src*="cart.js"]')) {
        const cartScript = document.createElement('script');
        cartScript.src = basePath + 'assets/js/cart.js';
        cartScript.defer = true;
        document.body.appendChild(cartScript);
    }
});