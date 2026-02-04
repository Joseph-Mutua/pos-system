# POS Challenge — Fastweigh

A **keyboard-first Point of Sale (POS)** interface for the bulk materials industry, built with React and TypeScript. This project fulfills the Fastweigh UI/UX Developer Challenge requirements.

## Requirements Implemented

| Requirement                                                 | Implementation                                                                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuzzy search comboboxes with keyboard shortcuts**         | Truck (⌘K), Customer (⌘J), Order (⌘O), Product (⌘P). Subsequence fuzzy match across all relevant fields. Tab to cycle, Enter to select, Esc to close. |
| **Real-time scale weight display with stability indicator** | Gross / Tare / Net in lbs and tons. STABLE (green) vs READING (orange, blinking) when scale is simulated unstable.                                    |
| **Quick transaction history for repeat customers**          | Recent transactions panel; click a row to restore Truck + Customer.                                                                                   |
| **Gross/tare/net weight calculations**                      | Values rounded to 20 lb increment; displayed in both lbs and tons.                                                                                    |
| **Keyboard-first workflow**                                 | All comboboxes, navigation, and Print Ticket (⌘↵) are keyboard-driven. Hotkeys modal (⌘?) lists all shortcuts.                                        |

## Design System

- **Colors**: `--accent-cyan`, `--accent-purple`, `--accent-green`, `--accent-orange`, `--text-primary`, `--text-secondary`, `--text-dim`, `--bg-deep`, `--bg-card`, etc.
- **Typography**: Roboto (sans), JetBrains Mono (mono).
- **Theming**: Light/dark mode via `data-theme="dark"` and CSS variables; theme toggle in the header.

## Tech Stack

- **React 19** + **TypeScript** (strict)
- **Vite** for build and dev server
- **CSS Modules** for component styles
- Static seed data (no API)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Best with a **keyboard**; layout is **responsive** across viewports.

### Scripts

| Script              | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start dev server               |
| `npm run build`     | Production build to `dist/`    |
| `npm run preview`   | Preview production build       |
| `npm run typecheck` | Run TypeScript check (no emit) |
| `npm run lint`      | Run ESLint                     |

## Project Structure

```
Challenge/
├── src/
│   ├── components/
│   │   ├── Combobox/       # Reusable fuzzy search combobox (ARIA listbox)
│   │   ├── ScaleDisplay/   # Scale weight + stability indicator
│   │   ├── TransactionHistory/
│   │   ├── HotkeysModal/   # ⌘? keyboard shortcuts
│   │   ├── PosInterface/   # Main POS layout and state
│   │   └── ThemeToggle/
│   ├── data/
│   │   └── seed.ts         # Trucks, customers, orders, products (200 each)
│   ├── lib/
│   │   └── posFieldConfig.ts  # Field config, getFilteredOptions, findSelectedById
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useFuzzyMatch.ts
│   │   └── useKeyboardShortcut.ts
│   ├── types/
│   ├── utils/
│   │   └── weight.ts       # roundToIncrement, formatWeight
│   ├── App.tsx
│   ├── index.css           # Design system (variables, reset)
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Keyboard Shortcuts

| Shortcut        | Action                        |
| --------------- | ----------------------------- |
| ⌘K / Ctrl+K     | Open Truck search             |
| ⌘J / Ctrl+J     | Open Customer search          |
| ⌘O / Ctrl+O     | Open Order search             |
| ⌘P / Ctrl+P     | Open Product search           |
| Tab             | Next field (when search open) |
| ↑ / ↓           | Move highlight in list        |
| Enter           | Select highlighted item       |
| Esc             | Close search                  |
| ⌘↵ / Ctrl+Enter | Print ticket (adds to recent) |
| ⌘? / Ctrl+?     | Show hotkeys modal            |


## Coding Practices

- **TypeScript**: Strict mode; explicit types for props and domain models.
- **Accessibility**: ARIA roles (combobox, listbox, option), `aria-activedescendant`, focus management, keyboard support.
- **Performance**: Memoized filtering (`useMemo`), stable callbacks (`useCallback`), `React.memo` on `ScaleDisplay` and `TransactionHistory`; fuzzy list capped at 50 items.
- **Structure**: Small, focused components; shared field config in `src/lib/posFieldConfig.ts`; design tokens in `index.css`; CSS Modules for encapsulation; responsive layout.

---

Built for Fastweigh
