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
  },

  bindEvents() {
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
    document.body.style.overflow = 'hidden';

    // Show/hide nav buttons based on list length
    if (this.prevBtn && this.nextBtn) {
      const showNav = this.currentList.length > 1;
      this.prevBtn.style.display = showNav ? 'flex' : 'none';
      this.nextBtn.style.display = showNav ? 'flex' : 'none';
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
      video.style.maxWidth = '100%';
      video.style.maxHeight = '75vh';
      this.mediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption || 'HR Square Academy';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '75vh';
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
    document.body.style.overflow = '';

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
