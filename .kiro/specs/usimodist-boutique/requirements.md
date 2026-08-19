# Requirements Document

## Introduction

Usimodist is an eco-print fashion and textile boutique brand that creates garments and textiles using natural dye techniques derived from plants, leaves, and organic materials. This feature covers the development of a responsive boutique company profile website that showcases Usimodist's identity, products, production techniques, environmental mission, and contact information.

The website is built using Node.js + Express.js + EJS with Tailwind CSS for styling, and serves as a digital storefront and brand storytelling platform. All content is in Bahasa Indonesia. The site targets eco-conscious consumers, fashion enthusiasts, and wholesale buyers who value sustainable, artisan-crafted textiles.

---

## Glossary

- **Website**: The Usimodist boutique company profile web application
- **Server**: The Express.js backend application
- **Renderer**: The EJS template engine that generates HTML pages
- **Router**: The Express.js route handler that maps URLs to page controllers
- **Product_Card**: A UI component displaying a product's image, name, technique, and short description
- **Product_Detail**: A full-page editorial layout for a single product
- **Gallery**: A masonry/grid image display page showing eco-print works and production process
- **Navbar**: The top navigation bar component rendered in the header partial
- **Hero**: The full-width editorial section at the top of the homepage
- **Filter**: The JavaScript client-side mechanism for filtering products by technique
- **Technique**: One of three eco-print methods — Pounding, Steam, or Iron Blanket
- **Partial**: A reusable EJS template fragment (e.g., header, footer)
- **Static_Assets**: Public files served directly (images, CSS, JavaScript)
- **Product_Data**: The JSON file (`data/products.json`) containing all product records
- **WhatsApp_Link**: A URL using the `wa.me` protocol linking to Usimodist's WhatsApp number
- **Smooth_Scroll**: Browser scroll behavior animated with CSS or JavaScript
- **Reveal_Animation**: A scroll-triggered fade-in/slide-up animation applied to page sections

---

## Requirements

### Requirement 1: Server Setup and Static File Serving

**User Story:** As a site visitor, I want the website to load quickly and reliably, so that I can browse Usimodist's content without interruption.

#### Acceptance Criteria

1. THE Server SHALL serve the web application on a configurable port defined in the `.env` file, defaulting to port 3000. The port value SHALL be a valid integer in the range 1–65535.
2. THE Server SHALL serve Static_Assets from the `/public` directory at the `/public` URL path.
3. THE Server SHALL configure EJS as the view engine with views stored in the `/views` directory.
4. IF the `.env` file is absent, THEN THE Server SHALL start and listen on port 3000 without exiting or throwing an uncaught exception.
5. IF the `PORT` value in `.env` is non-numeric or outside the range 1–65535, THEN THE Server SHALL fall back to port 3000 and log a warning message indicating the invalid value was ignored.
6. IF a visitor navigates to a URL that does not match any defined route, THEN THE Router SHALL respond with HTTP status code 404 and render a dedicated 404 EJS template.

---

### Requirement 2: Navigation (Navbar)

**User Story:** As a site visitor, I want a clear and accessible navigation bar, so that I can move between pages of the website easily on any device.

#### Acceptance Criteria

1. THE Navbar SHALL display the Usimodist logo on the left side and navigation links on the right side on desktop viewports (≥1024px).
2. THE Navbar SHALL render navigation links for: Beranda, Tentang, Produk, Galeri, and Kontak.
3. THE Navbar SHALL include a "Hubungi Kami" call-to-action button that links to the contact page.
4. WHEN the viewport width is less than 1024px, THE Navbar SHALL hide desktop navigation links and display a hamburger menu icon instead.
5. WHEN the hamburger menu icon is clicked, THE Navbar SHALL toggle a mobile menu showing navigation links for: Beranda, Tentang, Produk, Galeri, Kontak, and Hubungi Kami.
6. WHEN a mobile navigation link is clicked, THE Navbar SHALL close the mobile menu.
7. THE Navbar SHALL use a background color with a lightness value ≥95% (white or near-white) and dark typography with a contrast ratio of at least 4.5:1 against the background, with no box-shadow values exceeding 0 0 8px rgba(0,0,0,0.1) and no CSS gradient on the background.
8. WHEN the hamburger menu is open, THE hamburger icon SHALL visually indicate the open state (e.g., by transforming to a close/X icon).
9. THE Navbar SHALL be rendered from the `views/partials/header.ejs` Partial and included on every page.

