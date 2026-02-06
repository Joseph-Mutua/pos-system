# Bulk POS

**Live app:** [https://pos-system-three-omega.vercel.app/](https://pos-system-three-omega.vercel.app/)

A keyboard-first point-of-sale and weigh ticket app for high-throughput truck processing. Built with React, TypeScript, and Vite.

## Features

- **Fuzzy search comboboxes** — Truck, Customer, Order, and Product fields with fuzzy matching and keyboard navigation
- **Command palette** — `Ctrl+K` / `⌘+K` to search across all entities and jump to a selection
- **Real-time scale** — Simulated scale weight with stability indicator; capture gross/tare only when stable
- **Gross / tare / net** — Automatic net weight and ticket summary; F2/G for gross, F3/T for tare
- **Quick repeat** — Recent loads per customer and “repeat last” (R) / “repeat product” (P)
- **Keyboard-first** — Shortcuts for focus, capture, and finalize so operators can work with minimal mouse use

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Build for production:

```bash
npm run build
npm run preview
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` / `⌘+K` | Open command palette |
| `T` / `C` / `O` / `P` | Focus truck / customer / order / product search |
| `F2` / `G` | Capture gross weight |
| `F3` / `T` | Capture tare weight |
| `N` | New ticket |
| `F` / `Enter` | Finalize transaction |
| `R` | Repeat last ticket |
| `P` | Repeat last product |
| `O` | Toggle online/offline |
| `Escape` | Close palette or hotkeys modal |

Use the **Hotkeys** button in the app for the full list.

## Stack

- **React 18** — UI
- **TypeScript** — Types
- **Vite 7** — Build and dev server
- **CSS Modules** — Component styles (e.g. `POSApp.module.css`)

## Project layout

```
src/
  main.tsx           # Entry point, mounts POSApp
  global.css         # Global theme and CSS variables
  vite-env.d.ts      # Vite and CSS module type declarations
  hooks/
    useTheme.ts      # Theme (light/dark) state
  components/
    POSApp.tsx       # Main app and layout
    POSApp.module.css
    SearchField.tsx  # Fuzzy search combobox (truck, customer, order, product)
    CommandPalette.tsx
    ThemeToggle.tsx
    posData.ts       # Seed data (trucks, customers, orders, products, history)
    posTypes.ts      # Entity, HistoryRecord, FocusableId
    posUtils.ts      # toDisplay, pounds, formatTime, entityById
```

## License

Private / internal use.
