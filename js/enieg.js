// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function closeMenu() {
    nav.classList.remove('open');
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (nav.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

window.addEventListener('scroll', () => {
    if (nav.classList.contains('open') && window.scrollY > 120) {
        closeMenu();
    }
});

// ===== HEADER AU SCROLL =====
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        backToTop.classList.remove('visible');
    }
    updateActiveLink();
});

// ===== LIEN ACTIF AU SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ===== UTILITAIRES =====
function setLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.style.color = type === 'success' ? 'var(--accent-dark)' : 'var(--danger)';
}

// ===== FORMULAIRE DE CONTACT =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const contactSubmit = document.getElementById('contactSubmit');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nom = document.getElementById('nom').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!nom || !telephone || !message) {
            showMessage(formMessage, 'Veuillez remplir tous les champs obligatoires (*).', 'error');
            return;
        }
        if (telephone.replace(/\D/g, '').length < 9) {
            showMessage(formMessage, 'Le numéro de téléphone semble invalide.', 'error');
            return;
        }

        setLoading(contactSubmit, true);
        showMessage(formMessage, '', 'success');

        try {
            // ⚠️ SIMULATION — remplacer par un vrai envoi (EmailJS / Formspree / backend)
            await new Promise(resolve => setTimeout(resolve, 1200));

            showMessage(
                formMessage,
                `Merci ${nom} ! Votre message a bien été envoyé. Nous vous répondrons au ${telephone}.`,
                'success'
            );
            contactForm.reset();

            setTimeout(() => { formMessage.textContent = ''; }, 8000);
        } catch (err) {
            showMessage(formMessage, "Une erreur est survenue. Réessayez ou contactez le secrétariat.", 'error');
        } finally {
            setLoading(contactSubmit, false);
        }
    });
}

// ===== LIGHTBOX GALERIE =====
const galerieItems = document.querySelectorAll('.galerie-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
const images = Array.from(galerieItems).map(img => ({
    src: img.src,
    alt: img.alt || ''
}));

function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
}

galerieItems.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

// ===== ANIMATION AU SCROLL =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(
    '.card-modern, .fact-card, .galerie-item, .concours-detail-card, .contact-action'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== SLIDER TÉMOIGNAGES =====
(function initTemoignagesSlider() {
    const track = document.getElementById('temoignagesTrack');
    const prevBtn = document.getElementById('temoignagePrev');
    const nextBtn = document.getElementById('temoignageNext');
    const dotsContainer = document.getElementById('temoignagesDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(track.querySelectorAll('.temoignage-card'));
    if (cards.length === 0) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let autoplayInterval = null;

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - cardsPerView);
    }

    function getOffset() {
        if (cards.length === 0) return 0;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return currentIndex * (cardWidth + gap);
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'temoignage-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Aller au témoignage ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        const offset = getOffset();
        track.style.transform = `translateX(-${offset}px)`;

        const dots = dotsContainer.querySelectorAll('.temoignage-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        const maxIndex = getMaxIndex();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    function goNext() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex();
        }
        updateSlider();
    }

    function startAutoplay() {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(goNext, 6000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    nextBtn.addEventListener('click', () => {
        goNext();
        restartAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        goPrev();
        restartAutoplay();
    });

    const slider = document.getElementById('temoignagesSlider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
    }

    // Swipe tactile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goNext();
            else goPrev();
        }
        startAutoplay();
    }, { passive: true });

    // Recalcul au redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = Math.min(currentIndex, getMaxIndex());
                buildDots();
            }
            updateSlider();
        }, 150);
    });

    buildDots();
    updateSlider();
    startAutoplay();
})();

// ===== FAQ ACCORDÉON =====
(function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Ferme tous les autres items (comportement accordéon strict)
            faqItems.forEach(other => {
                other.classList.remove('open');
                const btn = other.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Ouvre l'item cliqué s'il était fermé
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();