---

### Requirement 3: Homepage — Hero Section

**User Story:** As a site visitor, I want an impactful hero section on the homepage, so that I immediately understand Usimodist's identity and can navigate to products.

#### Acceptance Criteria

1. THE Hero SHALL display the primary heading "Alam. Tradisi. Usimodist." using an H1 element styled with a serif font family.
2. THE Hero SHALL display the description "Usimodist adalah butik ecoprint yang menghadirkan keindahan alam ke dalam setiap helai karya." as visible body text within the hero section.
3. THE Hero SHALL include a call-to-action button labeled "Lihat Produk →" that links to the `/products` route.
4. THE Hero SHALL display an eco-print textile image on the right side on desktop viewports (≥1024px). The image SHALL include a non-empty `alt` attribute describing its content.
5. WHEN the viewport width is less than 1024px, THE Hero SHALL render its content in a single column with the image positioned below the text block.
6. THE Hero SHALL use a background color with a lightness value ≥90% (white or off-white range) and apply a minimum vertical padding of 64px on desktop viewports.

---

### Requirement 4: Homepage — About Preview Section

**User Story:** As a site visitor, I want a brief introduction to Usimodist's brand story on the homepage, so that I can understand the brand values before deciding to read more.

#### Acceptance Criteria

1. WHILE the viewport width is ≥1024px, THE About_Preview_Section SHALL display a natural landscape or material image in the left column with a minimum rendered height of 400px. The image SHALL include a non-empty `alt` attribute describing its subject.
2. THE About_Preview_Section SHALL display the label "TENTANG KAMI" in uppercase sans-serif above the section heading.
3. THE About_Preview_Section SHALL display the heading "Dari Alam, Untuk Kehidupan yang Lebih Baik".
4. THE About_Preview_Section SHALL include a description of Usimodist's eco-print approach and sustainability values containing between 50 and 200 characters.
5. THE About_Preview_Section SHALL include a call-to-action link "Selengkapnya Tentang Kami →" that navigates to the `/about` route in the same browser tab.
6. WHEN the viewport width is less than 1024px, THE About_Preview_Section SHALL render in a single column with the image above the text block, and the image SHALL have a minimum rendered height of 240px.

---

### Requirement 5: Homepage — Products by Technique Section

**User Story:** As a site visitor, I want to explore Usimodist's products organized by eco-print technique on the homepage, so that I can quickly find the technique that interests me.

#### Acceptance Criteria

1. THE Technique_Section SHALL display the section heading "Ecoprint Berdasarkan Teknik".
2. THE Technique_Section SHALL render three cards, one for each technique: Pounding, Steam, and Iron Blanket.
3. EACH technique card SHALL render an image with a non-empty `alt` attribute that describes the technique it represents, the technique name as visible text, and a "Lihat Produk →" link. IF the image fails to load, the card SHALL display the `alt` text in place of the image.
4. WHEN the "Lihat Produk →" link on a technique card is clicked, THE browser SHALL navigate to the `/products` page with the corresponding technique's filter active and applied.
5. THE Technique_Section SHALL display the three cards in a three-column grid on desktop viewports (≥1024px).
6. WHEN the viewport width is ≤767px, THE Technique_Section SHALL display the cards in a single column.
7. WHEN the viewport width is between 768px and 1023px, THE Technique_Section SHALL display the cards in a two-column grid.

---

### Requirement 6: Homepage — Why We Do This Section

**User Story:** As a site visitor, I want to understand Usimodist's environmental motivation on the homepage, so that I can connect with the brand's mission before learning more.

#### Acceptance Criteria

