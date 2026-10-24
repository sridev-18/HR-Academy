/**
 * =============================================================================
 * HR SQUARE ACADEMY - LIGHTBOX JAVASCRIPT (lightbox.js)
 * Fullscreen photo & video modal viewer with keyboard navigation & ARIA support
 * =============================================================================
 */

'use strict';

const AcademyLightbox = {
  modalEl: null,
  overlayEl: null,
  closeBtn: null,
  prevBtn: null,
  nextBtn: null,
  mediaContainer: null,
  captionEl: null,
  currentIndex: -1,
  currentList: [],

  init() {
    this.modalEl = document.getElementById('lightboxModal');
    if (!this.modalEl) return;

    this.overlayEl = document.getElementById('lightboxOverlay');
    this.closeBtn = document.getElementById('lightboxClose');
    this.prevBtn = document.getElementById('lightboxPrev');
    this.nextBtn = document.getElementById('lightboxNext');
    this.mediaContainer = document.getElementById('lightboxMediaContainer');
    this.captionEl = document.getElementById('lightboxCaption');

    this.bindEvents();
    this.bindLightboxTriggers();
  },

  bindLightboxTriggers() {
    document.querySelectorAll('[data-lightbox-src]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const src = el.getAttribute('data-lightbox-src');
        const type = el.getAttribute('data-lightbox-type') || 'image';
        const caption = el.getAttribute('data-lightbox-caption') || '';
        this.open(src, type, caption);
      });
    });
  },

  bindEvents() {
    if (this.mediaContainer) {
      this.mediaContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigate(-1);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigate(1);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      }
    });
  },

  isOpen() {
    return this.modalEl && this.modalEl.classList.contains('active');
  },

  open(src, type = 'image', caption = '', list = [], index = -1) {
    if (!this.modalEl || !this.mediaContainer) return;

    this.currentList = list;
    this.currentIndex = index;

    this.renderMedia(src, type, caption);

    this.modalEl.classList.add('active');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-lock-scroll');

    // Show/hide nav buttons based on list length
    if (this.prevBtn && this.nextBtn) {
      const showNav = this.currentList.length > 1;
      this.prevBtn.classList.toggle('is-hidden', !showNav);
      this.prevBtn.classList.toggle('is-visible', showNav);
      this.nextBtn.classList.toggle('is-hidden', !showNav);
      this.nextBtn.classList.toggle('is-visible', showNav);
    }
  },

  renderMedia(src, type, caption) {
    this.mediaContainer.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.draggable = false;
      // Security deterrent: removes standard browser download button in supporting browsers (Chromium/WebKit).
      // Note: This is an interface deterrent only; network-level download prevention requires server-authenticated signed streams.
      video.setAttribute('controlsList', 'nodownload');
      video.addEventListener('contextmenu', (e) => e.preventDefault());
      this.mediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption || 'HR Square Academy';
      img.draggable = false;
      img.addEventListener('contextmenu', (e) => e.preventDefault());
      this.mediaContainer.appendChild(img);
    }

    if (this.captionEl) {
      this.captionEl.textContent = caption || '';
    }
  },

  close() {
    if (!this.modalEl) return;

    this.modalEl.classList.remove('active');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-lock-scroll');

    if (this.mediaContainer) {
      const video = this.mediaContainer.querySelector('video');
      if (video) video.pause();
      this.mediaContainer.innerHTML = '';
    }
  },

  navigate(direction) {
    if (!this.currentList.length || this.currentIndex === -1) return;

    const len = this.currentList.length;
    this.currentIndex = (this.currentIndex + direction + len) % len;
    const item = this.currentList[this.currentIndex];

    if (item) {
      this.renderMedia(item.src, item.type, item.title);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AcademyLightbox.init();
});

window.AcademyLightbox = AcademyLightbox;
