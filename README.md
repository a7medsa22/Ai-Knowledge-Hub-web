# AI Knowledge Hub

AI Knowledge Hub is a modern web application for organizing AI research workflows. It brings documents, notes, tasks, and AI-powered tools into a single dashboard so you can read, experiment, and ship faster.

The app is built with React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui, and TanStack Query, with a modular service layer ready to connect to your backend APIs.

---

## Features

- **Unified Dashboard**
  - Overview of documents, notes, and tasks in a single place
  - Quick-glance stats for total documents, notes, and open tasks

- **Document Management**
  - Browse and open research documents
  - Detail view with rich content layout
  - AI actions on a document:
    - Summarize
    - Ask questions (RAG-style Q&A)
    - Extract key points

- **Notes Workspace**
  - Lightweight notes for experiments, ideas, and paper summaries
  - Cards-based layout optimized for quick scanning
  - Empty states and CTAs that guide new users

- **Task Management**
  - Tasks tailored to AI/research workflows (e.g., “Review RAG pipeline architecture doc”)
  - Priorities (High / Medium / Low) and due dates
  - List and card-based views for execution-focused workflows

- **AI Tools**
  - Chat-style interface for an AI assistant
  - Prompt examples for:
    - Document Q&A
    - Summarization
    - Extracting insights and ideas
  - Typing indicators and message history for a natural chat experience

- **Settings & Account**
  - Profile and account forms
  - Appearance settings (dark/light/system theme)
  - API Key management card (copy/mask/regenerate patterns)
  - Session management with active session list and revoke controls

- **Modern UI/UX**
  - shadcn/ui + Radix primitives
  - Tailwind-based design system
  - Responsive layout with sidebar navigation and top bar
  - Accessible components and keyboard-friendly interactions

---

## Tech Stack

- **Frontend**
  - [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) for fast bundling and dev server
  - [React Router DOM](https://reactrouter.com/) for client-side routing
  - [TanStack Query](https://tanstack.com/query/latest) for server state management
  - [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) for headless, accessible UI primitives
  - [Tailwind CSS](https://tailwindcss.com/) + `tailwindcss-animate` and `tailwind-merge`
  - Icons via [lucide-react](https://lucide.dev/)

- **HTTP & Data**
  - `axios` with a preconfigured instance
  - Service layer for:
    - `aiService` – summarization, semantic search, Q&A, key point extraction
    - `tasksService` – CRUD + stats for tasks
    - `documents`, `notes`, `users`, `auth`, `mcp`, and more

- **Tooling & Quality**
  - [ESLint](https://eslint.org/) with TypeScript + React rules
  - [Vitest](https://vitest.dev/) + Testing Library for unit/UI tests
  - PostCSS + Autoprefixer
  - Type-safe configs via `tsconfig.app.json`, `tsconfig.node.json`

---

## Project Structure

High-level structure (simplified):

```text
ai-reserch/
├─ src/
│  ├─ components/
│  │  ├─ ai/            # Chat UI, AI result cards
│  │  ├─ dashboard/     # Stat cards, previews
│  │  ├─ documents/     # Document cards
│  │  ├─ layout/        # Layout, sidebar, top bar
│  │  ├─ notes/         # Note cards and empty states
│  │  ├─ settings/      # Account, API key, sessions, appearance
│  │  ├─ tasks/         # Task list and task items
│  │  └─ ui/            # Shared shadcn/ui components
│  ├─ contexts/
│  │  └─ AuthContext.tsx
│  ├─ hooks/            # Reusable hooks (API, mobile, toast)
│  ├─ lib/              # axios instance, utilities
│  ├─ pages/            # Route-level pages (Dashboard, Documents, Notes, Tasks, AI Tools, Settings, Auth)
│  ├─ services/         # API service layer (ai, tasks, documents, mcp, auth, etc.)
│  ├─ test/             # Vitest + Testing Library setup and examples
│  ├─ App.tsx           # Router + providers
│  └─ main.tsx          # App bootstrap
├─ public/              # Static assets
├─ vite.config.ts
├─ tailwind.config.ts
├─ vitest.config.ts
└─ package.json
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node) or your preferred package manager

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/a7medsa22/Ai-Knowledge-Hub-web.git
cd Ai-Knowledge-Hub-web

# Install dependencies
npm install
```

### Running the App

Start the development server:

```bash
npm run dev
```

By default Vite runs at `http://localhost:5173` (or the next available port). The app includes:

- Public routes for authentication (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`)
- Authenticated layout routes under the main shell:
  - `/` – Dashboard
  - `/documents`, `/documents/:id`
  - `/notes`
  - `/tasks`
  - `/ai`
  - `/settings`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Testing

This project uses Vitest and Testing Library.

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## API & Backend Integration

The frontend is wired to a RESTful backend via a typed service layer under `src/services`.

Key services:

- **AI Service** (`src/services/ai.ts`)
  - `getStatus` – check AI service health and metadata
  - `summarize` – summarize text or a document
  - `ask` – question-answering, suitable for RAG-style flows
  - `search` – semantic search endpoint
  - `extractKeyPoints` – key point extraction
  - `bulkSummarize` – batch summaries for multiple documents

- **Tasks Service** (`src/services/tasks.ts`)
  - CRUD for tasks, plus:
    - `getStats` for counts (total, completed, pending, overdue)
    - `getUpcoming`, `getOverdue`

- **MCP Service** (`src/services/mcp.ts`)
  - Tool listing, health check, quick actions such as:
    - Quick document search
    - Quick note creation
    - Quick task creation
    - User stats

- **Auth, Documents, Notes, Users, Files**
  - Additional services encapsulate calls to `/auth`, `/documents`, `/notes`, `/users`, `/files`, etc.

You can point the axios instance (`src/lib/axios.ts`) at your backend base URL and implement the endpoints expected by these services.

---

## Theming & UI

- The app uses a `ThemeProvider` with `next-themes`-style attributes to support:
  - System theme detection
  - Light & dark modes
- Settings pages include:
  - Appearance configuration
  - Profile/account details
  - API Key + session management patterns that you can plug into your auth backend

The UI is built by composing shadcn/ui components under `src/components/ui` with custom layout, navigation, and domain-specific components.

---

## Development Workflow

- **State management**
  - Local component state for simple UI interactions
  - TanStack Query for server data fetching, caching, invalidation

- **Routing**
  - `BrowserRouter` + `Routes` + nested layouts
  - Auth pages rendered outside the main layout shell
  - App pages rendered inside a shared `Layout` with sidebar and top bar

- **Code Quality**
  - Linting: `npm run lint`
  - Type safety with TypeScript strict settings
  - Example tests in `src/test` to bootstrap your own coverage

---

## Scripts

Useful npm scripts:

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
  },
}
```

---

## Roadmap Ideas

If you plan to continue evolving this app, potential next steps include:

- Real backend integration for documents, notes, tasks, and AI
- Full authentication & authorization (JWT/session-based)
- User-level configuration for AI models and tools
- Sharing/collaboration features for teams
- Advanced analytics and usage insights

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

Specify the license you intend to use. For example:

- MIT
- Apache-2.0
- Proprietary / All Rights Reserved

```text
TODO: Choose a license and replace this section accordingly.
```
