# WealthOS Home — Design Brief for Antigravity

## Project Overview

**WealthOS Home** is a premium financial management application for Israeli users to manage home and business finances. The design must convey **trust, sophistication, and clarity** while making complex financial data feel approachable and empowering.

---

## Brand Identity

**Name:** WealthOS Home  
**Tagline:** "ניהול פיננסי חכם — הבית, העסק, הכל במקום אחד"  
**Target Audience:** Israeli adults 28-55, business owners and homeowners  
**Tone:** Professional yet warm, smart but not cold, premium without being intimidating

---

## Design Philosophy

### Core Principles
1. **Data Clarity First** — Financial data must be instantly readable. Never sacrifice legibility for aesthetics.
2. **Progressive Disclosure** — Show summaries first, details on demand.
3. **Trust Through Design** — Clean, structured, no clutter. Users entrust their financial life to this app.
4. **RTL Native** — Full Hebrew RTL support as default, not an afterthought.
5. **Dark Mode Primary** — Financial dashboards shine in dark mode. Light mode as secondary.

---

## Color System

### Primary Palette (Dark Mode Default)
```
Background:      #0A0A0F  (near-black with slight blue)
Surface:         #12121A  (card backgrounds)
Surface Elevated:#1A1A26  (modals, popovers)
Border:          #2A2A3A  (subtle dividers)

Primary Accent:  #6366F1  (Indigo — trust & technology)
Primary Hover:   #818CF8
Primary Active:  #4F46E5

Success/Income:  #10B981  (Emerald green — money in)
Danger/Expense:  #EF4444  (Red — money out)
Warning:         #F59E0B  (Amber — attention needed)
Info:            #3B82F6  (Blue — neutral info)

Text Primary:    #F1F5F9
Text Secondary:  #94A3B8
Text Muted:      #475569
```

### Light Mode Palette
```
Background:      #F8FAFC
Surface:         #FFFFFF
Surface Elevated:#F1F5F9
Border:          #E2E8F0

(Accent colors remain the same)

Text Primary:    #0F172A
Text Secondary:  #475569
Text Muted:      #94A3B8
```

### Category Color Coding
Each expense category has a distinct color for instant visual recognition in charts and lists.

---

## Typography

### Font Stack
- **Primary:** "Inter" — clean, modern, excellent Hebrew support
- **Numbers/Data:** "Tabular Nums" variant of Inter — fixed-width digits for financial data alignment
- **Hebrew:** Native system font fallback for pure Hebrew content

### Scale
```
Display:   48px / 600 weight  — Hero numbers (net worth, total)
H1:        36px / 700 weight  — Page titles  
H2:        24px / 600 weight  — Section headers
H3:        20px / 600 weight  — Card titles
Body:      16px / 400 weight  — Regular content
Small:     14px / 400 weight  — Secondary info
XSmall:    12px / 500 weight  — Labels, tags
```

### Financial Number Display
- All monetary amounts use tabular numbers
- ILS amounts: Format as "₪1,234.56" or "1,234 ₪" (RTL)
- Positive amounts: `#10B981` (green)
- Negative amounts: `#EF4444` (red)
- Zero: Text muted color

---

## Component Design Language

### Cards
- Subtle glass morphism effect: `backdrop-blur: 8px`
- Border: 1px solid with 15% opacity
- Border radius: `16px` for major cards, `12px` for inner cards
- Hover: slight elevation + border brightness increase
- Padding: `24px` standard, `16px` compact

### Charts (Recharts)
- **Area Charts:** Monthly income vs expenses — smooth curves, gradient fill
- **Bar Charts:** Category breakdown — horizontal bars preferred for RTL
- **Donut Charts:** Budget allocation — thick donut, animated on load
- **Sparklines:** Trend indicators in card headers
- All charts: No grid lines in minimal mode, subtle in detailed mode
- Tooltips: Dark background, clean typography, currency formatted

### Navigation (Sidebar)
- Collapsible sidebar (64px icons / 240px expanded)
- Active state: Indigo left border + subtle background
- Icons: Lucide React icons, 20px, consistent stroke width
- Hebrew labels when expanded

### Data Tables
- Zebra striping: subtle (2% opacity difference)  
- Row hover: 5% brightness increase
- Sticky header on scroll
- Amount column: Always right-aligned, monospace
- Category pill: Colored dot + label
- "Needs Review" rows: Subtle amber left border

### Buttons
```
Primary:   bg-indigo-600, hover:bg-indigo-500, rounded-xl, h-10
Secondary: bg-white/10, hover:bg-white/15, border border-white/20
Destructive: bg-red-500/20, text-red-400, hover:bg-red-500/30
Ghost:     transparent, hover:bg-white/5
```

