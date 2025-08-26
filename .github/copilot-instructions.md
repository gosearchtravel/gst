<!-- @format -->

# Copilot Instructions for GoSearchTravel (Next.js)

## Project Overview

- This is a Next.js app using the `/app` directory structure, bootstrapped with `create-next-app`.
- UI components are organized in `/app/components/` and `/components/ui/` (e.g., custom carousel, buttons).
- The project uses Tailwind CSS for styling and shadcn/ui for advanced UI components (e.g., carousel).
- Images and static assets are stored in `/public` and subfolders like `/popdest/`.

## Key Patterns & Architecture

- **Pages & Layouts:** Main pages are in `/app/page.tsx` and nested routes under `/app/(auth)/(routes)/`.
- **Componentization:** Major UI features (HeroSlider, PopularDestinations, SearchTabs, Footer, Header) are implemented as React components in `/app/components/`.
- **Carousel Usage:** PopularDestinations uses shadcn/ui Carousel. Cards per slide are controlled via Tailwind classes (`basis-1/3`, `basis-1/5`, etc.).
- **Background Images:** Use inline styles for background images (e.g., footer, section backgrounds).
- **Responsive Design:** Tailwind breakpoints (`sm:`, `lg:`) are used for mobile/desktop layouts. Carousel shows 1 card on mobile, 3 on desktop.
- **Auto-Scroll:** Carousel auto-scroll is implemented by simulating a click on the CarouselNext button every 3.5s.

## Developer Workflows

- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Edit Main Page:** `/app/page.tsx` is the entry point for the home page.
- **Add UI Components:** Place new components in `/app/components/` and import as needed.
- **Add Images:** Place images in `/public` and reference with `/imagepath.ext`.
- **Add Carousel:** Use `npx shadcn@latest add carousel` to install shadcn/ui carousel if needed.

## Project-Specific Conventions

- **Tabs & Filters:** PopularDestinations uses filter tabs (e.g., Europe, USA, Australia) to show region-specific carousels.
- **Footer:** Footer background image is fixed to the bottom on mobile using CSS media queries.
- **Header:** Header uses margin and padding for mobile responsiveness.
- **No imperative carousel API:** Carousel navigation is handled via DOM button clicks, not via ref methods.

## Integration Points

- **Clerk Auth:** Login/signup is implemented via Clerk (`@clerk/nextjs`) in header dropdowns.
- **Lucide Icons:** Icons are imported from `lucide-react` for UI consistency.
- **External UI:** shadcn/ui components are used for carousels and other advanced UI features.

## Examples

- To add a new destination card, update the relevant region array in `PopularDestinations.tsx`.
- To change carousel cards per slide, update the Tailwind class (e.g., `basis-1/3` for 3 cards).
- To auto-scroll carousel, use a `setInterval` to click `[data-carousel-next]`.

## Key Files

- `/app/page.tsx` - Main page and layout
- `/app/components/PopularDestinations.tsx` - Popular destinations carousel and tabs
- `/app/components/HeroSlider.tsx` - Hero image slider
- `/app/components/header.tsx` - Header with navigation and auth
- `/app/components/footer.tsx` - Footer with background image
- `/components/ui/carousel.tsx` - shadcn/ui carousel implementation
- `/public/` - Static assets and images

---

_If any conventions or workflows are unclear, please ask for clarification or examples from the codebase._
