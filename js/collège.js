document.addEventListener('DOMContentLoaded', () => {

  // 1. Menu Hamburger Mobile
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const hamburgerIcon = hamburgerBtn ? hamburgerBtn.querySelector('i') : null;

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      if (navLinks.classList.contains('active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-xmark');
      } else {
        hamburgerIcon.classList.remove('fa-xmark');
        hamburgerIcon.classList.add('fa-bars');
      }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('fa-xmark');
          hamburgerIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. Défilement doux (Smooth Scroll)
  const allLinks = document.querySelectorAll('a[href^="#"]');

  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. Carousel Slider "Moments au CBP"
  const prevBtn = document.getElementById('prevMoments');
  const nextBtn = document.getElementById('nextMoments');
  const sliderContainer = document.querySelector('.moments-slider-container');
  const dots = document.querySelectorAll('#dotsContainer .dot');

  if (sliderContainer) {
    const getCardWidth = () => {
      const card = sliderContainer.querySelector('.moment-card');
      return card ? card.offsetWidth + 20 : 300;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
    }

    sliderContainer.addEventListener('scroll', () => {
      const scrollPosition = sliderContainer.scrollLeft;
      const cardWidth = getCardWidth();
      const activeIndex = Math.round(scrollPosition / cardWidth);

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        sliderContainer.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
      });
    });
  }

  // 4. BOUTON RETOUR EN HAUT
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. FAQ ACCORDÉON AMÉLIORÉ (recherche + catégories + filtres)
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faqSearch');
  const faqSearchClear = document.getElementById('faqSearchClear');
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
  const faqEmpty = document.getElementById('faqEmpty');
  const faqCounterText = document.getElementById('faqCounterText');

  let activeCategory = 'all';
  let searchQuery = '';

  // --- 5.1 Accordéon (ouverture / fermeture) ---
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Ferme tous les autres
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const q = other.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
          }
        });

        // Bascule l'état
        item.classList.toggle('open');
        question.setAttribute('aria-expanded', !isOpen);
      });
    }
  });

  // --- 5.2 Filtrage combiné (catégorie + recherche) ---
  function filterFaq() {
    let visibleCount = 0;

    faqItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
      const questionText = item.querySelector('.faq-question-text').textContent.toLowerCase();
      const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        keywords.includes(searchQuery) ||
        questionText.includes(searchQuery) ||
        answerText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        // Animation d'apparition
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = 'fadeIn 0.3s ease';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('open');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      }
    });

    // Message "aucun résultat"
    if (faqEmpty) {
      faqEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Mise à jour du compteur
    if (faqCounterText) {
      if (visibleCount === 0) {
        faqCounterText.textContent = 'Aucune question trouvée';
      } else if (visibleCount === 1) {
        faqCounterText.textContent = '1 question disponible';
      } else {
        faqCounterText.textContent = `${visibleCount} questions disponibles`;
      }
    }
  }

  // --- 5.3 Écoute de la recherche ---
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();

      if (faqSearchClear) {
        faqSearchClear.classList.toggle('visible', searchQuery.length > 0);
      }

      filterFaq();
    });
  }

  // --- 5.4 Effacer la recherche ---
  if (faqSearchClear) {
    faqSearchClear.addEventListener('click', () => {
      faqSearch.value = '';
      searchQuery = '';
      faqSearchClear.classList.remove('visible');
      faqSearch.focus();
      filterFaq();
    });
  }

  // --- 5.5 Filtres par catégorie ---
  faqCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterFaq();
    });
  });

  // 6. ONGLETS PREPARATION INSCRIPTION
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.preparation-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // 7. SÉLECTEUR DE LANGUE FR / EN
  const langButtons = document.querySelectorAll('.lang-btn');

  const translations = {
    fr: {
      accueil: 'Accueil',
      apropos: 'À propos',
      programmes: 'Nos programmes',
      galerie: 'Galerie',
      faq: 'FAQ',
      inscription: 'Inscription',
    },
    en: {
      accueil: 'Home',
      apropos: 'About',
      programmes: 'Our programs',
      galerie: 'Gallery',
      faq: 'FAQ',
      inscription: 'Enrollment',
    }
  };

  const savedLang = localStorage.getItem('cbp-lang') || 'fr';
  applyLang(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLang(lang);
      localStorage.setItem('cbp-lang', lang);
    });
  });

  function applyLang(lang) {
    langButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    const map = translations[lang] || translations.fr;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && map[key]) {
        el.textContent = map[key];
      }
    });

    document.documentElement.setAttribute('lang', lang);
  }

});