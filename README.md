# Jodchha

**Connect. Discover. Go.**

Jodchha is a web directory for discovering useful Nepali and global websites, online services, and tools — with a built-in URL shortener, click analytics, and an admin dashboard.

---

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | Next.js 16 · TypeScript · Tailwind CSS  |
| Backend   | Django 6.1 · Django REST Framework      |
| Database  | PostgreSQL 16                           |
| Auth      | JWT (SimpleJWT)                         |
| Prod      | Gunicorn · Docker Compose               |

## Features

- **Website directory** — browse by category, search, featured listings
- **Website detail pages** — SEO-friendly `/websites/[slug]` pages with logos, descriptions, and related sites
- **URL shortener** — create short links, QR codes, share them
- **Click analytics** — daily click charts, top websites, recent clicks (admin)
- **Admin dashboard** — full CRUD for categories, websites, short links, and clicks
- **Rate limiting** — throttled short-link creation and redirects
- **Production-ready** — gunicorn, security headers, HTTPS settings, Docker

---

## Quick Start (Local Development)

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+

### 1. Clone

```bash
git clone https://github.com/sameer9860/Jodchha.git
cd Jodchha
```

### 2. Backend

```bash
cd backend

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DB_NAME, DB_USER, DB_PASSWORD, and generate a SECRET_KEY:
#   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Create database & run migrations
python manage.py migrate

# Create an admin user
python manage.py createsuperuser

# Start the dev server
python manage.py runserver
```

The API is now running at **http://127.0.0.1:8000/api/**.

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if your backend is on a different host/port

# Start the dev server
npm run dev
```

The frontend is now running at **http://localhost:3000**.

---

## Quick Start (Docker)

```bash
# 1. Configure backend env
cp backend/.env.example backend/.env
# Edit backend/.env — set DB_PASSWORD and DJANGO_SECRET_KEY

# 2. Build & start all services
docker compose up --build -d

# 3. Run migrations & create admin
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser

# 4. Open in browser
#    Frontend → http://localhost:3000
#    Backend  → http://localhost:8000/api/
```

To stop: `docker compose down` (add `-v` to also remove the database volume).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable               | Required | Default                                         | Description                    |
| ---------------------- | -------- | ----------------------------------------------- | ------------------------------ |
| `DJANGO_SECRET_KEY`    | ✅       | `change-me-to-a-random-secret`                  | Django secret key              |
| `DEBUG`                | —        | `True`                                          | Set `False` for production     |
| `DB_NAME`              | ✅       | —                                               | PostgreSQL database name       |
| `DB_USER`              | ✅       | —                                               | PostgreSQL user                |
| `DB_PASSWORD`          | ✅       | —                                               | PostgreSQL password            |
| `DB_HOST`              | —        | `localhost`                                     | Database host                  |
| `DB_PORT`              | —        | `5432`                                          | Database port                  |
| `ALLOWED_HOSTS`        | —        | `localhost,127.0.0.1,[::1]`                     | Comma-separated allowed hosts  |
| `CORS_ALLOWED_ORIGINS` | —        | `http://localhost:3000,http://127.0.0.1:3000`   | Frontend origins               |
| `CSRF_TRUSTED_ORIGINS` | —        | `http://localhost:3000,http://127.0.0.1:3000`   | CSRF trusted origins           |

### Frontend (`frontend/.env.local`)

| Variable               | Default                          | Description                     |
| ---------------------- | -------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://127.0.0.1:8000/api`     | Backend API base URL            |
| `NEXT_PUBLIC_SITE_URL` | `https://jodchha.com.np`        | Public site URL for short links |

---

## API Endpoints

### Public

| Method | Path                       | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/api/categories/`         | List active categories       |
| GET    | `/api/websites/`           | List websites (paginated)    |
| GET    | `/api/websites/<slug>/`    | Website detail by slug       |
| GET    | `/api/go/<slug>/`          | Redirect to website + track  |
| POST   | `/api/shortlinks/`         | Create a short link          |
| GET    | `/api/s/<code>/`           | Redirect short link + track  |

**Query params for `/api/websites/`:** `category`, `featured`, `search`, `page`, `page_size`

### Auth

| Method | Path                       | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/token/`         | Admin login (JWT)        |
| POST   | `/api/auth/token/refresh/` | Refresh access token     |

### Admin (requires JWT)

| Method     | Path                          | Description             |
| ---------- | ----------------------------- | ----------------------- |
| GET/POST   | `/api/admin/categories/`      | List / create categories|
| GET/PATCH/DELETE | `/api/admin/categories/<id>/` | Detail / update / delete |
| GET/POST   | `/api/admin/websites/`        | List / create websites  |
| GET/PATCH/DELETE | `/api/admin/websites/<id>/`   | Detail / update / delete |
| GET/POST   | `/api/admin/shortlinks/`      | List / create short links |
| GET/PATCH/DELETE | `/api/admin/shortlinks/<id>/` | Detail / update / delete |
| GET        | `/api/admin/clicks/`          | List clicks             |
| GET/DELETE | `/api/admin/clicks/<id>/`     | Detail / delete click   |
| GET        | `/api/analytics/`             | Analytics dashboard     |

---

## Running Tests

```bash
cd backend
source .venv/bin/activate
python manage.py test directory -v2
```

---

## Project Structure

```
Jodchha/
├── backend/
│   ├── config/          # Django project settings, urls, wsgi
│   ├── directory/       # Main app (models, views, admin_api, tests)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/             # Next.js pages (App Router)
│   ├── components/      # React components
│   ├── lib/             # API client, types
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

---

## Rate Limits

| Endpoint            | Limit         |
| ------------------- | ------------- |
| Short link creation | 10 / minute   |
| Redirects           | 60 / minute   |

---

## Production Checklist

- [ ] Generate a real `DJANGO_SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` for your domain
- [ ] Set up HTTPS (nginx/Caddy reverse proxy)
- [ ] Run `python manage.py collectstatic`
- [ ] Set up database backups
- [ ] Configure a process manager (systemd or Docker)

---

## License

🚧 Under development — license TBD.