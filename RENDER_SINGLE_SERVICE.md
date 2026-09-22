# Seven Star — one Render service

This project is configured so **one Render Web Service** serves:

- the React/Vite website
- the Express API under `/api`
- `uploads/`
- `sitemap.xml`
- `robots.txt`

MongoDB Atlas remains the external database.

## Render

Create **one Web Service** from the GitHub repository.

Do not create a Static Site and do not set a Root Directory.

Build command:

```bash
npm --prefix frontend ci --include=dev && npm --prefix backend ci --include=dev && npm --prefix frontend run build && npm --prefix backend run build
```

Start command:

```bash
npm --prefix backend start
```

Health check path:

```text
/api/health
```

## Required environment variable

```text
MONGODB_URI=<MongoDB Atlas connection string>
```

Recommended production secrets:

```text
JWT_SECRET=<32+ random characters>
JWT_REFRESH_SECRET=<different 32+ random characters>
ADMIN_EMAIL=<school admin email>
ADMIN_PASSWORD=<school admin password>
API_URL=https://<your-one-render-service>.onrender.com
```

`VITE_API_URL` is not required in production because the frontend uses `/api` on the same origin.

## Result

Your single Render URL handles everything:

```text
https://seven-star-school.onrender.com/
https://seven-star-school.onrender.com/about
https://seven-star-school.onrender.com/admissions
https://seven-star-school.onrender.com/login
https://seven-star-school.onrender.com/admin
https://seven-star-school.onrender.com/api/health
```
