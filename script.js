/* ========================================
   CHINA QUEST — SHARED JAVASCRIPT
   script.js — load with defer on all pages
   ======================================== */

// ---- Sticky nav with transparency transition ----
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');

function updateNav() {
    if (!nav) return;
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('scrolled', scrolled);

    const navMain = nav.querySelector('.nav-main');
    if (!navMain) return;

    if (hero && window.scrollY < hero.offsetHeight - 100) {
        navMain.style.background = 'rgba(255,255,255,0)';
        navMain.style.borderBottomColor = 'transparent';
        nav.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => a.style.color = 'rgba(255,255,255,0.8)');
        const logoEl = nav.querySelector('.logo');
        if (logoEl) logoEl.style.color = 'white';
    } else {
        navMain.style.background = 'rgba(255,255,255,0.97)';
        navMain.style.borderBottomColor = 'rgba(0,0,0,0.06)';
        nav.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => a.style.color = '');
        const logoEl = nav.querySelector('.logo');
        if (logoEl) logoEl.style.color = '';
    }
}
window.addEventListener('scroll', updateNav);
updateNav();


// ---- Video hero: loop with slight delay ----
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    heroVideo.addEventListener('ended', () => {
        setTimeout(() => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        }, 2000);
    });
    heroVideo.play().catch(() => {});
}


// ---- Subject filter ----
function filterCards(subject, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.programme-card');
    let shown = 0;
    cards.forEach(card => {
        const match = subject === 'all' || card.dataset.subject === subject;
        card.style.display = match ? 'flex' : 'none';
        card.style.opacity = match ? '0' : '0';
        if (match) {
            shown++;
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }
    });
    const countEl = document.querySelector('.filter-count strong');
    if (countEl) {
        countEl.textContent = shown + ' programme' + (shown !== 1 ? 's' : '');
    }
}
// Expose globally for inline onclick handlers
window.filterCards = filterCards;


// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = nav ? nav.offsetHeight + 20 : 80;
            const y = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});


// ---- Scroll-triggered animations ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const siblings = entry.target.parentElement ? Array.from(entry.target.parentElement.children) : [];
            const delay = siblings.indexOf(entry.target) * 80;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll(
    '.programme-card, .dest-card, .outcome-card, .safety-card, ' +
    '.testimonial-card, .how-step, .trust-item, .pricing-card, ' +
    '.cross-sell-card, .service-model-card'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(el);
});


// ---- Parallax on hero stats (index only) ----
const heroStats = document.querySelector('.hero-stats');
if (hero && heroStats) {
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        const heroH = hero.offsetHeight;
        if (scroll < heroH) {
            heroStats.style.transform = `translateY(${scroll * 0.15}px)`;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) heroContent.style.transform = `translateY(${scroll * 0.08}px)`;
        }
    });
}


// ---- Number counter animation on hero stats ----
function animateCounters() {
    document.querySelectorAll('.hero-stat .value').forEach(el => {
        const text = el.textContent;
        const num = parseInt(text.replace(/[^0-9]/g, ''));
        if (isNaN(num) || num === 0) return;

        const suffix = text.replace(/[0-9,]/g, '');
        const prefix = text.match(/^[^0-9]*/)[0];
        let current = 0;
        const step = Math.ceil(num / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            el.textContent = prefix + current.toLocaleString() + suffix;
        }, 30);
    });
}

if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
}
