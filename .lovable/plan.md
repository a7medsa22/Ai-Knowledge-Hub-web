

# AI Knowledge Hub — Design System

## Overview
Customize the existing Tailwind + shadcn/ui setup into a polished "AI Knowledge Hub" design system with Inter font, indigo-violet gradients, glassmorphism cards, and proper dark mode support.

## Deliverables

### 1. Tailwind Config & CSS Variables
- Update CSS variables in `index.css` to use the indigo/violet/slate palette for both light and dark modes
- Import Inter font from Google Fonts in `index.html`
- Set Inter as the default font family
- Configure custom colors, spacing, and border radii (rounded-2xl cards, rounded-xl buttons)

### 2. Theme Provider
- Create a `ThemeProvider` component using the already-installed `next-themes` package
- Add a dark/light mode toggle component
- Wire it into `App.tsx`

### 3. Glassmorphism Card Component
- Restyle `components/ui/card.tsx` with glassmorphism: semi-transparent backgrounds, `backdrop-blur-sm`, subtle borders
- White/0.7 opacity in light mode, slate-800/0.7 in dark mode
- Rounded-2xl with consistent p-5 padding

### 4. Design System Showcase Page
- Replace the Index page with a showcase displaying:
  - Typography scale (H1, H2, body text)
  - Primary gradient buttons and variants
  - Glassmorphism cards with sample content
  - Dark/light mode toggle in action
- This serves as a living reference for all design tokens

