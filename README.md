# BuildHub

A platform for creators to showcase their projects, get authentic feedback, and discover what's launching in the maker community. No fake launches, no fake builders—just real people building real things.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange)

## Features

### Core Functionality

- **Project Submission**: Share your built projects with the community
- **Product Discovery**: Browse and explore projects from creators worldwide
- **Voting System**: Upvote projects you love, help great work surface
- **Search & Filter**: Find projects by name, sort by trending or recent
- **Responsive Design**: Optimized for all devices and screen sizes

### Admin Panel

- **Content Moderation**: Review and approve submitted projects
- **User Management**: Handle user submissions and feedback
- **Analytics Dashboard**: Track platform statistics and growth
- **Contact Management**: Process support inquiries and partnership requests

### Authentication & Security

- **Clerk Integration**: Secure user authentication and management
- **Role-based Access**: Different permissions for users and admins
- **Data Validation**: Comprehensive form validation with Zod schemas

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling framework

### Backend & Database

- **Drizzle ORM** - Type-safe SQL query builder
- **Neon Database** - Serverless PostgreSQL
- **Clerk** - Authentication and user management

### UI & Forms

- **ShadCN UI** - Styled, accessible UI components
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- PostgreSQL database (we recommend [Neon](https://neon.tech))

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

3. **Set up environment variables**

    Create a `.env.local` file in the root directory:

    ```env
    # Database
    DATABASE_URL="your-neon-database-url"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
    CLERK_SECRET_KEY="your-clerk-secret-key"
    ```

4. **Set up the database**

    ```bash
    # Generate and run migrations
    npx drizzle-kit generate
    npx drizzle-kit migrate

    # Seed the database (optional)
    npx tsx db/seed.ts
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**

    Navigate to [localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit push        # Push migrations
npx drizzle-kit studio      # Open Drizzle Studio
```

## Contributing

We welcome contributions. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting

Built with ❤️ by the BuildHub team. Join thousands of creators sharing their work.

---

[![GitHub](https://img.shields.io/badge/GitHub-03aey-181717?logo=github&logoColor=white)](https://github.com/03aey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-in%2F03aey-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/03aey)
[![Portfolio](https://img.shields.io/badge/Portfolio-03aey.vercel.app-000000?logo=vercel&logoColor=white)](https://03aey.vercel.app)
[![Linktree](https://img.shields.io/badge/Linktree-03aey-43E55E?logo=linktree&logoColor=white)](https://linktr.ee/03aey)
