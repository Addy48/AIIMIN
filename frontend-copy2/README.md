# AIIMIN — Behavior-OS Frontend

This is the interface layer of the **AIIMIN Behavior-Shaping OS**. It is a React-based implementation focusing on high-fidelity visual feedback and spatial UI.

## 🎨 Visual Identity: The Ghost Interface
The frontend leverages consistent design tokens defined in `src/index.css` and `tailwind.config.js`.

### Key Design Primitives:
- **Obsidian Dark**: `#050505` (Deep space base)
- **Fluid Gold**: `#D4AF37` (Accent/Momentum)
- **Glassmorphism**: 
  - `.glass-panel`: Standard depth with 8px blur.
  - `.glass-panel-gold`: Premium depth with gold-tinted borders.

## 🏛️ Component Architecture

### 1. Main Dashboard (`src/pages/Dashboard.jsx`)
The central hub utilizing a tabbed layout system (Overview, Focus, Identity, Growth, habits, Money, Analytics, Settings). State is maintained via `activeTab` with local storage persistence.

### 2. Analytical Tier (`src/components/growth/`)
- `CausalNodeAnalysis.jsx`: Dynamic dependency mapping between habits and outcomes.
- `PerformanceDeltaHub.jsx`: 30-day trailing vision gap analysis.

### 3. Reporting Suite (`src/components/Reports.jsx`)
Modular PDF generation using `jsPDF`. Integrated with `jspdf-autotable` for high-fidelity data visualization and automated system recommendations.

## 🛠️ Development

### Scripts
- `npm start`: Runs the development server on `localhost:3000`.
- `npm run build`: Generates the production bundle.

### Design System Integration
To maintain the "Ghost" look, always use the CSS variables:
```css
color: var(--text-1);
background: var(--bg-card);
border: 1px solid var(--border);
```

---
*Powered by the Obsidian Gold Design System*
