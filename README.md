# HR Square Academy — Website & Parent/Student Review Platform

Modern, responsive, high-performance web platform for **HR Square Academy**, combining a lightning-fast static academy website with a dedicated, decoupled Python/Django REST API microservice and PostgreSQL database for verified parent and student reviews.

---

## 1. Academy Overview & Verified Credentials

**HR Square Academy** is an authorised training centre offering expert coaching in mental arithmetic, speed calculation, school mathematics, and language proficiency:
* **Abacus:** Structured mental calculation, focus, speed, and accuracy practice.
* **Vedic Maths:** High-speed mental calculation shortcuts and problem-solving.
* **Written Hindi:** Step-by-step reading, writing, vocabulary, and grammar.
* **Spoken Hindi:** Everyday conversational fluency and practical dialogue.
* **Maths Tuition:** Concept-based coaching for Classes 5th–12th (CBSE, State Board, ICSE, and IGCSE).

### Centre Details & Credentials
* **Centre Head & Certified Trainer:** **Ms. S. Roopakokila**
  * Certified International Abacus Trainer (**Grade A+**) — IIVA / AVAS
  * Certified International Vedic Maths Trainer (**Grade A**) — IIVA / AVAS
  * Certified Professional Art & Craft Instructor
  * Authorised Skill Centre in Abacus & Vedic Maths (Approved Training Partner of NSDC Skill India)
