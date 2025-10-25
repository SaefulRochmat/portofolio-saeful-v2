# Portfolio v2
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/SaefulRochmat/portofolio-saeful-v2)

This repository contains the source code for a dynamic, full-stack personal portfolio application. It is built with Next.js, TypeScript, and Supabase, featuring a complete authentication system and a dashboard for content management.

The application allows a user to sign up, log in, and manage various sections of their portfolio, including their profile, work experience, education, skills, and projects. It also includes a feature for uploading and managing documents like resumes or certificates.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Features

- **Full Authentication**: Secure user sign-up, login, and logout functionality using Supabase Auth (email/password and Google OAuth).
- **Session Management**: Server-side session handling with Next.js middleware and Supabase SSR helpers.
- **Portfolio Management Dashboard**: A dedicated dashboard for authenticated users to perform CRUD operations on their portfolio data.
- **Dynamic Content Sections**:
    - **Profile**: Update personal details, bio, and social links.
    - **Experience**: Add, edit, or remove work experience.
    - **Education**: Manage educational background.
    - **Skills**: List and categorize technical skills.
    - **Projects**: Showcase personal or professional projects.
- **Document Upload**: Upload files (e.g., CV, certificates) to Supabase Storage, linking them to the portfolio.
- **RESTful API**: A comprehensive set of API routes to interact with the database.

## API Endpoints

The application exposes the following API endpoints under `/api` to manage portfolio data.

| Endpoint                  | Method   | Description                                           |
| ------------------------- | -------- | ----------------------------------------------------- |
| `/api/profile`            | `GET`, `PUT` | Fetch or update the user's profile information.       |
| `/api/skills`             | `GET`, `POST`, `PUT`, `DELETE` | Manage user skills.                   |
| `/api/projects`           | `GET`, `POST`, `PUT`, `DELETE` | Manage user projects.                 |
| `/api/experience`         | `GET`, `POST`, `PUT`, `DELETE` | Manage user work experience.          |
| `/api/education`          | `GET`, `POST`, `PUT`, `DELETE` | Manage user education history.        |
| `/api/documents`          | `GET`, `POST`, `PUT`, `DELETE` | Manage document metadata records.     |
| `/api/documents/upload`   | `POST`, `DELETE`               | Upload or delete files from Supabase Storage.         |

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, pnpm, or bun
- A [Supabase](https://supabase.com/) account

### 1. Supabase Setup

1.  **Create a new Supabase project.**
2.  Navigate to the **SQL Editor** and run the necessary SQL queries to create the tables (`profiles`, `projects`, `skills`, `experience`, `education`, `documents`). The schema can be inferred from the type definitions in the `/src/app/api/**/type*.ts` files.
3.  Go to the **Storage** section
