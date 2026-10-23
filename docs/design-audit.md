# Design & Architecture Audit: The Decant Bar

## 1. Design Tokens

### Colours
- **`--bg-primary: #11110f`**: Root document background, Layout wrapper, page containers, Hero section, input field fills.
- **`--bg-surface: #171715`**: Primary card backgrounds, sidebar drawers, order summary sidebars, footer, announcements.
- **`--bg-elevated: #1f1e1a`**: Secondary elevated surfaces, active dropdown items, select controls, pill buttons.
- **`--text-primary: #f4efe6`**: Primary typography, headings, prices, active tabs, contrast highlights.
- **`--text-secondary: #c5c1b9`**: Secondary body copy, descriptions, nav links, form labels, specifications.
- **`--text-muted: #8e8a82`**: Helper text, spray calculations, metadata labels, breadcrumbs, placeholder text.
- **`--accent-gold: #c6a15b`**: Primary luxury accent, buttons, active borders, ratings stars, icons, indicator tracks.
- **`--accent-sand: #d8c08a`**: Secondary warm accent, button hover states, secondary highlights.
- **`--border-subtle: rgba(244, 239, 230, 0.08)` / `border-white/10`**: Card borders, dividers, grid partitions.
- **`--border-medium: rgba(244, 239, 230, 0.18)` / `border-white/15`**: Input outlines, interactive control borders.

### Typography
- **Families**:
  - Display/Serif: `'Cormorant Garamond', Georgia, serif` (`.font-display`)
  - Sans/Body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (`.font-sans`)
  - Monospace: UI Monospace fallbacks (`font-mono`, used for spray numbers and verification codes)
- **Scale & Roles**:
  - Hero Display: `text-6xl sm:text-7xl lg:text-[100px]`, line-height `0.9`, Cormorant 400/500
  - Page Titles (H1): `text-3xl` to `text-6xl`, Cormorant 400/600
  - Section Headings (H2): `text-3xl` to `text-5xl`, Cormorant 400/600
  - Component/Card Titles (H3): `text-xl` to `text-2xl`, Cormorant 500/600
  - Eyebrows & Badges: `text-[9px]` to `text-xs`, Inter 500/600, uppercase, tracking `0.2em` to `0.38em`
  - Body & Descriptions: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), Inter 300/400, leading relaxed
  - Buttons & CTAs: `text-[10px]` to `text-xs`, Inter 600, uppercase, tracking `0.16em` to `0.22em`
  - Prices / Numbers: `text-xl` to `text-3xl`, Cormorant Garamond with `lining-nums`

### Spacing, Radii, Shadows & Breakpoints
- **Container Max-Width**: `max-w-[1440px]` with horizontal padding `px-6 sm:px-8 lg:px-16` (`max-w-7xl` on admin/catalog).
- **Section Padding**: `py-16 sm:py-24` up to `py-20 sm:py-28 lg:py-36`.
- **Radii**: Sharp `rounded-none`/`rounded-sm` (buttons, inputs, cards); Pill `rounded-full` (chips, badges, stars); Soft `rounded-lg`/`rounded-xl`/`rounded-2xl` (modals, category cards, preview sheets).
- **Shadows**: Tailwind `shadow-sm` through `shadow-2xl`; Custom gold glows `shadow-[0_0_8px_rgba(198,161,91,0.2)]`, `shadow-[0_0_15px_rgba(198,161,91,0.25)]`, `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)]`.
- **Breakpoints**: Tailwind standard: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

---

## 2. Routes, Pages & Component Hierarchy

- **Global Shell**: `src/layouts/Layout.jsx`
  1. Announcement Banner: `src/components/AnnouncementBar.jsx`
  2. Sticky Navigation Header: `src/components/Navbar.jsx`
  3. Routed Main Outlet: `<Outlet />` (wrapped in page transition `motion.div`)
  4. Footer: `src/components/Footer.jsx`

- **`/` — Home**: `src/pages/Home.jsx`
  1. Welcome Banner: `src/components/Hero.jsx`
  2. Compact Filter Controls: `src/components/FilterBar.jsx`
  3. Best Seller Decants: `src/components/home/FeaturedDecants.jsx` (cards: `src/components/products/ProductCard.jsx`)
  4. Curated Collections: `src/components/home/CategoryBanners.jsx` (cards: `src/components/home/CategoryCard.jsx`)
  5. Decant Philosophy & Sizing: `src/components/home/DecantGuide.jsx`
  6. Customer Reviews Marquee: `src/components/home/Testimonials.jsx` (cards: `src/components/ui/testimonial-card.jsx`)
  7. Store Guarantees: `src/components/home/Guarantees.jsx`

