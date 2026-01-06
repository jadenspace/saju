# AGENTS.md - Coding Agent Guidelines

> Guidelines for AI agents working in the **saju** (사주) codebase - a Korean fortune-telling/astrology web application.

## Project Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: CSS Modules + Tailwind CSS
- **Architecture**: Feature-Sliced Design (FSD) pattern

## Build/Lint/Test Commands

```bash
# Development
npm run dev          # Start dev server

# Build & Production
npm run build        # Production build
npm run start        # Start production server

# Linting
npm run lint         # ESLint check
npm run lint:css     # Stylelint for CSS files (with --fix)

# Formatting
npm run format       # Prettier write
npm run format:check # Prettier check only

# No test framework currently configured
```

## Project Structure (Feature-Sliced Design)

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (thin wrapper)
│   ├── result/             # Saju result page
│   ├── new-year-2026/      # 2026 fortune page
│   ├── guide/              # Educational guide pages
│   ├── search/             # Ilju search feature
│   └── contact/            # Contact form
├── views/                  # Page-level components (complex UI)
│   ├── home/ui/Page.tsx
│   ├── result/ui/Page.tsx
│   └── new-year-2026/ui/Page.tsx
├── features/               # Feature modules (user interactions)
│   ├── saju-form/          # Main birth data input form
│   ├── ilju-search/        # Search by day pillar
│   └── contact/            # Contact form feature
├── entities/               # Business entities
│   ├── saju/               # Saju-related types and UI components
│   │   ├── model/types.ts  # Core type definitions
│   │   └── ui/             # Entity UI components
│   └── policy/             # Policy-related components
├── shared/                 # Shared utilities and UI
│   ├── lib/                # Business logic & utilities
│   │   ├── saju/           # Saju calculation engine
│   │   │   ├── calculators/# SajuCalculator, TenGod, etc.
│   │   │   └── data/       # Static data (Gongmang, Ohaeng, etc.)
│   │   ├── theme/          # Theme provider & hook
│   │   └── google/         # Google integrations (AdSense, GTM)
│   └── ui/                 # Shared UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── *.module.css
└── types/                  # Global type declarations
    └── lunar-javascript.d.ts
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - Never use `as any`, `@ts-ignore`, or `@ts-expect-error`
- **Interfaces for object shapes**, especially for Props and entities
- **Naming conventions**:
  - Props: `ComponentNameProps` (e.g., `ButtonProps`, `SajuCardProps`)
  - Types: PascalCase (e.g., `Pillar`, `SajuData`, `DaeunPeriod`)
  - No `I` prefix for interfaces

```typescript
// Good
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

// Bad
interface IButtonProps { ... }
type TButtonProps = { ... }
```

### Imports

- **Absolute imports** via `@/*` alias for `src/*`
- **Order**: External packages → Internal absolute imports → Relative imports → Styles
- **No barrel exports** - import directly from source files

```typescript
// Good
import { Lunar, Solar } from "lunar-javascript";
import { ThemeProvider } from "@/shared/lib/theme";
import { Button } from "@/shared/ui/Button";
import styles from "./Page.module.css";

// Bad
import styles from "./Page.module.css";
import { Button } from "@/shared/ui/Button";
```

### React Components

- **Named exports** (not default exports)
- **Function declarations** for components, not arrow functions at module level
- **Props destructuring** in function signature
- **CSS Modules** for styling with `clsx` for conditional classes

```typescript
// Good
export const Button = ({ className, variant = "primary", children, ...props }: ButtonProps) => {
  return (
    <button className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};

// Bad
export default function Button(props: ButtonProps) { ... }
```

### Formatting (Prettier)

- **Tab width**: 2 spaces
- **Quotes**: Double quotes (`"`)
- **Trailing comma**: All (`es5`)
- **Semicolons**: Yes
- **Arrow function parens**: Always (`(x) => x`)
- **Bracket spacing**: Yes (`{ foo }`)
- **Tailwind plugin**: Auto-sorts Tailwind classes

### CSS (Stylelint)

- **CSS Modules** with `.module.css` extension
- **Class names**: camelCase (`styles.buttonPrimary`)
- **Property order**: Position → Display/Box Model → Typography → Visual → Misc

## Error Handling

- **Form validation**: Use `setError()` state with user-friendly Korean messages
- **Try-catch** for external library calls (e.g., lunar calendar conversion)
- **No empty catch blocks**

```typescript
try {
  calendar.setLunarDate(year, month, day, isLeapMonth);
  // ...
} catch (err) {
  setError("유효하지 않은 음력 날짜입니다.");
  setLoading(null);
  return;
}
```

## State Management

- **React hooks** (useState, useEffect, useRef)
- **No external state library** (Redux, Zustand, etc.)
- **Local storage** for persisting user preferences
- **URL query params** for passing data between pages

## Key Libraries

| Library                 | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `lunar-javascript`      | Lunar/Solar calendar conversion, Saju calculations |
| `korean-lunar-calendar` | Korean lunar calendar validation                   |
| `clsx`                  | Conditional CSS class names                        |
| `swiper`                | Carousel/slider components                         |
| `es-hangul`             | Korean text utilities                              |

## Domain Knowledge

This is a Korean Saju (사주, Four Pillars of Destiny) application:

- **Pillars**: Year (년주), Month (월주), Day (일주), Hour (시주)
- **Gan (천간)**: 10 Heavenly Stems - 갑을병정무기경신임계
- **Ji (지지)**: 12 Earthly Branches - 자축인묘진사오미신유술해
- **Ohaeng (오행)**: Five Elements - Wood, Fire, Earth, Metal, Water
- **Daeun (대운)**: 10-year fortune periods
- **Seun (세운)**: Yearly fortune

## File Naming

- **Components**: PascalCase (`SajuCard.tsx`, `Button.tsx`)
- **CSS Modules**: Match component name (`Button.module.css`)
- **Hooks**: camelCase with `use` prefix (`useTheme.ts`, `useIljuSearch.ts`)
- **Utilities/Data**: camelCase or PascalCase for classes (`SajuCalculator.ts`)
- **Pages**: `page.tsx` (Next.js convention)

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` - GTM container ID
- `NEXT_PUBLIC_GOOGLE_ADSENSE_PID` - AdSense publisher ID
- Store in `.env.local` (gitignored)

## Important Notes

1. **React Compiler enabled** - Code is optimized automatically
2. **Console removal in production** - `console.log` stripped (except error/warn)
3. **Korean language** - UI text is in Korean; comments may be in Korean
4. **No tests** - No testing framework configured currently
5. **No API routes** - Pure client-side calculation; no backend

## Quick Reference

```bash
# Check for type errors
npx tsc --noEmit

# Check lint issues
npm run lint

# Format all files
npm run format
```
