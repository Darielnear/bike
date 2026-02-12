# CicliVolante - Italian E-Bike Store

## Overview
CicliVolante is a premium Italian e-bike e-commerce website. The application features a product catalog with 75 products across categories (E-MTB, E-City & Urban, Trekking & Gravel, Accessories), shopping cart, and an admin panel.

## Recent Changes
- 2026-02-12: Completed import to Replit environment, all dependencies installed, database provisioned and seeded, workflow running

## Architecture
- **Frontend**: React 18 + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express 5 (TypeScript via tsx)
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend), Express routes (backend)
- **State Management**: TanStack React Query + Zustand

## Project Structure
- `client/` - React frontend (pages, components, hooks, lib)
- `server/` - Express backend (routes, storage, db, vite dev server)
- `shared/` - Shared schema and types (Drizzle + Zod)
- `attached_assets/` - Static image assets
- `img/` - Product images

## Running
- Dev: `npm run dev` (starts Express + Vite on port 5000)
- Build: `npm run build`
- Production: `npm run start`
- DB Push: `npm run db:push`

## User Preferences
- Italian language for storefront UI
- E-bike / cycling product focus
- 12 products per page grid layout
- PostePay/BBVA payment methods
