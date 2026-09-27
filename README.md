<div align="center">

# BuildHub

**The Open Platform for Real Makers and Real Products**

A modern, transparent showcase for creators and developers to launch projects, gather authentic community feedback, publish product changelogs, and organize personal testing playlists.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.1-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?logo=postgresql)](https://neon.tech/)

</div>

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
    - [1. Product Showcase & Discovery](#1-product-showcase--discovery)
    - [2. Interactive Community Hub](#2-interactive-community-hub)
    - [3. Bookmarks & Tool Playlists](#3-bookmarks--tool-playlists)
    - [4. Creator Submission Workflow](#4-creator-submission-workflow)
    - [5. Admin Moderation & Analytics](#5-admin-moderation--analytics)
    - [6. Contact & Support Desk](#6-contact--support-desk)
- [Design System & UX](#-design-system--ux)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Configuration](#environment-configuration)
    - [Database Setup & Migrations](#database-setup--migrations)
    - [Running Locally](#running-locally)
- [Available NPM Scripts](#-available-npm-scripts)
- [Contributing](#-contributing)

## Overview

**BuildHub** is crafted to replace cluttered, bot-driven launch directories with a fast, high-signal hub for genuine indie makers, developers, and tech teams.

Makers can showcase what they've built, broadcast structured version updates, and collect detailed ratings on UX, pricing, and overall satisfaction. Users can upvote great work, participate in threaded Q&A discussions, and organize tools they want to test into curated personal playlists.

## Key Features

### 1. Product Showcase & Discovery

- **Explore & Filter (`/explore`)**: Discover community launches with real-time keyword search and tag filtering.
- **Dynamic Sorting**: Sort products by **Trending**, or **Recent Launches**.
- **Interactive Voting System**: Instant optimistic upvoting with server validation, tracking upvoted users in PostgreSQL arrays.
- **Featured Badges**: Automatic recognition for high-impact products with >500 community upvotes.
- **Server-Side Pagination**: Fast and efficient browsing for extensive product catalogs.

### 2. Interactive Community Hub

Every product page (`/products/[slug]`) features a tabbed community hub:

- **Discussions & Q&A**:
    - Threaded comment system with nested replies.
    - Category tags: `Question`, `Feedback`, `Bug`, `General`.
    - Upvote system on comments to highlight helpful answers.
    - Role badges: Maker (`Maker`), Community (`User`), and Admin (`Admin`).
- **Maker Changelog & Milestones**:
    - Release updates published directly by creators.
    - Version tags with categorized badges: `Feature`, `Milestone`, `Improvement`, `Fix`.
    - Chronological release timeline with rich notes.
- **In-Depth Structured Reviews**:
    - 1–5 Star overall ratings alongside granular **UX** and **Pricing** sub-ratings.
    - Visual rating distribution breakdown bar charts.
    - Structured **Pros & Cons** pill highlights.
    - Verified User badge indicator for authentic reviews.

### 3. Bookmarks & Tool Playlists

- **Curated Personal Playlists (`/bookmarks`)**: Save products into predefined lists: _"Want to Test"_, _"DevTools & Frameworks"_, _"AI & Machine Learning"_, _"Design & UI Inspiration"_, _"Favorites"_.
- **Personal Memos & Notes**: Attach private testing notes, trial results, or reminders to any bookmarked product.
- **Playlist Management**: Filter bookmarks by playlist, edit list assignments, or remove items with optimistic UI updates.
- **Custom Themed Sonner Toast Notifications**: Instant, beautifully styled feedback when saving, editing, or removing bookmarks.

### 4. Creator Submission Workflow

- **Product Submission (`/submit`)**:
    - Streamlined submission flow with Zod schema validation.
    - Automatic URL-safe slug generation and collision handling.
    - Status pipeline: `pending` ➔ `approved` / `rejected`.

### 5. Admin Moderation & Analytics

- **Admin Dashboard (`/admin`)**:
    - Comprehensive platform metrics (total products, pending submissions, total votes, contact requests).
    - Moderation queue to review product details, live URLs, and approve/reject with a single click.
    - Centralized contact submission processing.

### 6. Contact & Support Desk

- **Contact Inquiries (`/contact`)**:
    - Dedicated submission form for partnerships, general inquiries, bug reports, and support.
    - Stored and tracked in the database with status indicators.

---

## Design System & UX

- **Tailored OKLCH Color Palette**: Curated light and dark modes with warm card backgrounds and vibrant primary accents.
- **Modern Typography**: Powered by Google's **Outfit** font for clean, contemporary readability.
- **Skeleton Loading System (`components/skeleton/`)**: Unified skeleton loaders for products, bookmarks, auth buttons, and product detail pages to eliminate layout shifts.
- **Active Navigation Highlighting**: Smooth pathname-based active states across desktop and mobile headers.
- **Custom Sonner Toasts**: Styled toaster matching BuildHub cards, borders, and backdrop blur.

---

## Tech Stack

| Layer              | Technology                                      | Details                                                         |
| :----------------- | :---------------------------------------------- | :-------------------------------------------------------------- |
| **Framework**      | [Next.js 16.1](https://nextjs.org/)             | App Router, Server Actions, Partial Prerendering, Turbopack     |
| **UI Library**     | [React 19.2](https://react.dev/)                | Concurrent rendering, `useTransition`, server/client components |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across database queries, schemas, and UI     |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)     | Modern utility-first styling with CSS variables and OKLCH       |
| **Database**       | [PostgreSQL (Neon)](https://neon.tech/)         | Serverless cloud PostgreSQL database                            |
| **ORM**            | [Drizzle ORM 0.45](https://orm.drizzle.team/)   | Type-safe SQL query builder and schema management               |
| **Authentication** | [Clerk](https://clerk.com/)                     | Secure authentication, user management, and session handling    |
| **Validation**     | [Zod 4](https://zod.dev/)                       | Runtime validation for forms, API inputs, and server actions    |

### Table Definitions (`db/schema.ts`):

1. **`products`**: Product listings, metadata, approval status, voting counters, and creator IDs.
2. **`bookmarks`**: User-saved products, list categorization (_"Want to Test"_, _"DevTools"_, etc.), and testing notes.
3. **`comments`**: Community discussions, Q&A threads, parent/child comment hierarchy, and upvotes.
4. **`product_updates`**: Creator changelogs, version numbers, update categories, and release notes.
5. **`product_reviews`**: Detailed ratings (overall, UX, pricing), pros/cons lists, and reviewer verification.
6. **`contact_submissions`**: Inbound support tickets, partnership requests, and feedback.

## Getting Started

### Prerequisites

- **Node.js**: `v18.17` or higher (`v20+` recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`
- **Database**: PostgreSQL connection URI ([Neon](https://neon.tech) recommended)
- **Clerk Account**: Free account at [clerk.com](https://clerk.com)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/03aey/build-hub.git
    cd build-hub
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

---

### Environment Configuration

Create a `.env` or `.env.local` file in the root directory:

```bash
# Database Connection (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@your-neon-host/dbname?sslmode=require"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Redirection URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

### Database Setup & Migrations

Push the schema to your database or run generated migrations:

```bash
# Generate SQL migrations
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [localhost:3000](http://localhost:3000) in your browser to view BuildHub.

## Available NPM Scripts

| Command                    | Description                                          |
| :------------------------- | :--------------------------------------------------- |
| `npm run dev`              | Starts the development server with Next.js Turbopack |
| `npm run build`            | Compiles the production build                        |
| `npm run start`            | Runs the compiled production server                  |
| `npm run lint`             | Checks code formatting and ESLint rules              |
| `npx drizzle-kit generate` | Generates SQL migrations from schema                 |
| `npx drizzle-kit migrate`  | Applies pending migrations to the database           |
| `npx drizzle-kit studio`   | Launches Drizzle Studio GUI for database inspection  |

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create:

1. **Fork** the project
2. **Create your feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'feat: add amazing new feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

[![GitHub](https://img.shields.io/badge/GitHub-03aey-181717?logo=github&logoColor=white)](https://github.com/03aey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-in%2F03aey-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/03aey)
[![Portfolio](https://img.shields.io/badge/Portfolio-03aey.vercel.app-000000?logo=vercel&logoColor=white)](https://03aey.vercel.app)
[![Linktree](https://img.shields.io/badge/Linktree-03aey-43E55E?logo=linktree&logoColor=white)](https://linktr.ee/03aey)
