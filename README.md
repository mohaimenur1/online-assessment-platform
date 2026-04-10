# assess — Online Assessment Platform

A full-featured online assessment platform built with **Next.js 14**, **Redux Toolkit**, **React Hook Form**, **Yup**, and **Tailwind CSS**.

---

## Features

### Employer Panel

- **Login** — Mock authentication with email/password validation (Yup + React Hook Form)
- **Dashboard** — Exam cards with candidates, slots, question sets, duration; summary stats
- **View Candidates** — Modal showing each candidate's score, status, time
- **Create Test (Multi-Step)**
  - Step 1: Basic info — title, candidates, slots, question sets, type, start/end time, duration
  - Step 2: Question sets — add/edit/delete questions (radio, checkbox, text) via modal

### Candidate Panel

- **Login** — Mock authentication
- **Dashboard** — Exam cards showing duration, questions, negative marking
- **Exam Screen**
  - Question-by-question navigation with answer palette sidebar
  - Countdown timer with animated arc
  - Radio, checkbox, and text question types
  - Tab-switch behavioral detection with warning banners
  - Manual submit + auto-submit on timeout
  - Score result screen

---

## Tech Stack

| Concern             | Library                 |
| ------------------- | ----------------------- |
| Framework           | Next.js 14 (App Router) |
| State Management    | Redux Toolkit           |
| Forms               | React Hook Form         |
| Validation          | Yup                     |
| Styling             | Tailwind CSS            |
| API / Data Fetching | React Query (TanStack)  |
| Mock Data           | Local JS module         |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Demo Credentials

| Role      | Email              | Password |
| --------- | ------------------ | -------- |
| Employer  | admin@techcorp.com | admin123 |
| Candidate | john@example.com   | pass123  |

---

## Project Structure

```
src/
├── app/
│   ├── layout.jsx          # Root layout with Providers
│   └── page.jsx            # Main routing logic
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Card, Modal, Badge...)
│   ├── employer/
│   │   ├── EmployerDashboard.jsx
│   │   └── CreateTest.jsx  # Multi-step form
│   ├── candidate/
│   │   └── CandidateDashboard.jsx
│   ├── exam/
│   │   ├── ExamScreen.jsx  # Full exam UI with behavioral tracking
│   │   └── ExamTimer.jsx   # Countdown timer component
│   ├── LoginPage.jsx
│   ├── RoleSelector.jsx
│   ├── Sidebar.jsx
│   └── Providers.jsx       # Redux + React Query providers
├── lib/
│   ├── mock-data/          # All mock users, exams, questions, candidates
│   ├── hooks/              # useAuth, useTimer, useBehaviorTracking, useExamAnswers
│   └── store/
│       ├── index.js        # Redux store
│       └── slices/
│           ├── authSlice.js
│           └── examsSlice.js
└── styles/
    └── globals.css
```

---

## Custom Hooks

| Hook                  | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `useAuth`             | Login/logout with mock API simulation        |
| `useTimer`            | Countdown timer with timeout callback        |
| `useBehaviorTracking` | Tab visibility + fullscreen change detection |
| `useExamAnswers`      | Manages radio/checkbox/text answers state    |

---

## Build for Production

```bash
npm run build
npm start
```
