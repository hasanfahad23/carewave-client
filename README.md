# CareWave - Community Social Development Events Platform

[![Live Site](https://img.shields.io/badge/Live%20Demo-carewave--app.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://carewave-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**CareWave** is a community-driven social service event management platform where active citizens, youth groups, and humanitarian organizers can create, discover, join, and track impactful grassroots social initiatives in their local neighborhoods.

🌐 **Live Website Link**: [https://carewave-app.vercel.app](https://carewave-app.vercel.app)

---

## ✨ Key Features

- **Community Grassroots Initiatives**: Browse, discover, and organize diverse social welfare drives including Winter Clothes Distribution, Blanket Relief, Buriganga River Cleanup, Tree Plantations, Free Health Camps, and Street Children Education.
- **Strict Future-Date Scheduling & Real-Time Event Pipeline**: Events are verified ensuring only upcoming initiatives are listed. Automatic date validation rejects past dates to keep listings actionable.
- **Dynamic Recent Events Showcase**: Homepage automatically queries and displays 6 recent upcoming initiatives powered by MongoDB `.limit(6)` aggregation, complete with loading skeletons.
- **Protected Volunteer & Organizer Management**: Authenticated users can easily join events with instant database enrollment, while organizers enjoy dedicated dashboards to manage, update, or cancel their initiatives and view volunteer attendee rosters.
- **Full Theme Customization (Light / Dark Mode)**: System-wide theme toggle allowing seamless switching between crisp daylight and battery-friendly dark aesthetic with persistent user preference.
- **Robust JWT Authentication & Complexity Verification**: Email/password authentication enforcing uppercase, lowercase, and 6+ character password rules, with Google sign-in support and persistent session state that preserves protected routes on reload.
- **Profile Customization**: Users can inspect and update their public volunteer profile, display name, and avatar picture with real-time feedback.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design System
- **Icons**: [Lucide React](https://lucide.dev/) + Rebranded Official X Logo
- **Notifications & Dialogs**: [React Hot Toast](https://react-hot-toast.com/) & [SweetAlert2](https://sweetalert2.github.io/)
- **Backend API**: Express.js + MongoDB + JWT (`carewave-server`)

---

## 📂 Project Architecture

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Theme, Auth & Toast providers
│   │   ├── page.tsx               # Public Home (Banner, Features, Recent Events, Gallery, Newsletter)
│   │   ├── not-found.tsx          # 404 fallback page
│   │   ├── globals.css            # Custom theme variables, headings, cards
│   │   ├── events/
│   │   │   ├── page.tsx           # All Upcoming Events with search, category & sort
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Event details page with Join Event functionality
│   │   ├── create-event/
│   │   │   └── page.tsx           # Protected form to create events (future date validation)
│   │   ├── manage-events/
│   │   │   └── page.tsx           # Protected organizer dashboard (update, delete, volunteer roster)
│   │   ├── joined-events/
│   │   │   └── page.tsx           # Protected user view sorted by event date
│   │   ├── profile/
│   │   │   └── page.tsx           # Protected profile view & name/avatar update
│   │   ├── login/
│   │   │   └── page.tsx           # Email/password + Google auth
│   │   └── register/
│   │       └── page.tsx           # Registration with password complexity validator
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive header with profile dropdown & theme toggle
│   │   ├── Footer.tsx             # Comprehensive footer with official X logo
│   │   ├── EventCard.tsx          # Standardized event card with uniform sizing
│   │   ├── LoadingSkeleton.tsx    # Skeletons for cards, details, and tables
│   │   └── ProtectedRoute.tsx     # Route protector without unwanted redirect on reload
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication & session persistence
│   │   └── ThemeContext.tsx       # Dark/light theme provider
│   ├── lib/
│   │   └── api.ts                 # Centralized fetch wrapper with JWT header injection
│   └── types/
│       └── index.ts               # Core TypeScript type definitions
├── public/
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm or yarn

### 2. Environment Setup
Create a `.env.local` file in the root of the `client` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Key Rules & Implementation Highlights

1. **Zero Lorem Ipsum**: All sections, events, and captions contain realistic, human-written copy.
2. **Modern Alerts**: Replaced default browser `window.alert()` with React Hot Toast and SweetAlert2.
3. **No Auth Drop on Refresh**: Authenticated state is safely cached in localStorage and verified via JWT without redirecting logged-in users during route reloads.
4. **Rebranded Social Links**: Features the modern **X** emblem instead of the obsolete Twitter bird.
5. **Strict Future Dates**: Event date pickers restrict past selection using both frontend minimum constraints and backend time checks.
