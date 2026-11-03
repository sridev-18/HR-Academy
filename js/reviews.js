/**
 * =============================================================================
 * HR SQUARE ACADEMY - REVIEW CLIENT MODULE (reviews.js)
 * Clean, modern vanilla JavaScript connecting the static frontend
 * to the separate Django REST API & PostgreSQL backend.
 * =============================================================================
 */

'use strict';

/**
 * 1. Environment & API Configuration
 * Supports local development and production Render deployment.
 */
const API_CONFIG = {
  getBaseUrl() {
    if (window.REVIEW_API_BASE_URL) {
      return window.REVIEW_API_BASE_URL;
    }
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';
    return isLocal
      ? 'http://127.0.0.1:8000/api'
      : 'https://hr-square-reviews.onrender.com/api';
  },

  get reviewsEndpoint() {
    return `${this.getBaseUrl()}/reviews/`;
  },

  get summaryEndpoint() {
    return `${this.getBaseUrl()}/reviews/summary/`;
  }
};

/**
 * 2. Pure Helper Utilities
 */
function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getInitials(name) {
  if (!name) return 'HR';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function renderStarString(rating) {
  const score = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
  return '★'.repeat(score) + '☆'.repeat(5 - score);
}

function formatDate(isoString) {
  if (!isoString) return 'Recently';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

/**
 * 3. AcademyReviews Controller
 */
const AcademyReviews = {
  currentFilter: 'all',
  currentPage: 1,
  nextPageUrl: null,
  totalReviewsCount: 0,
  averageRating: 0.0,
  selectedRating: 5,
  isSubmitting: false,
  isLoading: false,
  lastFocusedElement: null,

  // DOM element caches
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.fetchSummary();
    this.fetchReviews(1, false);
  },

  cacheElements() {
    this.elements = {
      section: document.getElementById('reviews'),
      grid: document.getElementById('reviewsGrid'),
      filters: document.getElementById('reviewFilters'),
      summaryBar: document.getElementById('reviewsSummaryBar'),
      summaryAvgRating: document.getElementById('summaryAvgRating'),
      summaryStars: document.getElementById('summaryStars'),
      summaryTotalCount: document.getElementById('summaryTotalCount'),
      openModalBtn: document.getElementById('openReviewModalBtn'),
      modal: document.getElementById('reviewModal'),
      modalBackdrop: document.getElementById('reviewModalBackdrop'),
      closeModalBtn: document.getElementById('closeReviewModalBtn'),
      cancelBtn: document.getElementById('cancelReviewBtn'),
      submitBtn: document.getElementById('submitReviewBtn'),
      form: document.getElementById('reviewForm'),
      nameInput: document.getElementById('reviewAuthorName'),
      courseSelect: document.getElementById('reviewCourse'),
      messageInput: document.getElementById('reviewMessage'),
      charCount: document.getElementById('reviewCharCount'),
      starWidget: document.getElementById('starRatingWidget'),
      ratingInput: document.getElementById('reviewRating'),
      ratingScoreText: document.getElementById('ratingScoreText'),
      toast: document.getElementById('reviewToast'),
      loadMoreContainer: document.getElementById('reviewsLoadMoreContainer'),
      loadMoreBtn: document.getElementById('loadMoreReviewsBtn'),
      // Form inline errors
      nameError: document.getElementById('nameError'),
      courseError: document.getElementById('courseError'),
      ratingError: document.getElementById('ratingError'),
      messageError: document.getElementById('messageError'),
      generalFormError: document.getElementById('generalFormError')
    };
  },

  bindEvents() {
    // Open modal
    if (this.elements.openModalBtn) {
      this.elements.openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }

    // Close modal
    if (this.elements.closeModalBtn) {
      this.elements.closeModalBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.elements.modalBackdrop) {
      this.elements.modalBackdrop.addEventListener('click', () => this.closeModal());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });

    // Filters
    if (this.elements.filters) {
      this.elements.filters.querySelectorAll('.review-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const filter = btn.getAttribute('data-filter') || 'all';
          this.setFilter(filter, btn);
        });
      });
    }

    // Star rating widget
    if (this.elements.starWidget) {
      const starBtns = this.elements.starWidget.querySelectorAll('.star-btn');
      starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.getAttribute('data-star'), 10) || 5;
          this.setRating(val);
        });

        btn.addEventListener('mouseenter', () => {
          const hoverVal = parseInt(btn.getAttribute('data-star'), 10) || 5;
          this.previewRating(hoverVal);
        });
      });

      this.elements.starWidget.addEventListener('mouseleave', () => {
        this.previewRating(this.selectedRating);
      });
    }

    // Character counter
    if (this.elements.messageInput && this.elements.charCount) {
      this.elements.messageInput.addEventListener('input', () => {
        const len = this.elements.messageInput.value.length;
        this.elements.charCount.textContent = `${len} / 500`;
        if (len >= 20 && this.elements.messageError) {
          this.elements.messageError.classList.remove('is-visible');
        }
      });
    }

    // Clear input errors on change
    if (this.elements.nameInput) {
      this.elements.nameInput.addEventListener('input', () => {
        if (this.elements.nameInput.value.trim().length >= 2 && this.elements.nameError) {
          this.elements.nameError.classList.remove('is-visible');
        }
      });
    }
    if (this.elements.courseSelect) {
      this.elements.courseSelect.addEventListener('change', () => {
        if (this.elements.courseSelect.value && this.elements.courseError) {
          this.elements.courseError.classList.remove('is-visible');
        }
      });
    }

    // Load more button
    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.nextPageUrl && !this.isLoading) {
          this.fetchReviews(this.currentPage + 1, true);
        }
      });
    }

    // Form submit
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  },

  setFilter(filter, activeBtn) {
    if (this.currentFilter === filter) return;
    this.currentFilter = filter;

    if (this.elements.filters) {
      this.elements.filters.querySelectorAll('.review-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
    }
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
    }

    // Reset pagination and reload
    this.currentPage = 1;
    this.fetchReviews(1, false);
  },

  async fetchSummary() {
    try {
      const response = await fetch(API_CONFIG.summaryEndpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return;

      const data = await response.json();
      this.totalReviewsCount = data.total_reviews || 0;
      this.averageRating = data.average_rating || 0.0;
      this.renderSummary();
    } catch (err) {
      // Graceful degradation: silently ignore if summary endpoint is offline
      console.warn('Could not fetch review summary:', err);
    }
  },

  renderSummary() {
    const bar = this.elements.summaryBar;
    if (!bar) return;

    if (this.totalReviewsCount === 0) {
      bar.setAttribute('hidden', '');
      return;
    }

    bar.removeAttribute('hidden');
    if (this.elements.summaryAvgRating) {
      this.elements.summaryAvgRating.textContent = this.averageRating.toFixed(1);
    }
    if (this.elements.summaryStars) {
      this.elements.summaryStars.textContent = renderStarString(Math.round(this.averageRating));
    }
    if (this.elements.summaryTotalCount) {
      this.elements.summaryTotalCount.textContent = this.totalReviewsCount;
    }
  },

  async fetchReviews(page = 1, append = false) {
    const grid = this.elements.grid;
    if (!grid) return;

    this.isLoading = true;
    if (!append) {
      grid.innerHTML = `
        <div class="reviews-loading-state" aria-live="polite">
          <div class="spinner"></div>
          <p>Loading parent &amp; student reviews...</p>
        </div>
      `;
    }

    // Build URL with optional filters and page
    let url = `${API_CONFIG.reviewsEndpoint}?page=${page}`;
    if (this.currentFilter === 'parent') {
      url += '&type=Parent';
    } else if (this.currentFilter === 'student') {
      url += '&type=Student';
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data = await response.json();
      this.currentPage = page;
      this.nextPageUrl = data.next;

      if (!append) {
        grid.innerHTML = '';
      }

      const results = data.results || [];

      if (!append && results.length === 0) {
        this.renderEmptyState();
        this.updateLoadMoreButton();
        this.isLoading = false;
        return;
      }

      // Render cards
      results.forEach(item => {
        const card = this.createReviewCard(item);
        grid.appendChild(card);
      });

      this.updateLoadMoreButton();
    } catch (err) {
      console.warn('Reviews API unreachable or offline:', err);
      if (!append) {
        this.renderOfflineFallback();
      }
    } finally {
      this.isLoading = false;
    }
  },

  createReviewCard(item) {
    const card = document.createElement('article');
    card.className = 'review-card animate-on-scroll is-visible';
    card.setAttribute('data-reviewer-type', (item.reviewer_type || 'Parent').toLowerCase());

    const isParent = (item.reviewer_type || '').toLowerCase() === 'parent';
    const roleBadgeClass = isParent ? 'badge-parent' : 'badge-student';
    const roleEmoji = isParent ? '👨‍👩‍👦' : '🎓';
    const initials = getInitials(item.reviewer_name);
    const starString = renderStarString(item.rating);
    const dateFormatted = formatDate(item.created_at);

    card.innerHTML = `
      <div class="review-card-header">
        <div class="reviewer-avatar" aria-hidden="true">${escapeHTML(initials)}</div>
        <div class="reviewer-meta">
          <h4 class="reviewer-name">${escapeHTML(item.reviewer_name)}</h4>
          <div class="reviewer-sub-row">
            <span class="reviewer-type-badge ${roleBadgeClass}">${roleEmoji} ${escapeHTML(item.reviewer_type || 'Parent')}</span>
            <span class="review-date">${escapeHTML(dateFormatted)}</span>
          </div>
        </div>
      </div>

      <div class="review-course-badge">
        <span>📚</span> <span>${escapeHTML(item.course)}</span>
      </div>

      <div class="review-rating-row" aria-label="Rating: ${item.rating} out of 5 stars">
        <span class="review-stars-gold" aria-hidden="true">${starString}</span>
        <span class="review-score">${Number(item.rating).toFixed(1)} / 5.0</span>
      </div>

      <div class="review-body">
        <p class="review-text">${escapeHTML(item.review_text)}</p>
      </div>

      <div class="review-card-footer">
        <span class="review-verified-pill" title="Verified review stored in academy database">
          <span>✓</span> Verified Academy Feedback
        </span>
      </div>
    `;

    return card;
  },

  renderEmptyState() {
    const grid = this.elements.grid;
    if (!grid) return;

    grid.innerHTML = `
      <div class="reviews-empty-state animate-on-scroll is-visible">
        <div class="empty-icon-wrap" aria-hidden="true">
          <span class="empty-stars">★★★★★</span>
        </div>
        <h3 class="empty-title">Be the First to Share Your Experience!</h3>
        <p class="empty-desc">
          Have you or your child enrolled in <strong>Abacus, Vedic Maths, Written &amp; Spoken Hindi</strong>, or <strong>Maths Tuition</strong> at HR Square Academy? We welcome genuine feedback from all our students and parents.
        </p>
        <button class="btn btn-primary empty-cta" type="button" id="emptyStateWriteBtn">
          <span>✍️</span> Write a Review
        </button>
      </div>
    `;

    const emptyBtn = grid.querySelector('#emptyStateWriteBtn');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }
  },

  renderOfflineFallback() {
    const grid = this.elements.grid;
    if (!grid) return;

    grid.innerHTML = `
      <div class="reviews-offline-banner animate-on-scroll is-visible">
        <div class="offline-icon">💬</div>
        <h3>Parent &amp; Student Reviews</h3>
        <p>
          We are currently connecting with the review service. If you would like to share your feedback or enquire about admissions, please reach out directly via WhatsApp.
        </p>
        <div class="offline-actions">
          <button class="btn btn-primary" type="button" id="offlineWriteBtn">
            <span>✍️</span> Write a Review
          </button>
          <a class="btn btn-whatsapp" href="https://wa.me/919578532710?text=Hello%20HR%20Square%20Academy,%20I%20would%20like%20to%20share%20feedback%20regarding%20classes." target="_blank" rel="noopener noreferrer">
            <span>💬</span> Share on WhatsApp
          </a>
        </div>
      </div>
    `;

    const writeBtn = grid.querySelector('#offlineWriteBtn');
    if (writeBtn) {
      writeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }
  },

  updateLoadMoreButton() {
    const container = this.elements.loadMoreContainer;
    if (!container) return;

    if (this.nextPageUrl) {
      container.removeAttribute('hidden');
    } else {
      container.setAttribute('hidden', '');
    }
  },

  setRating(rating) {
    this.selectedRating = rating;
    if (this.elements.ratingInput) {
      this.elements.ratingInput.value = rating;
    }
    if (this.elements.ratingScoreText) {
      this.elements.ratingScoreText.textContent = `${rating} out of 5 Stars`;
    }
    this.previewRating(rating);
    if (this.elements.ratingError) {
      this.elements.ratingError.classList.remove('is-visible');
    }
  },

  previewRating(val) {
    if (!this.elements.starWidget) return;
    const starBtns = this.elements.starWidget.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
      const starNum = parseInt(btn.getAttribute('data-star'), 10) || 1;
      if (starNum <= val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  openModal() {
    this.lastFocusedElement = document.activeElement;
    if (!this.elements.modal) return;

    this.elements.modal.classList.add('active');
    this.elements.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-lock-scroll');

    this.clearErrors();

    setTimeout(() => {
      if (this.elements.nameInput) {
        this.elements.nameInput.focus();
      }
    }, 100);
  },

  closeModal() {
    if (!this.elements.modal) return;

    this.elements.modal.classList.remove('active');
    this.elements.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-lock-scroll');

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  },

  isModalOpen() {
    return this.elements.modal && this.elements.modal.classList.contains('active');
  },

  clearErrors() {
    [
      this.elements.nameError,
      this.elements.courseError,
      this.elements.ratingError,
      this.elements.messageError,
      this.elements.generalFormError
    ].forEach(el => {
      if (el) {
        el.classList.remove('is-visible');
        el.textContent = '';
      }
    });
  },

  async handleSubmit() {
    if (this.isSubmitting) return;

    this.clearErrors();

    const name = (this.elements.nameInput ? this.elements.nameInput.value : '').trim();
    const course = this.elements.courseSelect ? this.elements.courseSelect.value : '';
    const message = (this.elements.messageInput ? this.elements.messageInput.value : '').trim();
    const rating = parseInt(this.elements.ratingInput ? this.elements.ratingInput.value : '5', 10) || 5;

    // Reviewer type
    let reviewerType = 'Parent';
    const typeChecked = document.querySelector('input[name="reviewerType"]:checked');
    if (typeChecked) {
      reviewerType = typeChecked.value;
    }

    let hasError = false;

    if (name.length < 2) {
      if (this.elements.nameError) {
        this.elements.nameError.textContent = 'Please enter your name (minimum 2 characters).';
        this.elements.nameError.classList.add('is-visible');
      }
      if (this.elements.nameInput) this.elements.nameInput.focus();
      hasError = true;
    }

    if (!course) {
      if (this.elements.courseError) {
        this.elements.courseError.textContent = 'Please select a course.';
        this.elements.courseError.classList.add('is-visible');
      }
      if (!hasError && this.elements.courseSelect) this.elements.courseSelect.focus();
      hasError = true;
    }

    if (rating < 1 || rating > 5) {
      if (this.elements.ratingError) {
        this.elements.ratingError.textContent = 'Please select a star rating between 1 and 5.';
        this.elements.ratingError.classList.add('is-visible');
      }
      hasError = true;
    }

    if (message.length < 20) {
      if (this.elements.messageError) {
        this.elements.messageError.textContent = 'Please share at least 20 characters about your experience.';
        this.elements.messageError.classList.add('is-visible');
      }
      if (!hasError && this.elements.messageInput) this.elements.messageInput.focus();
      hasError = true;
    }

    if (hasError) return;

    // Payload for Django REST API
    const payload = {
      reviewer_name: name,
      reviewer_type: reviewerType,
      course: course,
      rating: rating,
      review_text: message
    };

    // UI Loading state to prevent multiple accidental submissions
    this.setSubmittingState(true);

    try {
      const response = await fetch(API_CONFIG.reviewsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Backend serializer validation errors
        let errorMsg = 'Failed to submit review. Please check the inputs.';
        if (responseData && typeof responseData === 'object') {
          const firstKey = Object.keys(responseData)[0];
          if (Array.isArray(responseData[firstKey])) {
            errorMsg = responseData[firstKey][0];
          } else if (typeof responseData[firstKey] === 'string') {
            errorMsg = responseData[firstKey];
          }
        }
        if (this.elements.generalFormError) {
          this.elements.generalFormError.textContent = errorMsg;
          this.elements.generalFormError.classList.add('is-visible');
        }
        return;
      }

      // Success
      this.closeModal();
      if (this.elements.form) {
        this.elements.form.reset();
      }
      this.setRating(5);
      if (this.elements.charCount) {
        this.elements.charCount.textContent = '0 / 500';
      }

      // Show success toast
      this.showToast(`Thank you, ${escapeHTML(name)}! Your review has been saved in PostgreSQL and is now live.`);

      // Refresh data
      this.fetchSummary();
      this.fetchReviews(1, false);
    } catch (err) {
      console.error('Error submitting review to backend:', err);
      if (this.elements.generalFormError) {
        this.elements.generalFormError.textContent =
          'The review service was warming up. It is online now — please click "Submit Review" again!';
        this.elements.generalFormError.classList.add('is-visible');
      }
    } finally {
      this.setSubmittingState(false);
    }
  },

  setSubmittingState(submitting) {
    this.isSubmitting = submitting;
    const btn = this.elements.submitBtn;
    if (!btn) return;

    if (submitting) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-sm"></span> Submitting Review...`;
    } else {
      btn.disabled = false;
      btn.innerHTML = `<span>🚀</span> Submit Review`;
    }
  },

  showToast(message) {
    const toast = this.elements.toast;
    if (!toast) return;

    toast.innerHTML = `<span>✓</span> ${message}`;
    toast.removeAttribute('hidden');
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.setAttribute('hidden', ''), 300);
    }, 6000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AcademyReviews.init();
});

window.AcademyReviews = AcademyReviews;
