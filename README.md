# assess — Online Assessment Platform

A full-featured online assessment platform built with **Next.js 14**, **Redux Toolkit**, **React Hook Form**, **Yup**, and **Tailwind CSS**.

---

## 🔗 Live Demo

👉 https://online-assessment-platform-wv2b.vercel.app/

### Demo Credentials

| Role      | Email              | Password |
| --------- | ------------------ | -------- |
| Employer  | admin@techcorp.com | admin123 |
| Candidate | john@example.com   | pass123  |

---

## 📂 GitHub Repository

👉 https://github.com/mohaimenur1/online-assessment-platform

---

---

## 📌 Additional Questions

### 🧩 MCP Integration

**● Have you worked with any MCP (Model Context Protocol)?**  
Yes — I have worked with MCP, particularly using **Figma MCP** alongside development tools.

**● Which MCP did you use, what work did you perform, and what was accomplished?**  
I used **Figma MCP** to bridge the gap between design and development. By leveraging structured design data (components, styles, spacing, and layout rules), I was able to:

- Translate Figma designs into reusable React components more efficiently
- Maintain design consistency across the application (colors, typography, spacing)
- Reduce manual guesswork in UI implementation
- Speed up development by aligning design tokens directly with Tailwind CSS configuration

**Outcome:** Faster UI development, improved design accuracy, and better collaboration between design and code.

---

### 🤖 AI Tools for Development

To speed up frontend development and improve productivity, I actively use:

- **ChatGPT / GPT** — for problem solving, debugging, and architectural decisions
- **GitHub Copilot** — for real-time code suggestions and boilerplate generation
- **Claude** — for code explanations, refactoring, and structured reasoning
- **Google Gemini** — for alternative solutions and quick research

**How they help:**

- Rapid prototyping of components and logic
- Writing cleaner and optimized code
- Debugging complex issues faster
- Generating form validation schemas, hooks, and reusable utilities

---

### 🌐 Offline Mode Handling

If a candidate loses internet connection during an exam, the system can handle it gracefully using the following approach:

**Strategy:**

- **Local Storage / IndexedDB:**  
  Continuously save answers and exam progress locally in the browser

- **Auto Sync Mechanism:**  
  When the connection is restored, automatically sync saved answers with the server

- **Timer Handling:**  
  Maintain the timer on the client side to prevent manipulation

- **Reconnection Recovery:**  
  Restore the exact exam state (current question, answers, remaining time) after reconnect

- **User Feedback:**  
  Show a clear warning banner indicating offline status and syncing progress

**Outcome:**  
Ensures a seamless exam experience without data loss, even in unstable network conditions.

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

src/
├── app/
│ ├── layout.jsx # Root layout with Providers
│ └── page.jsx # Main routing logic
├── components/
│ ├── ui/ # Reusable UI primitives (Button, Card, Modal, Badge...)
│ ├── employer/
│ │ ├── EmployerDashboard.jsx
│ │ └── CreateTest.jsx # Multi-step form
│ ├── candidate/
│ │ └── CandidateDashboard.jsx
│ ├── exam/
│ │ ├── ExamScreen.jsx # Full exam UI with behavioral tracking
│ │ └── ExamTimer.jsx # Countdown timer component
│ ├── LoginPage.jsx
│ ├── RoleSelector.jsx
│ ├── Sidebar.jsx
│ └── Providers.jsx # Redux + React Query providers
├── lib/
│ ├── mock-data/ # All mock users, exams, questions, candidates
│ ├── hooks/ # useAuth, useTimer, useBehaviorTracking, useExamAnswers
│ └── store/
│ ├── index.js # Redux store
│ └── slices/
│ ├── authSlice.js
│ └── examsSlice.js
└── styles/
└── globals.css

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
