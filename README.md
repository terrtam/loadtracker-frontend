# Frontend

## Overview
React + Vite client for training and wellness tracking. It talks to the backend REST API and sends the JWT in the `Authorization` header via a shared Axios client.

## Tech Stack
- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Axios
- Recharts

## Features
- Public entry, login, and signup screens
- Protected routes with a shared authenticated layout
- Dashboard with body-part profile selection and charts
- Body-part profile management (create, archive, restore)
- Session logging and history views
- Wellness logging and history with pain/fatigue charts
- Volume analytics charts with daily/weekly/monthly aggregation
- Account settings screen (password change and delete account UI)

## Project Structure
- `src/app` app bootstrap and routing
- `src/pages` route-level screens
- `src/features` domain modules (profiles, sessions, wellness, dashboard, volume)
- `src/shared` shared UI, layout, auth, and API client
- `src/styles` global styles
- `src/types` shared TypeScript types
- `src/assets` static assets

## Setup Instructions
```bash
cd frontend
npm install
npm run dev
```

## Configuration
```env
VITE_API_URL= # Backend base URL (Axios client appends `/api`)
```
