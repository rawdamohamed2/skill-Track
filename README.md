T# SkillTrack

SkillTrack is a personal Developer Growth OS designed to help developers track their skills, projects, career goals, job applications, and upcoming interviews in one place.

Built as a Frontend Development Assignment for TechAI.

## Features

- Developer dashboard with an overview of career progress
- Skill tracking with categories, statuses, and milestones
- Automatic skill progress calculation based on completed milestones
- Project tracking
- Job application pipeline
- Career goals with progress tracking
- Interview tracking and upcoming interview reminders
- Global search
- Responsive design for desktop, tablet, and mobile
- Form handling with React Hook Form
- Form validation with Zod
- Persistent client-side state using Zustand and localStorage
- Modern dark UI built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript

### UI & Styling
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### State & Forms
- Zustand
- React Hook Form
- Zod

### Data Persistence
- Browser localStorage through Zustand persist middleware

## Project Structure

```text
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
│── stores/ 
│    └── store.ts
│
│── types/ 
│    └── types.ts
│
│── schemas/ 
│    └── schema.ts   
│  
└── hooks/
     └── use-mobile.ts