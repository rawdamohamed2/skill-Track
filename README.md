# SkillTrack

SkillTrack is a personal **Developer Growth OS** — a single place to track your skills, projects, career goals, job applications, and upcoming interviews as you grow as a developer.

Built as a Frontend Development Assignment for **TechAI**.

**Live demo:** _add your deployed URL here once it's live (e.g. after deploying to Vercel — see [Deployment](https://skill-track-umber.vercel.app/) below) _

---

## Overview

Job hunting and skill-building usually end up scattered across a dozen tabs, notes apps, and spreadsheets. SkillTrack pulls all of that into one dashboard:

- What you're learning, and how far along you are
- What you've built with those skills
- Who you've applied to, and where each application stands
- What interviews are coming up
- What bigger goals all of this is working toward

Everything is tracked client-side — no account, no backend, no setup beyond running the app. Your data lives in your browser via `localStorage`.

## Features

- **Developer dashboard** with an at-a-glance overview of career progress
- **Skill tracking** with categories, statuses, and roadmap milestones
- **Automatic skill progress calculation** derived from completed milestones (no manual percentage entry)
- **Project tracking**, with projects linkable to the skills they used
- **Job application pipeline** to track every application from wishlist to offer
- **Career goals** with progress tracking
- **Interview tracking** with upcoming interview reminders
- **Global search** across the app
- **Responsive design** for desktop, tablet, and mobile
- **Form handling** with React Hook Form
- **Form validation** with Zod
- **Persistent client-side state** using Zustand + `localStorage`
- **Modern dark UI** built with Tailwind CSS and shadcn/ui

## Tech Stack

**Frontend**
- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)

**UI & Styling**
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

**State & Forms**
- [Zustand](https://zustand.docs.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

**Data Persistence**
- Browser `localStorage`, via Zustand's `persist` middleware — no backend or database required

## Project Structure

```
src/
├── app/
│   ├── applications/
│   ├── goals/
│   ├── interviews/
│   ├── projects/
│   ├── skills/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── BarRow.tsx
│   ├── StatCard.tsx
│   └── ...
│
├── lib/
│   └── utils.ts
│
├── stores/
│   └── store.ts
│
├── types/
│   └── types.ts
│
├── schemas/
│   └── schema.ts
│
└── hooks/
    └── use-mobile.ts
```

## Setup / Install Instructions

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
# 1. clone the repo
git clone <your-repo-url>
cd skilltrack

# 2. install dependencies
npm install

# 3. run the dev server
npm run dev
# open http://localhost:3000

# type-check
npx tsc --noEmit

# lint
npm run lint

# production build
npm run build
npm run start
```

No environment variables, API keys, or database setup are required — the app is fully client-side.

## Deployment

Deploy for free on [Vercel](https://vercel.com):

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. The "Next.js" framework preset is auto-detected — no configuration needed.
4. Deploy, then add the resulting URL to the **Live demo** link at the top of this README.

Netlify and Cloudflare Pages also support Next.js out of the box if you'd prefer either of those instead.

## Other Relevant Information

- **Data scope:** all data (skills, projects, applications, interviews, goals) is stored per-browser via `localStorage`. Clearing your browser data or switching browsers/devices will reset the app — there is no sync or backend.
- **No authentication:** this is a single-user, local tool by design; there's no login or multi-user support.
- **Accessibility:** interactive elements use visible focus states, labeled form fields with inline validation errors, and appropriate ARIA attributes on dialogs and controls.
- **Browser support:** any modern evergreen browser (Chrome, Firefox, Edge, Safari). `localStorage` must be enabled.
- **Feedback:** this project was built as a technical assignment; issues and suggestions are welcome via GitHub issues if the repo is public.