- **`/products` & `/shop` — Catalog**: `src/pages/products/Products.jsx`
  1. Dynamic Category/Gender Header (inline)
  2. Filter Bar: `src/components/FilterBar.jsx`
  3. Search & Reset Bar (inline)
  4. Product Grid: `src/components/products/ProductCard.jsx`

- **`/product/:id` — Fragrance Profile**: `src/pages/ProductDetail.jsx`
  1. Breadcrumbs Navigation (inline)
  2. Sticky Left Image Showcase: `src/components/common/ProductImage.jsx` & Trust Badges
  3. Title, Metadata & Editorial Note (inline)
  4. Sizing Picker & Instant Purchase Controls (inline)
  5. Scent Theme Bars: `src/components/product/MainAccords.jsx`
  6. Tiered Note Pyramid: `src/components/product/PerfumePyramid.jsx`
  7. Suitability Meter: `src/components/product/WhenToWear.jsx`
  8. Specifications & Performance Matrix (inline)
  9. Restock Alert Modal (inline)

- **`/cart` — Shopping Bag**: `src/pages/Cart.jsx`
  1. Empty State Banner (inline) OR:
  2. Cart Header (inline)
  3. Line Items Stepper List (inline)
  4. Sticky Order Summary Sidebar with Free Shipping Progress Bar (inline)

- **`/checkout` — Checkout**: `src/pages/Checkout.jsx`
  1. Completed Order Confirmation (inline) OR Empty Bag Guard (inline) OR:
  2. Header & SSL Notice (inline)
  3. Customer Contact Section (inline)
  4. Shipping Address Section (inline)
  5. Payment Selector [COD vs. Razorpay Gateway] (inline)
  6. Sticky Order Summary Sidebar & Mini Item List (inline)

- **`/about` — Brand Story**: `src/pages/About.jsx`
  1. Cinematic Hero Section with Scroll Indicator (inline)
  2. Editorial Story Split Showcase (inline)
  3. Fragrance Moment Banner (inline)
  4. Care & Precision Standards (inline)
  5. Final Exploration CTA (inline)

- **`/contact` — Concierge**: `src/pages/Contact.jsx`
  1. Split Editorial Hero & Concierge Plaque (inline)
  2. Assistance Department Cards (inline)
  3. Direct Enquiry Message Form (inline)
  4. Accordion FAQ Section (inline)
  5. Closing CTA (inline)

- **`/reviews` — Customer Reviews**: `src/pages/Reviews.jsx`
  1. Breadcrumb + Community Reviews Suite: `src/components/home/Testimonials.jsx`

- **`/login` & `/register` — Authentication**: `src/pages/Login.jsx`, `src/pages/Register.jsx`
  1. Client Auth Form / Registration Details (inline)
  2. OTP Verification Dialogs & Modals (inline)

- **`/account` — Customer Hub**: `src/pages/Account.jsx`
  1. Welcome Header & Logout Control (inline)
  2. Sidebar Navigation Tabs (inline)
  3. Tab Panels: Order History, Profile/Address, Password Security (inline)

- **`/admin/*` — Management Portal**: `src/layouts/AdminLayout.jsx` + `src/pages/admin/*`
  - Shell: Collapsible Admin Sidebar, Top App Bar (`src/layouts/AdminLayout.jsx`)
  - Pages: `AdminDashboard.jsx`, `AdminOrders.jsx`, `AdminInventory.jsx`, `AdminProducts.jsx`, `AdminReviews.jsx`

---

## 3. Existing Animation Code & Libraries

- **Libraries Installed**:
  - `motion` (v14.0.0, imports from `motion/react`)
  - Native CSS animations & transitions via `@tailwindcss/vite` (v4.3.3)
- **Active Motion Implementations**:
  - `LuxuryLoader.jsx`: Self-drawing SVG path (`pathLength: 0 -> 1`), glowing filter (`#goldLineGlow`), spinning SVG arc, tracking expansion, radial aura pulse.
  - `Layout.jsx`: Route page transitions via `<motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.38 }}>`.
  - `Hero.jsx`: Orchestrated stagger (`staggerChildren: 0.12`, `ease: [0.16, 1, 0.3, 1]`) and background image zoom (`scale: 1.05 -> 1`).
  - `CategoryCard.jsx`: Interactive 3D mouse tilt with `useMotionValue`, `useSpring`, `useTransform` (`rotateX`, `rotateY`, `perspective: 1000`).
  - `ProductCard.jsx`: Viewport reveal animations (`whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: "-30px" }}`).
  - `Navbar.jsx`: Mobile drawer sliding panel (`initial={{ x: "-100%" }} animate={{ x: 0 }}`) with `AnimatePresence` backdrop.
  - `Contact.jsx`: FAQ accordion smooth expansion (`initial={{ height: 0 }} animate={{ height: "auto" }}`).
  - `index.css`: Infinite Marquee `@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }` (`.animate-marquee` 35s linear infinite, pauses on `:hover`).
  - Accessibility: Every motion component implements `useReducedMotion()` and `index.css` defines `@media (prefers-reduced-motion: reduce)` overrides.

