# 🤖 AI Knowledge Hub (Frontend)

> A premium, highly interactive research dashboard powered by AI. Manage your documents, notes, and tasks with seamless AI integration.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Shadcn UI](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

---

## ✨ Features

### 📊 Intelligent Dashboard

- **Unified Overview**: Real-time statistics for documents, notes, and tasks.
- **Dynamic Previews**: Instantly view recent notes and upcoming high-priority tasks.
- **Smooth Animations**: Powered by Framer Motion and Tailwind Animate for a premium feel.

### 📄 Advanced Document Management

- **Smart Creation**: Create documents via rich text editor or direct file uploads (PDF, DOCX, TXT).
- **Automated Processing**: Backend automatically extracts text for RAG-style operations.
- **Semantic Search**: Powerful search with tag-based filtering for effortless discovery.

### 🤖 AI Contextual Assistance

- **Context-Aware Chat**: Select documents from your library to provide the AI with specific context.
- **Smart Tools**: Modular tools for **Summarization**, **Q&A**, and **Key Point Extraction**.
- **Real-time Interaction**: Interactive chat interface with typing indicators and full message history.

### 📝 Integrated Notes & Tasks

- **Linked Systems**: Connect notes directly to documents for better context.
- **Task Prioritization**: Manage research workflows with priority levels (Low, Medium, High).
- **Persistence**: Fully synchronized with the backend database via TanStack Query.

### 🔒 Security & Personalization

- **Session Control**: Detailed list of active sessions with IP and device tracking.
- **Revocation**: Instant session termination from any device.
- **Theme Support**: Adaptive Dark, Light, and System themes.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Shadcn UI (Radix UI)
- **State Management**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form + Zod
- **Networking**: Axios with JWT interceptors
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- A running instance of the [AI Knowledge Hub Backend](https://github.com/a7medsa22/Ai-Knowledge-Hub)

### Installation

```bash
git clone https://github.com/a7medsa22/Ai-Knowledge-Hub-web.git
cd Ai-Knowledge-Hub-web
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

---

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

1. **Vercel/Netlify**: Simple "drag and drop" or Git integration. Ensure `VITE_API_URL` is set in the environment variables.
2. **Fly.io**: Use the provided `fly.toml` (if available) or a Dockerfile.
3. **Static Hosting**: Upload the contents of the `dist/` folder to any Nginx/Apache server.

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 👤 Author

**Ahmed Salah Sotohy**

- Github: [@a7medsa22](https://github.com/a7medsa22)
- LinkedIn: [Ahmed Salah](https://linkedin.com/in/ahmed-salah-54822625a)

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
