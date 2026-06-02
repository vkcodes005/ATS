# ATS Deployment

The project is now split for separate hosting:

- `frontend/` goes to Netlify.
- `backend/` goes to Render.

## Backend on Render

1. Create a new Render Web Service.
2. Set the root directory to `backend`.
3. Use:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables:
   - `ATS_ADMIN_USER`
   - `ATS_ADMIN_PASS`
   - `ATS_ADMIN_TOKEN`
5. After deploy, copy the Render URL, for example:
   - `https://ats-backend.onrender.com`

## Frontend on Netlify

1. Create a new Netlify site from the repo.
2. Set the base directory to `frontend`.
3. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

## Local Development

Open two terminals:

```bash
cd backend
npm start
```

```bash
cd frontend
npm run start
```

Local frontend: `http://127.0.0.1:5173`

Local backend: `http://127.0.0.1:4000`