---

## 4. Hardcoded Colours and Sizes (Token Bypasses)

- **Colours Bypassing CSS Variables**:
  - `#11110f`: Directly written as arbitrary classes `bg-[#11110f]`, `text-[#11110f]` across components instead of `var(--bg-primary)`.
  - Secondary Dark Surfaces: `#151512`, `#161613`, `#141412`, `#181815`, `#1c1c18`, `#121210`, `#221d15`, `#1a1915`, `#131311` bypassing `--bg-surface` (`#171715`).
  - Typography Hexes: `#f4efe6`, `#c5c1b9`, `#8e8a82` hardcoded into class names instead of token utilities.
  - Non-tokenized Text: `#b8b3a9` in `Featurebar.jsx` and `DecantGuide.jsx`.
  - Gold Accents: `#c6a15b` directly written in Tailwind arbitrary classes; `#d8b368` hardcoded in `FilterBar.jsx`; `#9e7834` in `LuxuryLoader.jsx`.
  - Category Gradients: `#221408`, `#170e06`, `#0d1624`, `#09101b`, `#240b18`, `#190710`, `#a3b8cc`, `#d4a373`.
  - Accord Bars: Default `#543e2e` in `MainAccords.jsx` and 15 arbitrary colors in `AdminProducts.jsx` (`ACCORD_COLORS`).
- **Sizes & Dimensions Bypassing Scale**:
  - Fixed Heights: `Hero.jsx` (`min-h-screen`); `About.jsx` (`min-h-[90vh]`, `min-h-[60vh] sm:min-h-[70vh]`); `CategoryCard.jsx` (`min-h-[480px] sm:min-h-[520px]`); `Navbar.jsx` (`h-20`, `h-16`, `h-[100dvh]`); `AdminLayout.jsx` (`h-20`); `Checkout.jsx` (`max-h-72`); `Testimonials.jsx` (`max-h-[90vh]`); `LuxuryLoader.jsx` (`h-[340px] w-[340px]`).
  - Arbitrary Column Widths: `ProductDetail.jsx` (`lg:grid-cols-[420px_1fr]`, `max-w-[420px]`, `sm:w-[82%]`); `Container.jsx` (`max-w-[1440px]`); `AdminDashboard.jsx` (`max-w-7xl`).
  - Typography: `Hero.jsx` (`lg:text-[100px]`).

---

## 5. Risks for Scroll Animation

- **Body Overflow Rules**: `index.html` sets `<body style="... overflow-x: hidden;">`. In CSS overflow specifications, `overflow-x: hidden` computes `overflow-y` to `auto` or non-visible on viewport ancestors, which severs sticky positioning context and breaks `position: sticky` on child elements across various browsers.
- **Dynamic Body Style Mutations**: `Navbar.jsx` (line 28) and `Testimonials.jsx` (line 148) directly write `document.body.style.overflow = "hidden"` on modal/drawer open. This disrupts active scroll listeners, resets scroll position benchmarks, and breaks scroll-driven animations during transitions.
- **Page Container Overflow Hidden**: `About.jsx` (line 29) and `Contact.jsx` (line 111) apply `overflow-x-hidden` on the outermost page wrapper `<div>`, completely preventing any descendant sticky positioning from attaching to the viewport scroll context.
- **Section Overflow Hidden**: `Hero.jsx` (line 29) sets `overflow-hidden` on `<section>`, trapping absolute parallax layers and preventing cross-section scroll timeline binding.
- **Viewport Height Jitter**: `Hero.jsx` (`min-h-screen`) and `About.jsx` (`min-h-[90vh]`, `min-h-[60vh]`) use raw `vh` units rather than dynamic `dvh`. On mobile browsers, the expanding and retracting address bar continuously triggers layout recalculations and jumpy scroll triggers.
- **Active Sticky Dependencies at Risk**: Five critical interfaces rely on unbroken viewport scrolling:
  1. `Navbar.jsx`: `<header className="sticky top-0 z-50 ...">`
  2. `AdminLayout.jsx`: `<header className="... sticky top-0 z-30 ...">`
  3. `ProductDetail.jsx`: `<div className="sticky top-28">` (Left product media column)
  4. `Cart.jsx`: `<div className="sticky top-28 ...">` (Order Summary sidebar)
  5. `Checkout.jsx`: `<div className="sticky top-28 ...">` (Order Summary sidebar)
  Any parent with `overflow: hidden`, `overflow-x: hidden`, or CSS containment (`contain: paint`) breaks all five sticky layouts.