1. THE Mission_Section SHALL display the label "ISU YANG DIANGKAT" in uppercase sans-serif above the section heading.
2. THE Mission_Section SHALL display the heading "Kenapa Kami Melakukan Ini?".
3. THE Mission_Section SHALL include a text block that explicitly names all three issues: textile waste (limbah tekstil), chemical water pollution (pencemaran air kimia), and fast fashion.
4. WHEN a visitor clicks the "Pelajari Lebih Lanjut →" call-to-action link, THE browser SHALL navigate to the `/about` route.
5. THE Mission_Section SHALL display an environmental image in the right column. WHEN the image is rendered, an overlay SHALL be visible on top of the image listing four labeled items: Limbah Tekstil, Pencemaran Air, Fast Fashion, and Solusi Kami.
6. WHEN the viewport width is less than 1024px, THE Mission_Section SHALL render in a single column with the text block above the image.

---

### Requirement 7: Homepage — Contact Section

**User Story:** As a site visitor, I want to find Usimodist's contact details quickly from the homepage, so that I can reach out without navigating to a separate page.

#### Acceptance Criteria

1. THE Homepage_Contact_Section SHALL display the section heading "Lokasi & Kontak".
2. THE Homepage_Contact_Section SHALL display the physical address of Usimodist as visible text.
3. THE Homepage_Contact_Section SHALL display a WhatsApp_Link that opens a WhatsApp chat with Usimodist's number in a new browser tab.
4. THE Homepage_Contact_Section SHALL display the email address of Usimodist as visible text.
5. THE Homepage_Contact_Section SHALL display a link to Usimodist's Instagram profile that opens in a new browser tab.
6. THE Homepage_Contact_Section SHALL include a call-to-action button labeled "Hubungi Kami" that navigates to the `/contact` route.

---

### Requirement 8: Footer

**User Story:** As a site visitor, I want a consistent footer on every page, so that I can find secondary navigation and brand information at the bottom of any page.

#### Acceptance Criteria

1. THE Footer SHALL display the Usimodist logo or brand name as visible text or an image with a non-empty `alt` attribute.
2. THE Footer SHALL display navigation links for all main pages: Beranda, Tentang, Produk, Galeri, and Kontak.
3. THE Footer SHALL display a copyright notice that includes the current year and the text "Usimodist".
4. THE Footer SHALL display at least two social media links: one linking to Usimodist's Instagram profile and one WhatsApp_Link, both opening in a new browser tab.
5. THE Footer SHALL be rendered from the `views/partials/footer.ejs` Partial and included on every page.
6. THE Footer SHALL use either a dark background (lightness ≤30%) with light typography (contrast ratio ≥4.5:1) or a light background (lightness ≥90%) with dark typography (contrast ratio ≥4.5:1), with no heavy drop shadows or CSS gradients on the footer background.

---

### Requirement 9: About Page

**User Story:** As a site visitor, I want a dedicated page that tells Usimodist's full story, so that I can learn about the brand's history, values, and eco-print mission in depth.

#### Acceptance Criteria

1. THE About_Page SHALL be accessible at the `/about` route.
2. THE About_Page SHALL include a hero or banner section that displays the page title as visible text within the section (not only in the browser tab title).
3. THE About_Page SHALL include a text section that describes Usimodist's founding story and brand mission.
4. THE About_Page SHALL include a text section that describes the eco-print process and states at least one specific environmental benefit of eco-print over conventional textile dyeing.
5. THE About_Page SHALL describe all three eco-print techniques by name: Pounding, Steam, and Iron Blanket.
6. THE About_Page SHALL include at least one image with a non-empty `alt` attribute.
7. THE About_Page SHALL include at least one navigable link pointing to either the `/products` route or the `/contact` route.

---

### Requirement 10: Products Listing Page

**User Story:** As a site visitor, I want to browse all of Usimodist's products in one place and filter them by technique, so that I can find the specific type of eco-print item I am interested in.

#### Acceptance Criteria

