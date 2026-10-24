# HR Square Academy — Modern Website Platform (Phase 1)

Modern, responsive, accessible academy website for **HR Square Academy**, upgraded from the basic single-file layout (`hr_square_academy.html`) while strictly preserving its original navy-blue and gold visual identity, section order, copy, and layout.

---

## 1. Project Overview & Brand Identity

**HR Square Academy** is an authorised training centre offering expert coaching in mental arithmetic, speed calculation, school mathematics, and language proficiency:
* **Abacus:** Structured mental calculation, focus, speed, and accuracy practice.
* **Vedic Maths:** High-speed mental calculation shortcuts and problem-solving.
* **Written Hindi:** Step-by-step reading, writing, vocabulary, and grammar.
* **Spoken Hindi:** Everyday conversational fluency and practical dialogue.
* **Maths Tuition:** Concept-based coaching for Classes 5th–12th (CBSE, State Board, ICSE, and IGCSE).

### Academy Details & Verified Credentials
* **Centre Head & Certified Trainer:** **Ms. S. Roopakokila**
  * Certified International Abacus Trainer (**Grade A+**) — IIVA / AVAS
  * Certified International Vedic Maths Trainer (**Grade A**) — IIVA / AVAS
  * Certified Professional Art & Craft Instructor
  * Authorised Skill Centre in Abacus & Vedic Maths (Approved Training Partner of NSDC Skill India)
* **Location:** Valluvar Nagar South, near Pugazhi Mandabam, Velayuthampalayam, Karur, Tamil Nadu
* **Contact Phone / WhatsApp:** `9578532710`
* **Brand Colours:** Navy Blue (`#153b8f`, `#0d2862`), Accent Gold (`#e5a500`), and Highlights (`#e09b00`)
* **Reference Backup:** `hr_square_academy.html` (preserved intact)

---

## 2. Project File Structure

```text
HR-SQUARE-ACADEMY/
│
├── index.html                      # Main entry point with full Phase 1 features & exact styling
├── hr_square_academy.html          # Verbatim backup of original working website
├── README.md                       # Comprehensive documentation & developer guide
├── .gitignore                      # Git ignore rules for OS and editor temporary files
│
├── css/
│   ├── style.css                   # Navy-blue & gold tokens, components, faculty & gallery styles
│   ├── responsive.css              # Breakpoints for tablet (<= 800px) and mobile (<= 500px)
│   └── animations.css              # Subtle transitions, lightbox zoom, and reduced-motion guard
│
├── js/
│   ├── main.js                     # Header scroll elevation, navigation, and smooth scroll
│   ├── gallery.js                  # Dynamic category filtering (Classroom, Activities, Events, Videos)
│   └── lightbox.js                 # Fullscreen photo and video preview modal with keyboard & ARIA
│
└── assets/
    ├── images/
    │   ├── logo/                   # Academy brand logo files
    │   ├── teachers/               # Certified educator credentials & portraits
    │   ├── courses/                # Course-specific graphics
    │   └── gallery/                # 40 real academy photos (classroom, activities, events)
    │
    └── videos/                     # 11 real academy demonstration & practice videos
```

---

## 3. Implemented Phase 1 Features

### A. Photo & Video Gallery with Dynamic JavaScript Filtering
* **40 Real Academy Photos & 11 Videos:** Integrated directly from client assets into `assets/images/gallery/` and `assets/videos/`.
* **Category Tabs (`gallery.js`):**
  * **All:** Complete overview of all media.
  * **Classroom:** Abacus sessions, finger arithmetic drills, student desks, and tuition classes.
  * **Activities & Crafts:** Student-made keychains, art & craft displays, and puppet shows.
  * **Events & Celebrations:** Student, teacher, and parent gatherings.
  * **Certificates:** Verified diplomas and training credentials from IIVA / AVAS / NSDC.
  * **Videos:** Student mental calculation speed demos, abacus rapid-fire practice, and activities.
* **Full-Screen Lightbox Modal (`lightbox.js`):**
  * Supports high-resolution images and HTML5 `<video controls autoplay>`.
  * Keyboard support (`Escape` to close, `ArrowLeft` / `ArrowRight` to navigate).
  * Video automatically stops playing when the modal is closed.

### B. Certified Educator Section
* Dedicated profile for **Ms. S. Roopakokila** detailing her Grade 'A+' Abacus and Grade 'A' Vedic Maths international trainer certifications.
* Interactive certificate cards that open high-resolution certificate scans directly in the Lightbox viewer.
* "Consult with Trainer" direct WhatsApp enquiry button.

### C. Direct WhatsApp Click-to-Chat & Call Actions
* **Phone Call Links:** `tel:9578532710` in header, hero, and contact section.
* **Course-Specific WhatsApp Actions:** Each of the 5 course cards features a direct WhatsApp button with pre-filled enquiry text (e.g. *"Hello HR Square Academy, I would like to enquire about Abacus classes."*).
* **Floating WhatsApp Button:** Unobtrusive, accessible WhatsApp quick-chat action fixed at the bottom right.

---

## 4. Instructions for Opening the Website Locally

This website requires no compilers, build steps, or server runtimes.

### Option 1: Direct File Preview
Double-click `index.html` or drag it into Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: VS Code Live Server
1. Open the `HR-SQUARE-ACADEMY` folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Python Local HTTP Server
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 5. Technical Stack & Guarantees

* **Pure Vanilla Technologies:** 100% HTML5, CSS3, and modern ES6 JavaScript.
* **Zero Frameworks:** No React, Vue, Angular, Bootstrap, Tailwind, or jQuery.
* **Zero Backend Costs:** Operates as a static site suitable for free hosting on GitHub Pages, Netlify, Vercel, or Cloudflare Pages.
* **Original File Preserved:** `hr_square_academy.html` is preserved intact as reference.
