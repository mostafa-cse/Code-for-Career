# Code For Career (কোড ফর ক্যারিয়ার)

A modern, bilingual (English & Bengali) learning and software job preparation platform tailored for software engineering candidates in Bangladesh.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Key Features

- **13 Complete Subjects:** Detailed curricula covering Git, C#, DSA, System Design, Database Engineering, and more.
- **Bilingual Content:** Seamless toggle between English and Bengali across lessons and UI.
- **Authentication:**
  - Google OAuth
  - GitHub OAuth
  - Email Magic Link & 6-digit OTP verification
- **Interactive Highlighting & Notes:** Highlight text with custom colors, save notes, and track progress.
- **Visual Learning:** Interactive visual components for Git branching, algorithms, and system design architecture.
- **Candidate Profiles:** Public portfolio showcase (`/profile/[username]`) with Codeforces, GitHub, and target role integration.

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/mostafa-cse/Code-for-Career.git
cd Code-for-Career
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://shshksbzbrkfhbzephhn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xAioGCYoslie3yjN4TjZEA_iFPxa-8N
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xAioGCYoslie3yjN4TjZEA_iFPxa-8N
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_SECRET_KEY=your_secret_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🌐 Deployment

### Recommended: Vercel or Netlify
This application utilizes Next.js App Router, SSR Route Handlers (`/auth/callback`), and Edge Middleware (`src/middleware.ts`) for authentication.

- **Vercel:** Connect GitHub repo, add the 5 Supabase environment variables, and deploy.
- **Netlify:** Connect GitHub repo, add the 5 Supabase environment variables, and deploy with the preconfigured `netlify.toml`.

### About GitHub Pages
GitHub Pages only serves static HTML (`output: 'export'`) and does not support server middleware or backend Route Handlers (`route.ts`). For full authentication and dynamic features, deploy on **Vercel** or **Netlify**, and add the live link to your GitHub repository's **About** section.
