# Dar Monasbat Frontend

A modern Next.js frontend application crafted with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion, taking design patterns and architecture from **Mario Juice** and **Re Sapori**.

## Project Architecture

```
darmonasbat/
├── app/
│   ├── globals.css        # Global CSS variables, reset, Tailwind directives
│   ├── layout.tsx         # Root layout with fonts, metadata, Navbar, Footer
│   └── page.tsx           # Hello World landing page with Framer Motion animations
├── components/
│   ├── Navbar.tsx         # Responsive navigation header
│   └── Footer.tsx         # Site footer
├── lib/
│   └── utils.ts           # Class merging helper (cn)
├── types/
│   └── index.ts           # Shared TypeScript types
├── public/                # Static assets (images, icons)
├── .env.example           # Environment variables template
├── .env.local             # Local environment variables
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind theme and styling configuration
└── tsconfig.json          # TypeScript compiler configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```
