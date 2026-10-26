# Expanding search dock

The existing Vite React project already uses Tailwind CSS 4 and Lucide. Reusable components live in src/components/ui, global styles in src/index.css, and @/ resolves to src/. This is the project equivalent of /components/ui; it keeps shared components discoverable and compatible with shadcn aliases.

Added framer-motion and TypeScript without converting existing JavaScript files. components.json supplies shadcn CLI paths. The TypeScript configuration checks the new TSX files; the rest of the project remains JavaScript. Vite compiles both formats. Run npx tsc --noEmit to check the new components. Existing demo.tsx was preserved; the supplied example is expanding-search-dock-demo.tsx instead.

The expanding dock appears only in the homepage navigation above the hero, on desktop and mobile. It expands up to 320px, shrinks to fit mobile screens, submits to the product search page, and closes with X or Escape without navigating. Existing navbar suggestions remain available. The shop retains its earlier full-width search input and Search button. Other pages retain their existing navigation search. No assets or context providers are required.

For a fresh checkout run npm install. Tailwind is already configured with @tailwindcss/vite and @import "tailwindcss". Do not reinitialize the project. For future shadcn components use npx shadcn@latest add <component>; components.json directs generated files into src/components/ui.

The navbar pill component is src/components/ui/bottom-nav-bar.tsx, with a separate bottom-nav-bar-demo.tsx. It uses real React Router links and URL-derived selection. Desktop shows it inline; smaller screens show it below the header. stickyBottom remains available but is not enabled for the storefront. Existing search, profile, cart and mobile drawer are retained. No images or additional dependencies are required.
