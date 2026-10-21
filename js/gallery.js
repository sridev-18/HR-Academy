/**
 * =============================================================================
 * HR SQUARE ACADEMY - GALLERY JAVASCRIPT (gallery.js)
 * Accurate categorization for Field Trips, Classroom, Art & Crafts,
 * Celebrations, Certificates, and Videos with dynamic filter & Lightbox
 * =============================================================================
 */

'use strict';

const AcademyGallery = {
  currentFilter: 'all',

  // Accurate dataset of all academy media assets
  items: [
    // --- 1. EDUCATIONAL TOUR & FIELD TRIPS ---
    {
      id: 'trip-1',
      title: 'Academy Educational Field Trip — Hill Station Viewpoint',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (4).jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-2',
      title: 'Students & Teachers at Mountain Valley Viewpoint',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (3).jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-3',
      title: 'Tour Bus Arrival & Scenic Mountain Overlook',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM.jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-4',
      title: 'Students Group Photo at Scenic Hill Excursion',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (5).jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-5',
      title: 'Field Trip Excursion Walk & Memorable Moments',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (1).jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-6',
      title: 'Excursion Group Posing in Front of Heritage Wall Art',
      category: 'trip',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (2).jpeg'),
      tag: 'Field Trip'
    },
    {
      id: 'trip-8',
      title: 'Hill Station Excursion Moments Video',
      category: 'trip',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.16.17 PM (1).mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (1).jpeg'),
      tag: 'Trip Video'
    },
    {
      id: 'trip-9',
      title: 'Academy Tour Gazebo & Nature Garden Video',
      category: 'trip',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.16.17 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.16.17 PM (2).jpeg'),
      tag: 'Trip Video'
    },

    // --- 2. CLASSROOM & ABACUS LEARNING ---
    {
      id: 'class-1',
      title: 'Full Abacus Classroom Training Session in Purple Uniforms',
      category: 'classroom',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.14.00 PM.jpeg'),
      tag: 'Classroom'
    },
    {
      id: 'class-2',
      title: 'Student Blackboard Abacus Calculation Demonstration Video',
      category: 'classroom',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.10.34 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.14.00 PM.jpeg'),
      tag: 'Classroom Video'
    },

    // --- 3. ART, CRAFT & CREATIVE ACTIVITIES ---
    {
      id: 'craft-1',
      title: 'Handcrafted Wooden Painted Keychains by Students',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (18).jpeg'),
      tag: 'Art & Craft'
    },
    {
      id: 'craft-2',
      title: 'Hand-Woven Colourful Decorative Baskets',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (15).jpeg'),
      tag: 'Art & Craft'
    },
    {
      id: 'craft-3',
      title: 'Children Displaying Handcrafted Keychains',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (16).jpeg'),
      tag: 'Art & Craft'
    },
    {
      id: 'craft-4',
      title: 'Close-Up of Student-Made Decorative Keychains',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (17).jpeg'),
      tag: 'Art & Craft'
    },
    {
      id: 'craft-5',
      title: 'Geometric Mandala Artworks & Symmetry Drawings',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (10).jpeg'),
      tag: 'Drawing & Art'
    },
    {
      id: 'craft-6',
      title: 'Origami 3D Paper Fish & Butterfly Craft Exhibition',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (11).jpeg'),
      tag: 'Origami Craft'
    },
    {
      id: 'craft-7',
      title: 'Students Presenting Creative Paper Fish Models',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (12).jpeg'),
      tag: 'Origami Craft'
    },
    {
      id: 'craft-8',
      title: 'Bright Paper Fan Creations by Young Learners',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (13).jpeg'),
      tag: 'Paper Craft'
    },
    {
      id: 'craft-9',
      title: 'Woven Mat Geometry & Paper Craft Exercises',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (4).jpeg'),
      tag: 'Paper Craft'
    },
    {
      id: 'craft-10',
      title: 'Handmade Origami Butterflies & Paper Flowers',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (5).jpeg'),
      tag: 'Origami Craft'
    },
    {
      id: 'craft-11',
      title: 'Colourful Paper Flower Bouquets Crafted by Students',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (6).jpeg'),
      tag: 'Art & Craft'
    },
    {
      id: 'craft-12',
      title: 'Puppet Show Theatre Stage & Doll Storytelling',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.22.07 PM.jpeg'),
      tag: 'Puppet Theatre'
    },
    {
      id: 'craft-13',
      title: 'Students Watching Interactive Puppet Storytelling',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.22.08 PM (1).jpeg'),
      tag: 'Puppet Theatre'
    },
    {
      id: 'craft-14',
      title: 'Live Puppet Show Performance Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.22.23 PM (1).mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.22.07 PM.jpeg'),
      tag: 'Puppet Video'
    },
    {
      id: 'craft-15',
      title: 'Miniature Clay Modelling: Ice Creams & Desserts Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.24 PM (1).mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (15).jpeg'),
      tag: 'Clay Modelling'
    },
    {
      id: 'craft-16',
      title: 'Natural Grain & Pulse Seed Mosaic Tree Artwork Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.24 PM (3).mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (10).jpeg'),
      tag: 'Seed Art'
    },
    {
      id: 'craft-17',
      title: "Special Teacher's Day Card Making Video",
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.11.57 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (11).jpeg'),
      tag: "Teacher's Day"
    },
    {
      id: 'craft-17b',
      title: 'Students Creative Drawing & Art Line-up Exhibition Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.23 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (1).jpeg'),
      tag: 'Drawing Video'
    },
    {
      id: 'craft-17c',
      title: 'Handcrafted Clay Sweets & Dessert Creations Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.24 PM (2).mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (15).jpeg'),
      tag: 'Clay Modelling'
    },
    {
      id: 'craft-17d',
      title: 'Student Watermelon & Shading Art Showcase Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.24 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (10).jpeg'),
      tag: 'Art & Drawing'
    },
    {
      id: 'craft-17e',
      title: 'Natural Grain & Pulse Seed Waterfall Art Showcase Video',
      category: 'activities',
      type: 'video',
      src: 'assets/videos/' + encodeURIComponent('WhatsApp Video 2026-10-11 at 12.24.25 PM.mp4'),
      poster: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (11).jpeg'),
      tag: 'Seed Art Video'
    },
    {
      id: 'craft-18',
      title: 'Outdoor Garden Sketching & Coloring Activity',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (1).jpeg'),
      tag: 'Creative Activity'
    },
    {
      id: 'craft-19',
      title: 'Board Game & Strategic Chess Thinking Session',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (3).jpeg'),
      tag: 'Brain Games'
    },
    {
      id: 'craft-20',
      title: 'Students Showcasing Creative Seed Mosaic & Craft Artworks',
      category: 'activities',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-11 at 12.24.19 PM (1).jpeg'),
      tag: 'Activity'
    },

    // --- 4. EVENTS & CELEBRATIONS ---
    {
      id: 'evt-1',
      title: 'Bolchal Spoken Hindi Examination Day — Students & Faculty Gathering',
      category: 'events',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM.jpeg'),
      tag: 'Spoken Hindi Exam'
    },
    {
      id: 'evt-2',
      title: 'Hand-Decorated Festive Clay Diyas & Painted Pots',
      category: 'events',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.47.16 PM (1).jpeg'),
      tag: 'Festive Art'
    },
    {
      id: 'evt-3',
      title: 'Celebration Moment with Funky Paper Eyewear & Props',
      category: 'events',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.47.16 PM.jpeg'),
      tag: 'Celebration'
    },
    {
      id: 'evt-4',
      title: 'Creative Student Paper Masks Presentation',
      category: 'events',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.47.17 PM.jpeg'),
      tag: 'Celebration'
    },
    {
      id: 'evt-5',
      title: 'Student Milestone & Art Display with Teacher',
      category: 'events',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-09 at 12.46.22 PM (14).jpeg'),
      tag: 'Academy Event'
    },

    // --- 5. CERTIFICATES & CREDENTIALS ---
    {
      id: 'cert-student-1',
      title: 'State Level Championship 2026 Batch Topper (First Position) — Karani V S (STVM-0 Level)',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/karani_certificate.jpg',
      tag: 'Student Achievement'
    },
    {
      id: 'cert-1',
      title: 'International Abacus Teacher Training Certificate (Grade A+)',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-14 at 10.04.01 PM.jpeg'),
      tag: 'Certificate'
    },
    {
      id: 'cert-2',
      title: 'International Vedic Maths Teacher Training Certificate (Grade A)',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-14 at 10.04.00 PM.jpeg'),
      tag: 'Certificate'
    },
    {
      id: 'cert-3',
      title: 'Authorised Skill Centre in Abacus — HR Square Academy',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-14 at 10.04.01 PM (2).jpeg'),
      tag: 'Authorisation'
    },
    {
      id: 'cert-4',
      title: 'Authorised Skill Centre in Vedic Maths — HR Square Academy',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-14 at 10.04.01 PM (3).jpeg'),
      tag: 'Authorisation'
    },
    {
      id: 'cert-5',
      title: 'Professional Art & Craft Instructor Certificate',
      category: 'certificates',
      type: 'image',
      src: 'assets/images/gallery/' + encodeURIComponent('WhatsApp Image 2026-10-14 at 10.04.01 PM (1).jpeg'),
      tag: 'Certificate'
    }
  ],

  init() {
    this.initCategoryFilters();
    this.render();
  },

  initCategoryFilters() {
    const filterButtons = document.querySelectorAll('#galleryFilters .filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const filter = target.getAttribute('data-filter') || 'all';

        filterButtons.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        this.currentFilter = filter;
        this.render();
      });
    });
  },

  getFilteredItems() {
    if (this.currentFilter === 'all') {
      return this.items;
    }
    if (this.currentFilter === 'videos') {
      return this.items.filter(item => item.type === 'video');
    }
    return this.items.filter(item => item.category === this.currentFilter);
  },

  render() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const filtered = this.getFilteredItems();
    grid.innerHTML = '';

    if (!filtered.length) {
      grid.innerHTML = '<p class="gallery-empty-msg">No media found in this category.</p>';
      return;
    }

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card fade-in';
      card.setAttribute('data-category', item.category);

      const thumbSrc = item.type === 'video' ? (item.poster || item.src) : item.src;

      card.innerHTML = `
        <div class="gallery-card-thumb">
          <img src="${thumbSrc}" alt="${item.title}" loading="lazy">
          ${item.type === 'video' ? '<div class="video-play-badge" aria-hidden="true">▶</div>' : ''}
          <span class="gallery-badge ${item.category === 'trip' ? 'badge-trip' : ''}">${item.tag}</span>
        </div>
        <div class="gallery-card-body">
          <h4 class="gallery-card-title">${item.title}</h4>
        </div>
      `;

      card.addEventListener('click', () => {
        if (window.AcademyLightbox) {
          window.AcademyLightbox.open(item.src, item.type, item.title, filtered, index);
        }
      });

      grid.appendChild(card);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AcademyGallery.init();
});

window.AcademyGallery = AcademyGallery;