* **Campus Address:** Valluvar Nagar South, near Pugazhi Mandabam, Velayuthampalayam, Karur, Tamil Nadu
* **Contact / Direct WhatsApp:** `+91 95785 32710`
* **Live Website:** [https://hr-square-academy.onrender.com/](https://hr-square-academy.onrender.com/)
* **Brand Colours:** Navy Blue (`#153b8f`, `#0d2862`), Accent Gold (`#e5a500`), and Highlights (`#e09b00`)

---

## 2. Platform Architecture

The platform follows a **decoupled, hybrid microservice architecture**:

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                       │
│  (Desktop, Tablet, Mobile — HTML5 / CSS3 / Vanilla JS)  │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│       STATIC SITE         │ │     REVIEW REST API       │
│  (Render / CDN Hosting)   │ │   (Django / DRF Web App)  │
│                           │ │                           │
│  • index.html             │ │  • GET  /api/reviews/     │
│  • css/style.css          │ │  • POST /api/reviews/     │
│  • js/main.js, gallery.js │ │  • GET  /api/reviews/     │
│  • js/reviews.js          │ │         summary/          │
│  • assets/ (media)        │ │  • Scoped rate limiting   │
│  • 100% Cacheable & Fast  │ │  • XSS input sanitisation │
└───────────────────────────┘ └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │    POSTGRESQL DATABASE    │
                              │   (hr_square_reviews)     │
                              │                           │
                              │  • reviews table          │
                              │  • Check constraints      │
                              │  • Indexed timestamps     │
                              └───────────────────────────┘
```

### Architectural Guarantees
1. **Static Main Website:** The core academy website remains a 100% static HTML5/CSS3/JavaScript web application. It is **not** wrapped inside Django templates or rendered through a server runtime, ensuring maximum speed, free CDN edge-caching, and instant page loads.
2. **Dedicated Review Microservice:** All review processing, database persistence, and aggregation logic live inside `review-api/`, a standalone Django REST Framework project.
3. **Resilience & Graceful Degradation:** If the backend microservice is offline, restarting, or asleep, the static website remains 100% operational. The review section displays an informative status banner without crashing, breaking layout, or disrupting course exploration and WhatsApp admissions.
4. **Zero Fake Reviews:** Reviews are stored solely in PostgreSQL. No fabricated or hardcoded reviews are bundled into the source code.

---

## 3. Project Directory Structure

```text
HR-SQUARE-ACADEMY/
│
├── index.html                      # Static entry point with review section & modal
├── README.md                       # Platform documentation and deployment guide
├── render.yaml                     # Infrastructure-as-Code Blueprint (Static + Backend + DB)
├── .gitignore                      # Root repository exclusion rules
│
├── css/
│   ├── style.css                   # Navy-gold styles, review cards, summary bar, modal dialog
│   ├── responsive.css              # Breakpoints for tablet (<= 800px) and mobile (<= 500px)
│   └── animations.css              # Subtle transitions, spinners, and reduced-motion rules
│
├── js/
│   ├── main.js                     # Header elevation, mobile navigation, smooth scrolling
│   ├── gallery.js                  # Dynamic photo/video category filtering
│   ├── lightbox.js                 # Accessible media lightbox preview
│   └── reviews.js                  # Review API client, modal state, star rating, pagination
│
├── assets/
│   ├── images/
│   │   ├── logo/                   # Academy brand logos
│   │   ├── teachers/               # Ms. S. Roopakokila portraits & certificates
│   │   ├── courses/                # Course illustrations
│   │   └── gallery/                # Verified academy photo assets
│   └── videos/                     # Student abacus & vedic maths demonstration videos
│
└── review-api/                     # Dedicated review microservice
    ├── manage.py                   # Django CLI utility
    ├── requirements.txt            # Python dependencies
    ├── .env.example                # Example environment variables template
    ├── .gitignore                  # Backend-specific ignore rules (.env, venv, cache)
    │
    ├── config/
    │   ├── __init__.py
    │   ├── settings.py             # DRF, CORS, Throttling, and DB configuration
    │   ├── urls.py                 # Root URL router
    │   └── wsgi.py                 # WSGI application entry point for Gunicorn
    │
    └── reviews/
        ├── __init__.py
        ├── models.py               # Review model with constraints & choices
        ├── serializers.py          # DRF serializer with strict validation & XSS strip
        ├── views.py                # ReviewListCreateView, ReviewSummaryView
        ├── urls.py                 # /api/reviews/ routing
        ├── admin.py                # Django admin registration
        ├── tests.py                # Automated test suite (10 unit & integration tests)
        └── migrations/
            ├── 0001_initial.py     # Initial database migration schema
            └── __init__.py
```

---

## 4. Technology Stack

### Frontend (Static Website)
* **HTML5:** Semantic markup, accessible modal dialogs (`role="dialog"`), ARIA labels.
* **CSS3:** Modern flexbox/grid layouts, CSS custom properties, responsive breakpoints.
* **Vanilla JavaScript (ES6+):** Async `fetch()` API, DOM event handling, zero build tools.
* **Security Deterrents:** HTML5 video `controlsList="nodownload"`, right-click context menu prevention on images, draggable prevention.

### Backend Microservice (`review-api/`)
* **Python 3.11+ / 3.12**
* **Django 5.2+**
* **Django REST Framework (DRF):** Serializers, API views, pagination, and throttles.
* **django-cors-headers:** Fine-grained Cross-Origin Resource Sharing control.
* **psycopg (v3 binary):** Modern high-performance PostgreSQL database adapter.
* **python-dotenv:** Environment variable management.
* **gunicorn:** Production WSGI HTTP server.

### Database
* **PostgreSQL (16+ / 18+):** ACID relational storage with check constraints and indexation.

---

## 5. PostgreSQL Database Configuration

### 1. Create the Database
In PostgreSQL (using `psql` or pgAdmin):

```sql
CREATE DATABASE hr_square_reviews;
```

### 2. Database Schema (`reviews` Table)
Managed automatically by Django migrations (`reviews/migrations/0001_initial.py`):

| Column | Data Type | Constraints / Description |
|---|---|---|
| `id` | `BIGINT` | Auto-increment primary key |
| `reviewer_name` | `VARCHAR(100)` | Reviewer full name |
| `reviewer_type` | `VARCHAR(20)` | `Parent` or `Student` (check constraint) |
| `course` | `VARCHAR(100)` | Course selected (`Abacus`, `Vedic Maths`, `Written Hindi`, `Spoken Hindi`, `Maths Tuition`) |
| `rating` | `INTEGER` | Rating from `1` to `5` (check constraint) |
| `review_text` | `TEXT` | Review narrative (min 10 characters) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Indexed submission timestamp (auto now) |

---

## 6. Local Development & Setup

### Prerequisites
* Python 3.11 or later installed (`python --version`)
* PostgreSQL 14+ installed and running locally
* Any web server or browser for static files

---

### Step A: Backend Setup (`review-api/`)

1. **Navigate to the microservice directory:**
   ```bash
   cd review-api
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   # Windows (PowerShell / Command Prompt)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create the environment file (`.env`):**
   Copy `.env.example` to `.env`:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   ```

   Configure `.env` with your local PostgreSQL credentials:
   ```ini
   DJANGO_SECRET_KEY=hr-square-local-secret-key-change-in-production
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   DB_NAME=hr_square_reviews
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432

   CORS_ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://127.0.0.1:8000
   ```

5. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Run the automated test suite:**
   ```bash
   python manage.py test reviews
   ```
   *Expected output:* `Ran 10 tests in 0.1xxs — OK`.

7. **Start the local API development server:**
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   The API will now be available at `http://127.0.0.1:8000/api/reviews/`.

---

### Step B: Frontend Setup (Static Website)

The frontend is pure static HTML/CSS/JS. Run any local web server from the project root:

1. **Using Python HTTP Server:**
   ```bash
   # Run from repository root (where index.html is located)
   python -m http.server 5500
   ```

2. **Using VS Code Live Server:**
   Right-click `index.html` and select **"Open with Live Server"** (runs on port 5500).

3. **Open in your browser:**
   ```
   http://127.0.0.1:5500/
   ```

### Dynamic API Endpoint Resolution
The frontend script (`js/reviews.js`) automatically detects the runtime environment:
* When running on `localhost` or `127.0.0.1`, it connects to `http://127.0.0.1:8000/api`.
* When deployed on Render or production domain, it connects to `https://hr-square-reviews.onrender.com/api`.
* Custom override: you can define `window.REVIEW_API_BASE_URL = 'http://your-custom-endpoint/api'` before `reviews.js`.

---

## 7. REST API Reference

Base Path: `/api/`

### 1. List Reviews (Paginated)
* **Method:** `GET`
* **Endpoint:** `/api/reviews/`
* **Query Parameters:**
  * `page` (integer, optional, default: `1`)
  * `page_size` (integer, optional, default: `6`, max: `50`)
* **Rate Limit:** 60 requests / minute

#### Response (`200 OK`):
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "reviewer_name": "Karthik Raja",
      "reviewer_type": "Parent",
      "course": "Abacus",
      "rating": 5,
      "review_text": "Excellent coaching by Ms. Roopakokila. My daughter's calculation speed and focus have improved remarkably within six months.",
      "created_at": "2026-11-03T10:15:00Z"
    }
  ]
}
```

---

### 2. Submit a New Review
* **Method:** `POST`
* **Endpoint:** `/api/reviews/`
* **Headers:** `Content-Type: application/json`
* **Rate Limit:** 10 submissions / minute per client IP
* **Security:** HTML tags and scripts in input fields are automatically stripped.

#### Request Body:
```json
{
  "reviewer_name": "Priya Dharshini",
  "reviewer_type": "Student",
  "course": "Vedic Maths",
  "rating": 5,
  "review_text": "The Vedic maths tricks taught here made 3-digit multiplication so simple. Scored full marks in my school term exams!"
}
```

#### Validation Rules:
* `reviewer_name`: Required, 2 to 100 characters.
* `reviewer_type`: Required, must be `"Parent"` or `"Student"`.
* `course`: Required, must be one of:
  * `"Abacus"`
  * `"Vedic Maths"`
  * `"Written Hindi"`
  * `"Spoken Hindi"`
  * `"Maths Tuition"`
* `rating`: Required integer, between `1` and `5`.
* `review_text`: Required, between 10 and 2000 characters.

#### Success Response (`201 Created`):
```json
{
  "id": 2,
  "reviewer_name": "Priya Dharshini",
  "reviewer_type": "Student",
  "course": "Vedic Maths",
  "rating": 5,
  "review_text": "The Vedic maths tricks taught here made 3-digit multiplication so simple. Scored full marks in my school term exams!",
  "created_at": "2026-11-03T10:20:00Z"
}
```

#### Error Response (`400 Bad Request`):
```json
{
  "rating": [
    "Ensure this value is less than or equal to 5."
  ]
}
```

---

### 3. Review Summary & Aggregate Statistics
* **Method:** `GET`
* **Endpoint:** `/api/reviews/summary/`
* **Rate Limit:** 60 requests / minute

#### Response (`200 OK`):
```json
{
  "total_reviews": 12,
  "average_rating": 4.9,
  "star_counts": {
    "5": 11,
    "4": 1,
    "3": 0,
    "2": 0,
    "1": 0
  }
}
```

---

## 8. Frontend Review Features & UI Components

1. **Interactive Review Summary Bar:**
   * Big average rating display with dynamic gold star rendering.
   * Total verified review count badge.
   * Visual progress distribution bars for each star level (5-star down to 1-star).
2. **Review Cards Grid:**
   * Reviewer name and verified badge.
   * `Parent` or `Student` pill tag.
   * Course tag with navy-gold styling.
   * Star rating display.
   * Full review message with responsive typography.
   * Formatted relative date (e.g. *"Today"*, *"Yesterday"*, *"Oct 28, 2026"*).
3. **"Write a Review" Modal Dialog:**
   * Fully accessible modal with focus trap, Escape key dismiss, and backdrop click dismiss.
   * Interactive, keyboard-navigable star rating selector with live rating labels (*"Excellent"*, *"Very Good"*, etc.).
   * Form validation with real-time error messages.
   * Submit state protection: button disables with spinner to prevent accidental double submissions.
   * Toast notification upon successful publishing.
4. **Pagination / "Load More":**
   * Smoothly appends additional reviews without full page reloads.
   * Automatically conceals button when all reviews have been loaded.
5. **Offline & Network Resilience:**
   * Shows a helpful banner if backend is unreachable or sleeping.
   * Guarantees zero disruption to the rest of the website.

---

## 9. Security & Hardening Measures

* **Content Security Policy (CSP):** Configured in `render.yaml` and `index.html` with explicit whitelist:
  ```text
  connect-src 'self' http://127.0.0.1:8000 http://localhost:8000 https://hr-square-reviews.onrender.com;
  ```
* **Rate Throttling:** Submissions are capped at 10 requests per minute per IP via Django REST Framework's `ScopedRateThrottle`.
* **XSS Sanitisation:** The Django serializer cleanses all text inputs using `django.utils.html.strip_tags` to eliminate `<script>`, `<iframe>`, or HTML injections.
* **CORS Restriction:** API only accepts cross-origin requests from the academy's official domain and configured local development origins.
* **Credential Hygiene:** Zero database credentials, passwords, or Django secret keys exist in the git repository. All secrets are managed via `.env` and environment variables.
* **Media Protection:**
  * Video elements are configured with `controlsList="nodownload"`.
  * Public image elements feature right-click context menu prevention and `draggable="false"`.

---

## 10. Production Deployment Guidelines

> [!IMPORTANT]
> In accordance with project safety guidelines, production deployment is **never executed automatically**. Follow these steps when ready to deploy.

The project is pre-configured for deployment on **Render** using either the Infrastructure-as-Code Blueprint (`render.yaml`) or manual service creation:

### Option A: One-Click Render Blueprint (Recommended)
1. Commit and push the repository to GitHub.
2. In the Render Dashboard, click **New +** > **Blueprint**.
3. Select the `HR-SQUARE-ACADEMY` repository.
4. Render will parse `render.yaml` and provision:
   * **Database:** `hr-square-reviews-db` (Free PostgreSQL instance).
   * **Backend Web Service:** `hr-square-reviews` (Python Gunicorn service running migrations on deploy).
   * **Static Site:** `hr-square-academy` (CDN-hosted static website with CSP headers).
5. Click **Apply**.

---

### Option B: Manual Service Provisioning

#### 1. Create Render PostgreSQL Database
1. Go to Render Dashboard > **New +** > **PostgreSQL**.
2. Name: `hr-square-reviews-db`
3. Database: `hr_square_reviews`
4. User: `hr_square_user`
5. Plan: `Free`
6. Copy the **Internal Database URL** once provisioned.

#### 2. Create Render Backend Web Service (`review-api`)
1. Go to Render Dashboard > **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Name: `hr-square-reviews`
4. Root Directory: `review-api`
5. Runtime: `Python`
6. Build Command:
   ```bash
   pip install -r requirements.txt && python manage.py migrate
   ```
7. Start Command:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```
8. Environment Variables:
   * `SECRET_KEY`: *(Generate a secure 50+ character random string)*
   * `DEBUG`: `False`
   * `ALLOWED_HOSTS`: `hr-square-reviews.onrender.com`
   * `CORS_ALLOWED_ORIGINS`: `https://hr-square-academy.onrender.com`
   * `DATABASE_URL`: *(Paste the PostgreSQL connection string from Step 1)*

#### 3. Update & Verify Static Frontend
1. The static site on Render (`https://hr-square-academy.onrender.com/`) will automatically connect to `https://hr-square-reviews.onrender.com/api` via the built-in host detection.
2. Verify headers and CSP in `render.yaml` allow `connect-src https://hr-square-reviews.onrender.com`.

---

## 11. Testing & Verification

Run these verification commands locally prior to any deployment:

```bash
# 1. Run Backend Unit Tests
cd review-api
python manage.py test reviews

# 2. Check Static Files & JS Syntax
node --check ../js/reviews.js
node --check ../js/main.js
node --check ../js/gallery.js
node --check ../js/lightbox.js

# 3. Validate render.yaml Syntax
python -c "import yaml; yaml.safe_load(open('../render.yaml')); print('YAML valid!')"
```

All 10 test cases covering validation, calculation, rate limiting, and sanitisation will execute and report passing status.