### Input Fields
- Background: slightly elevated from page (`#1A1A26` in dark)
- Focus ring: `2px solid #6366F1` with `4px` offset
- Rounded: `12px`
- Height: `44px` (touch-friendly)
- Hebrew placeholder text

---

## Page Layouts

### Dashboard (Overview)
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Month selector + Import button + Profile           │
├────────────┬────────────────────────────────────────────────┤
│            │  Net Worth Banner (hero card)                  │
│            ├──────────┬──────────┬──────────────────────────┤
│ Sidebar    │ Income   │ Expenses │ Savings Rate             │
│ Nav        ├──────────┴──────────┴──────────────────────────┤
│            │ Income vs Expenses Chart (area chart)          │
│            ├─────────────────────┬──────────────────────────┤
│            │ Top Categories      │ AI Insights              │
│            │ (horizontal bars)   │ (insight cards)          │
│            ├─────────────────────┴──────────────────────────┤
│            │ Recent Transactions (5 latest)                 │
└────────────┴────────────────────────────────────────────────┘
```

### Transaction List
- Full-page scrollable list
- Sticky filter bar: date range, categories, accounts, search
- Group by date (today, yesterday, dates)
- Batch select + categorize for "needs review" items
- Inline category assignment (click to change)

### Import Flow (Key UX Flow)
```
Step 1: Upload zone (drag & drop, large + prominent)
        → Supported formats clearly shown
        
Step 2: Processing state (progress animation)
        → "סורק את הדף..." with bank logo detection
        
Step 3: Review results
        → Green: Auto-categorized ✓
        → Orange: Needs your review (requires click)
        → Summary: "127 עסקאות | 115 סווגו אוטומטית | 12 דורשות סיווג"
        
Step 4: Review unknowns
        → Card for each unknown transaction
        → Category selector with search
        → "Remember this merchant" toggle (creates auto-rule)
        
Step 5: Confirmation + Dashboard update animation
```

### Mobile View (Responsive)
- Bottom navigation bar (5 main sections)
- Swipeable cards for month navigation
- Simplified charts (sparklines instead of full charts)
- Full-screen modals instead of sidebars
- Large touch targets (minimum 44px)

---

## Micro-Interactions & Animations

### Principles
- Duration: 150-300ms for UI feedback, 400-600ms for data transitions
- Easing: `ease-out` for elements entering, `ease-in` for leaving
- No animations for critical financial data (numbers update instantly)

### Specific Animations
1. **Number Counter:** When amounts change, animate counting from old to new value (300ms)
2. **Chart Load:** Bars/areas draw in from left on first render
3. **Category Tag:** Slight bounce when applied to transaction
4. **Import Progress:** Smooth progress bar with transaction counter
5. **Insight Cards:** Slide in from right, staggered delay
6. **Sidebar Collapse:** Smooth width transition with icon/text crossfade

---

## Key Screens to Design

### Priority 1 (MVP)
1. **Dashboard / Overview** — monthly financial summary
2. **Transaction List** — with inline categorization
3. **Import Flow** — PDF/CSV upload + review (4 steps)
4. **Category Manager** — manage & create categories

### Priority 2
5. **Business Module** — business-specific P&L view
6. **Properties & Mortgages** — asset overview
7. **Loans Dashboard** — liability tracking
8. **AI Insights** — full insights center

### Priority 3  
9. **Settings** — profile, accounts, notification preferences
10. **Onboarding** — first-time setup wizard (5 steps)

---

## Iconography

Use **Lucide React** icons throughout:
- Consistent: `strokeWidth={1.5}`, size `20px` in nav, `16px` inline
- Category icons: use semantic icons (utensils, car, home, heart, etc.)
- Financial actions: trending-up, trending-down, wallet, piggy-bank, landmark

---

## Accessibility

- WCAG AA contrast minimum (4.5:1 for text)
- Focus indicators on all interactive elements
- Screen reader support for financial data tables
- Keyboard navigation for all core flows
- `prefers-reduced-motion` support

---

## Design Deliverables Requested

1. **Component Library** — Figma/Framer components for all UI elements
2. **Design Tokens** — Colors, spacing, typography as JSON/CSS variables
3. **Screen Designs** — 10 priority screens in dark mode (desktop + mobile)
4. **Prototype** — Clickable prototype for Import Flow (key differentiator)
5. **Icon Set** — Category icons in consistent style

---

## Technical Handoff Notes

- Export design tokens as CSS custom properties compatible with Tailwind CSS
- All components must work as Shadcn/UI variants
- Font sizes using `rem` units (base 16px)
- Spacing based on 4px grid
- All border radii in 4px increments
- Z-index scale: 10 (dropdowns), 20 (modals), 30 (notifications)

---

*WealthOS Home — Designed to make financial clarity feel beautiful.*
