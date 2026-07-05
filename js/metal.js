document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const fadeElements = document.querySelectorAll('.fade-in');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  });

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

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const subject = encodeURIComponent(`Metal Scrap Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${formData.get('name')}\n` +
        `Company: ${formData.get('company')}\n` +
        `Email: ${formData.get('email')}\n` +
        `Phone: ${formData.get('phone')}\n` +
        `Material Interest: ${formData.get('product')}\n\n` +
        `Message:\n${formData.get('message')}`
      );
      window.location.href = `mailto:info@spaceenterprise.com?subject=${subject}&body=${body}`;
    });
  }

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
        ? 'var(--color-blue-light)'
        : '';
    });
  });

  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });
});