1. THE Products_Page SHALL be accessible at the `/products` route.
2. WHEN the `/products` route is requested, THE Server SHALL read Product_Data from `data/products.json` and pass all products to the Products_Page template.
3. THE Products_Page SHALL display a Product_Card for each product containing: the product image, name, technique, a short description excerpt of at most 150 characters, and a "Lihat Detail →" link to `/products/:id`.
4. THE Products_Page SHALL display four Filter buttons labeled: "Semua", "Pounding", "Steam", and "Iron Blanket".
5. WHEN a Filter button (other than "Semua") is clicked, THE Filter SHALL show only Product_Card elements whose technique attribute matches the selected filter value using a case-insensitive exact match.
6. WHEN the "Semua" Filter button is clicked, THE Filter SHALL show all Product_Card elements. On initial page load with no `?technique=` query parameter, THE Filter SHALL default to the "Semua" state with all Product_Cards visible.
7. THE Filter SHALL activate without a full page reload, using client-side JavaScript only.
8. WHEN the page loads with a URL query parameter `?technique=<name>`, THE Filter SHALL pre-select the matching technique filter and display only the matching products.
9. THE Products_Page SHALL display Product_Cards in a responsive grid: three columns on desktop (≥1024px), two columns on tablet (768px–1023px), and one column on mobile (<768px).
10. WHEN the page loads with a `?technique=` query parameter value that does not match any of the three techniques (case-insensitive), THE Filter SHALL default to the "Semua" state and display all products.

---

### Requirement 11: Product Detail Page

**User Story:** As a site visitor, I want to view detailed information about a specific product, so that I can understand its materials, technique, and craftsmanship before contacting Usimodist.

#### Acceptance Criteria

1. THE Product_Detail SHALL be accessible at the `/products/:id` route.
2. THE Server SHALL look up the product by `id` from Product_Data and pass it to the Product_Detail template.
3. IF no product matching the given `id` exists in Product_Data, THEN THE Router SHALL respond with the 404 page.
4. THE Product_Detail SHALL display the product's image full-width on mobile viewports (<768px) and at a minimum of 50% of the layout width on desktop viewports (≥1024px).
5. THE Product_Detail SHALL display the product name in an H1 or H2 element styled with a serif font family.
6. THE Product_Detail SHALL display the technique used (Pounding, Steam, or Iron Blanket) as visible text.
7. THE Product_Detail SHALL display the full product description as visible text.
8. THE Product_Detail SHALL display the material used as visible text.
9. THE Product_Detail SHALL display the list of plants used in the eco-print process as visible text.
10. THE Product_Detail SHALL display a production process description as visible text.
11. THE Product_Detail SHALL display the product's characteristics as visible text.
12. THE Product_Detail SHALL include both a WhatsApp_Link (using the `wa.me` protocol) and a navigable link to the `/contact` route so the visitor can contact Usimodist through either channel.
13. THE Product_Detail SHALL render responsively, displaying in a single column on mobile viewports (<768px) and in a two-column layout (image + details) on desktop viewports (≥1024px).

---

### Requirement 12: Product Data Structure

**User Story:** As a developer, I want a well-structured product data file, so that I can maintain and extend product listings without modifying application code.

#### Acceptance Criteria

1. THE Product_Data SHALL be stored in `data/products.json` as a JSON array of product objects.
2. EACH product object in Product_Data SHALL contain the following fields with the specified types and constraints: `id` (non-empty string in slug format, e.g. "product-1"), `name` (non-empty string), `technique` (string with value exactly "Pounding", "Steam", or "Iron Blanket"), `description` (non-empty string), `shortDescription` (non-empty string), `material` (non-empty string), `plants` (array of at least one non-empty string), `image` (non-empty string representing a relative file path), `process` (non-empty string), and `characteristics` (non-empty string).
3. THE Product_Data SHALL contain at least six product objects, with at least two products per technique value ("Pounding", "Steam", and "Iron Blanket").
4. EACH product object in Product_Data SHALL have an `id` value that is unique across the entire array and follows slug format (lowercase letters, digits, and hyphens only).

---

### Requirement 13: Gallery Page

**User Story:** As a site visitor, I want to browse a curated gallery of Usimodist's work and process, so that I can visually experience the beauty and craftsmanship of eco-print textiles.

