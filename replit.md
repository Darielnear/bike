# CicliVolante - Italian E-Bike Store

## Overview
CicliVolante is a premium Italian e-bike e-commerce website. The application features a product catalog with categories (E-MTB, E-City & Urban, Trekking & Gravel, Accessories), shopping cart, and an admin panel.

## Recent Changes
- 2026-02-11: Migrated to Replit environment, provisioned PostgreSQL database, configured workflow

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

## Running
- Dev: `npm run dev` (starts Express + Vite on port 5000)
- Build: `npm run build`
- Production: `npm run start`
- DB Push: `npm run db:push`

## User Preferences
- Italian language for storefront UI
- E-bike / cycling product focus
