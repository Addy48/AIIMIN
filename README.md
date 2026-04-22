# AIIMIN — The Behavior-Shaping OS

AIIMIN is a premium, high-fidelity behavioral intelligence platform designed to bridge the gap between human intention and consistent action. Evolved from a simple tracker into a sophisticated **Behavior-Shaping Dashboard**, it combines elite visual aesthetics with rigorous algorithmic analysis.

## 🌌 The Ghost Interface
Built on the **Obsidian Gold** design system, AIIMIN utilizes high-performance Glassmorphism and pulsing spatial cues (the AI Heartbeat) to create a weightless, focused environment.
- **System Status Bar**: A floating, pill-shaped navigation hub with real-time AI sync status.
- **Luxury Glass Panels**: Consistent utility-first depth for maximum clarity.

## 🧠 Core Intelligence Systems

### 1. Momentum Engine
An algorithmic layer that calculates weighted scores across multiple domains (Gym, Learning, Discipline). It converts raw data into a narrative of compounding momentum.

### 2. Causal Node Matrix
A diagnostic system that identifies the statistical "Top Drivers" of your life. It analyzes correlations between specific habits (e.g., Somatic Output) and outcomes (e.g., Mood Baseline) to reveal exactly which levers to pull.

### 3. Behavioral Audit System
A legal-grade reporting suite that generates premium PDF audits. These documents provide executive summaries, 365-day momentum heatmaps, and automated system recommendations based on 30-day trailing data.

---

## 🛠️ Technical Architecture

### Frontend Layer
- **Core**: React 18+ with Vite
- **Styling**: Tailwind CSS + Custom Global CSS Tokens
- **PDF Core**: jsPDF + jspdf-autotable (Modular v5 structure)
- **State**: React Hooks + LocalStorage persistence

### Backend Layer (The Mesh)
- **Server**: Node.js & Express
- **Persistence**: Supabase (PostgreSQL)
- **Integrations**: 
  - **Google Calendar**: Real-time time-blocking data.
  - **YouTube API**: Habit-based learning feeds.
  - **Custom Auth**: Username-to-Identity mapping (e.g., AU48 legacy mapping).

---

## 🚀 Quick Start

### 1. Environment Configuration
Ensure `.env` files are populated in both `frontend` and `backend` directories as per `.env.example`.

### 2. Installation
```bash
# Fix permissions (Mac/Linux)
sudo chown -R $(id -u):$(id -g) ~/.npm
sudo chown -R $(id -u):$(id -g) .

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### 3. Execution
```bash
# Terminal 1 (Backend)
npm start

# Terminal 2 (Frontend)
npm start
```

---

## 🏛️ Project Structure
- `/frontend`: React application using the "Ghost Interface" design tokens.
- `/backend`: Node.js server handling analytical processing and API handshakes.
- `/brain`: Persistent AI context and implementation logs.

*v2.1.1 — Obsidian Gold Edition*
