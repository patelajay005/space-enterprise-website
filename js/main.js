document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const contactForm = document.getElementById('contact-form');
  const fadeElements = document.querySelectorAll('.fade-in');
  const carousel = document.querySelector('.products-carousel');
  const track = document.querySelector('.products-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  const productModal = document.getElementById('product-modal');
  const modalClose = document.querySelector('.product-modal-close');
  const modalBackdrop = document.querySelector('.product-modal-backdrop');

  let currentIndex = 0;
  let carouselTimer = null;
  const CAROUSEL_INTERVAL = 4000;

  // Header scroll effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  function getVisibleCards() {
    return Array.from(productCards).filter(card => !card.classList.contains('hidden'));
  }

  function getMaxIndex() {
    const visible = getVisibleCards();
    return Math.max(0, visible.length - getSlidesPerView());
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getMaxIndex() + 1;

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${i === currentIndex ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetCarouselTimer();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    if (!track) return;

    const visible = getVisibleCards();
    const maxIndex = getMaxIndex();

    if (currentIndex > maxIndex) currentIndex = 0;

    if (visible.length === 0) {
      track.style.transform = 'translateX(0)';
      buildDots();
      return;
    }

    const cardWidth = visible[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goNext() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function goPrev() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }

  function startCarouselTimer() {
    stopCarouselTimer();
    carouselTimer = setInterval(goNext, CAROUSEL_INTERVAL);
  }

  function stopCarouselTimer() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  function resetCarouselTimer() {
    stopCarouselTimer();
    startCarouselTimer();
  }

  // Product filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      productCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
      });

      currentIndex = 0;
      buildDots();
      updateCarousel();
      resetCarouselTimer();
    });
  });

  // Carousel controls
  prevBtn?.addEventListener('click', () => {
    goPrev();
    resetCarouselTimer();
  });

  nextBtn?.addEventListener('click', () => {
    goNext();
    resetCarouselTimer();
  });

  carousel?.addEventListener('mouseenter', stopCarouselTimer);
  carousel?.addEventListener('mouseleave', startCarouselTimer);

  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  // Product detail modal
  function openProductModal(card) {
    if (!productModal || !card) return;

    const image = card.querySelector('.product-image img');
    const titleEl = card.querySelector('h3');
    const category = card.querySelector('.product-category')?.textContent || '';
    const title = titleEl?.textContent || '';
    const desc = card.querySelector('.product-desc')?.textContent || '';
    const tags = card.querySelectorAll('.product-tag');
    const modalImage = document.getElementById('product-modal-image');
    const modalTitle = document.getElementById('product-modal-title');

    if (image && modalImage) {
      modalImage.innerHTML = `<img src="${image.getAttribute('src')}" alt="${image.getAttribute('alt') || title}">`;
    } else if (modalImage) {
      modalImage.innerHTML = '';
    }

    document.getElementById('product-modal-category').textContent = category;
    if (modalTitle) {
      modalTitle.innerHTML = titleEl?.innerHTML || title;
    }
    document.getElementById('product-modal-desc').textContent = desc;

    const tagsContainer = document.getElementById('product-modal-tags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'product-tag';
      span.textContent = tag.textContent;
      tagsContainer.appendChild(span);
    });

    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    stopCarouselTimer();
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    startCarouselTimer();
  }

  document.querySelectorAll('.product-image').forEach(imageBtn => {
    imageBtn.addEventListener('click', () => {
      openProductModal(imageBtn.closest('.product-card'));
    });
  });

  modalClose?.addEventListener('click', closeProductModal);
  modalBackdrop?.addEventListener('click', closeProductModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && productModal?.classList.contains('open')) {
      closeProductModal();
    }
  });

  // Scroll animations
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));

  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const product = formData.get('product');

      const subject = encodeURIComponent(`Product Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${formData.get('name')}\n` +
        `Company: ${formData.get('company')}\n` +
        `Email: ${formData.get('email')}\n` +
        `Phone: ${formData.get('phone')}\n` +
        `Product Interest: ${product}\n\n` +
        `Message:\n${formData.get('message')}`
      );

      window.location.href = `mailto:info@spaceenterprise.com?subject=${subject}&body=${body}`;
    });
  }

  // Set active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--color-blue)'
        : '';
    });
  });

  // Professional page entrance
  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });

  // Init carousel
  buildDots();
  updateCarousel();
  startCarouselTimer();
});
