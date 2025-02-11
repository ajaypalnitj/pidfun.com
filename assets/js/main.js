// Smooth scrolling for navigation links
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

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.background = 'rgba(0, 2, 18, 0.8)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        header.style.background = 'rgba(0, 2, 18, 0.95)';
    } else {
        // Scrolling up
        header.style.background = 'rgba(0, 2, 18, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.tool-card, .extension-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
});

document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".header");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) { // Change 50 to whatever threshold you like
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    });
});
