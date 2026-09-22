# Seven Star School — production deployment

This repository contains the React/Vite public site and Express/Mongoose API. The deployment target is Render + MongoDB Atlas.

## Services

`render.yaml` creates two services:

- `sevenstar-school-api` — Node/Express API under `backend/`
- `sevenstar-school-web` — Vite static site under `frontend/`

The static site rewrites every route to `index.html` so React Router clean URLs work on refresh.

## MongoDB Atlas

Create a database named `sevenstar-school`, create a least-privilege database user, and add the Render API service's outbound access as allowed network access in Atlas. Set `MONGODB_URI` to the Atlas connection string.

## Production secrets

Set these in Render instead of committing them:

- `MONGODB_URI`
- `JWT_SECRET` and `JWT_REFRESH_SECRET` (random, at least 32 characters each)
- `FRONTEND_URL` / `FRONTEND_URLS`
- `API_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- mail credentials when email delivery is enabled
- `VITE_API_URL` on the frontend, normally `https://<api-service>.onrender.com/api`
- `VITE_SITE_URL` on the frontend, normally `https://<frontend-service>.onrender.com`

## Initial admin

The backend includes a safe idempotent `seed:admin` command. Run it once with `ADMIN_EMAIL`, `ADMIN_PASSWORD` and optionally `ADMIN_NAME` configured. It creates the admin user plus an `Admin` profile with full permissions.

## CMS workflow

The admin dashboard manages users, admins, teachers, students, classes, subjects, exams, results, notices, galleries, admissions, downloads, activities, achievements, facilities, suggestions, contacts and settings. Teacher accounts created through public registration remain pending until an administrator approves them.

Teacher result write/publish operations are protected server-side: an approved teacher must be assigned to both the class and subject involved. The public result portal only exposes published results for Class 11 and Class 12.

## Media on Render

Render web-service filesystems are not a durable media store. For production media, configure an external object/media provider such as Cloudinary and store the resulting URLs in the CMS. The MongoDB schema is URL-based so media storage can be moved without changing content models.

## SEO

The frontend includes per-route title/description/canonical/Open Graph/Twitter metadata, educational-organization JSON-LD, and a build-time `sitemap.xml` / `robots.txt`. Set `VITE_SITE_URL` before the production frontend build so absolute sitemap URLs are correct.

## Backup readiness

MongoDB Atlas should be configured with its backup/point-in-time recovery plan appropriate to the school's operational requirements. The application keeps records in separate collections and uses indexes on frequently queried identifiers so database backups can be restored independently of the frontend deployment.

## Local verification

Backend:

```bash
cd backend
npm ci
npm run build
```

Frontend:

```bash
cd frontend
npm ci
npm run build
```

The frontend build writes the deployable site to `frontend/dist`.