#### Acceptance Criteria

1. THE Gallery_Page SHALL be accessible at the `/gallery` route.
2. THE Gallery_Page SHALL display images in a CSS grid or masonry layout with a minimum of 2 columns on desktop viewports (≥768px).
3. THE Gallery_Page SHALL include at least one image representing each of at least four distinct categories from: eco-print products, leaves, production process, textile details, nature, artisans, and finished products.
4. WHEN a visitor hovers over a gallery image on a desktop viewport (pointer: fine media query), THE Gallery_Page SHALL apply a CSS transition with an opacity change in the range 0.3–0.7 or a scale transform in the range 1.03–1.10.
5. ALL gallery images SHALL include an `alt` attribute that is non-empty and identifies the subject and/or category of the image; no image SHALL have a missing or empty `alt` attribute.
6. THE Gallery_Page SHALL render responsively: a minimum of 2 columns on desktop (≥768px) and a single column on mobile (<768px).
7. IF a gallery image fails to load, THE Gallery_Page SHALL display the `alt` text in place of the broken image without breaking the surrounding grid layout.

---

### Requirement 14: Contact Page

**User Story:** As a site visitor or potential buyer, I want a dedicated contact page, so that I can find all contact channels and reach Usimodist directly.

#### Acceptance Criteria

1. THE Contact_Page SHALL be accessible at the `/contact` route.
2. THE Contact_Page SHALL display the physical address of Usimodist as visible text.
3. THE Contact_Page SHALL display a WhatsApp_Link implemented as an anchor with an `href` using the `https://wa.me/<phone>` format that opens in a new browser tab.
4. THE Contact_Page SHALL display the email address of Usimodist as visible text.
5. THE Contact_Page SHALL display an Instagram link as an anchor pointing to Usimodist's Instagram profile URL that opens in a new browser tab.
6. THE Contact_Page SHALL display business operating hours in the format: `<day-range>, <HH:MM>–<HH:MM> <timezone>` (e.g., "Senin–Jumat, 09:00–17:00 WIB").
7. THE Contact_Page SHALL render with a single-column layout on viewports ≤767px and with a multi-column layout on viewports ≥768px.

---

### Requirement 15: Client-Side JavaScript Interactions

**User Story:** As a site visitor, I want smooth and polished interactions throughout the website, so that browsing feels elegant and responsive.

#### Acceptance Criteria

1. THE Navbar hamburger menu toggle SHALL be implemented in `public/js/main.js` using Vanilla JavaScript only, with no external library imports.
2. THE Filter on the Products_Page SHALL be implemented in `public/js/main.js` using Vanilla JavaScript only, with no external library imports.
3. WHEN a visitor clicks an internal anchor link (href starting with `#`), THE browser SHALL animate the scroll to the target element using smooth scroll behavior (CSS `scroll-behavior: smooth` or JavaScript `scrollIntoView({ behavior: 'smooth' })`).
4. THE Website SHALL apply Reveal_Animation to major page sections using the Intersection Observer API. WHEN a section enters the viewport, the Reveal_Animation SHALL trigger.
5. THE Reveal_Animation SHALL use a CSS transition combining opacity (0→1) and a translateY offset (e.g., 20px→0), SHALL complete within 600ms, and SHALL NOT block or delay initial page rendering (elements must be visible without JavaScript if JS is disabled).
6. THE `public/js/main.js` file SHALL import no external modules and SHALL use only Vanilla JavaScript and standard Web APIs available in modern browsers (Chrome 90+, Firefox 88+, Safari 14+).

---

### Requirement 16: Responsive Design

**User Story:** As a site visitor using any device, I want the website to display correctly on desktop, tablet, and mobile screens, so that I have a consistent and usable experience regardless of my device.

#### Acceptance Criteria

