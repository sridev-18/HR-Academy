/**
 * =============================================================================
 * HR SQUARE ACADEMY - MAIN JAVASCRIPT (main.js)
 * Clean, lightweight vanilla JavaScript for interactive components
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. DOM Elements ---
  const header = document.getElementById('header');
  const navHamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const scrollTopBtn = document.getElementById('scrollTop');
  const navBackdrop = document.getElementById('navBackdrop');

  // --- 2. Mobile Navigation Toggle ---
  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('nav-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navLinks.classList.add('nav-open');
    navHamburger.classList.add('active');
    navHamburger.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('body-lock-scroll');
  }

  function closeMobileMenu() {
    navLinks.classList.remove('nav-open');
    navHamburger.classList.remove('active');
    navHamburger.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('body-lock-scroll');
  }

  if (navHamburger) {
    navHamburger.addEventListener('click', toggleMobileMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking any nav link
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // --- 3. Header Scroll Effect & Scroll-To-Top Button ---
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header elevation
    if (header) {
      if (scrollY > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active navigation link tracking
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. Active Navigation Tracking ---
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollPosition = (window.scrollY || window.pageYOffset) + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollPosition >= top && scrollPosition < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // --- 5. Scroll-Triggered Reveal Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  // Image Fallback Handling (Unobtrusive, eliminates inline onerror handlers)
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', function() {
      if (this.dataset.fallback && this.src !== this.dataset.fallback) {
        this.src = this.dataset.fallback;
      }
    }, { once: true });
  });

  // Initial trigger on load
  handleScroll();
});