1. THE Website SHALL support three breakpoints: mobile (<768px), tablet (768px–1023px), and desktop (≥1024px).
2. THE Website SHALL use Tailwind CSS utility classes for all responsive layout adjustments.
3. WHEN the viewport width is ≥1024px, THE Navbar SHALL display horizontal navigation links. WHEN the viewport width drops below 1024px, THE Navbar SHALL hide horizontal links and show the hamburger icon. WHEN the hamburger icon is activated, THE mobile menu SHALL become visible.
4. ALL homepage sections that use a two-column layout on desktop (About Preview, Mission, Hero) SHALL render as a single column on mobile viewports (<768px).
5. THE Products_Page grid SHALL adapt to three columns on desktop (≥1024px), two on tablet (768px–1023px), and one on mobile (<768px) as specified in Requirement 10.
6. THE Website SHALL set base font sizes such that body text is at least 14px on mobile (<768px) and at least 16px on desktop (≥1024px), and heading text (H1) is at least 28px on mobile and at least 40px on desktop.
7. ALL interactive touch targets (buttons, links, hamburger icon) SHALL have a minimum tap target size of 44×44px on mobile viewports (<768px).

---

### Requirement 17: Visual Design System

**User Story:** As a brand stakeholder, I want the website to consistently represent Usimodist's premium, natural, and editorial aesthetic, so that visitors associate the site with the brand's identity.

#### Acceptance Criteria

1. THE Website SHALL use a primary background color with an HSL lightness value of 95% or higher (white to near-white range).
2. THE Website SHALL use earthy neutral accent colors with HSL saturation between 10% and 40% and lightness between 40% and 80% for accents and borders (ruling out highly saturated or neon tones).
3. THE Website SHALL use dark typography with an HSL lightness value of 15% or lower for body text and headings, producing a contrast ratio of at least 7:1 against the primary background.
4. THE Website SHALL apply a serif font family to all H1, H2, and H3 elements. The selected serif font SHALL be loaded via Google Fonts or bundled locally and SHALL NOT fall back to a system serif on any page before the font is loaded (use font-display: swap).
5. THE Website SHALL apply a sans-serif font family to navigation labels, body text (p, li), buttons, and metadata elements. The selected sans-serif font SHALL be loaded via Google Fonts or bundled locally.
6. THE Website SHALL NOT apply any of the following: box-shadow values with blur > 16px or spread > 4px on content containers; border-radius > 8px on image containers or section cards; CSS background gradients (linear-gradient, radial-gradient) on hero or section backgrounds; HSL saturation > 50% on any non-photographic UI element color.
7. THE Website SHALL apply a minimum vertical padding of 64px (4rem) between major page sections on desktop viewports (≥1024px) and a minimum of 40px (2.5rem) on mobile viewports (<768px).
8. WHERE separator borders are used, THE Website SHALL apply a border with a width of 1px and an opacity between 0.1 and 0.25.

---

### Requirement 18: Accessibility and Code Quality

**User Story:** As a developer and end user, I want the website to follow semantic HTML and accessibility best practices, so that it is maintainable, readable, and usable by people with assistive technologies.

#### Acceptance Criteria

1. THE Website SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) for page structure.
2. ALL informational images SHALL include a non-empty `alt` attribute that describes the image content. ALL purely decorative images SHALL use an empty `alt=""` attribute. No image element SHALL be missing the `alt` attribute entirely.
3. ALL interactive elements (buttons, links) SHALL be reachable via Tab and Shift+Tab keyboard navigation in DOM order, SHALL be activatable via the Enter key (links and buttons) and Space key (buttons), and SHALL display a visible focus indicator that meets WCAG 2.1 SC 2.4.7 (non-zero outline or equivalent visible style change).
4. THE Website SHALL define reusable EJS Partials for the Navbar and Footer to avoid code duplication across pages.
5. THE Product_Data SHALL be maintained in a single `data/products.json` file and loaded by the Server at runtime.
6. THE Server SHALL use `dotenv` to load environment variables from the `.env` file.
7. THE project SHALL include a `README.md` that contains at minimum: (1) a prerequisites section listing required Node.js version and npm version, (2) step-by-step installation instructions, (3) instructions to start the development server, and (4) a project structure section listing the top-level directories and their purpose.
8. THE project SHALL define all npm dependencies in `package.json` with exact or pinned versions (no `^` or `~` version ranges).
