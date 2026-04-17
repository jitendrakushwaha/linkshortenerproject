# Agent Instructions for Link Shortener Project

This document serves as the primary index for LLM agent coding standards and guidelines for the Link Shortener Project. All agents contributing to this codebase must follow these standards to maintain consistency, quality, and maintainability.

## ⚠️ CRITICAL: Read Documentation First

**BEFORE GENERATING ANY CODE**, you MUST read the relevant instruction files in the `/docs` directory that correspond to your task. This is non-negotiable.

- Working on a **React component**? → Read [03-react-standards.md](./docs/03-react-standards.md) first
- Writing **TypeScript code**? → Read [02-typescript-standards.md](./docs/02-typescript-standards.md) first
- Creating **UI elements**? → Read [10-shadcn-ui-standards.md](./docs/10-shadcn-ui-standards.md) first
- Implementing **database queries**? → Read [05-database-standards.md](./docs/05-database-standards.md) first
- Setting up **authentication**? → Read [09-authentication-standards.md](./docs/09-authentication-standards.md) first
- Writing **tests**? → Read [06-testing-standards.md](./docs/06-testing-standards.md) first
- Building **API routes**? → Read [09-authentication-standards.md](./docs/09-authentication-standards.md) for route protection first

**Not reading the relevant docs first will result in code that does not comply with project standards and will need to be rewritten.**

## Quick Links to Standards

- [Project Overview & Architecture](./docs/01-project-overview.md)
- [TypeScript & Type Safety](./docs/02-typescript-standards.md)
- [React & Component Development](./docs/03-react-standards.md)
- [Code Style & Formatting](./docs/04-code-style.md)
- [Database & Data Access](./docs/05-database-standards.md)
- [Testing Standards](./docs/06-testing-standards.md)
- [Documentation Standards](./docs/07-documentation-standards.md)
- [Git & Version Control](./docs/08-git-standards.md)
- [Authentication Standards](./docs/09-authentication-standards.md)
- [Shadcn/UI Component Standards](./docs/10-shadcn-ui-standards.md)

## Project Stack

- **Framework**: Next.js 16.2.4 (React 19.2.4)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + PostCSS
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **Auth**: Clerk
- **Linting**: ESLint 9 with Next.js config
- **UI Components**: Base UI React, Shadcn, Lucide React Icons

## Quick Reminders

1. **Always enable strict TypeScript mode** - no implicit any
2. **Use functional components with hooks** - no class components
3. **Follow ESLint rules** - run `npm run lint` before committing
4. **Type all function parameters and returns** explicitly
5. **Use server components by default** in Next.js (App Router)
6. **Tailwind for styling** - avoid inline CSS or CSS modules
7. **Path aliases** - use `@/*` for imports from project root
8. **Consistent naming** - camelCase for functions/variables, PascalCase for components/types
9. **⚠️ NEVER use `middleware.ts`** - it is deprecated in Next.js 16+. Use `proxy.ts` instead for request interception and middleware logic

## Before You Start

**Every agent must read the relevant documentation files BEFORE writing any code.** This ensures compliance with project standards and prevents rework.

When in doubt about:
- How to structure a component? → Check [03-react-standards.md](./docs/03-react-standards.md)
- What type patterns to use? → Check [02-typescript-standards.md](./docs/02-typescript-standards.md)
- Which UI components to use? → Check [10-shadcn-ui-standards.md](./docs/10-shadcn-ui-standards.md)
- How to write database code? → Check [05-database-standards.md](./docs/05-database-standards.md)
- How to protect routes? → Check [09-authentication-standards.md](./docs/09-authentication-standards.md)

Refer to the specific standard document relevant to your task BEFORE generating any code.

## Standards Enforcement

These standards are enforced through:
- TypeScript compiler (strict mode)
- ESLint rules during development
- Code review process
- Automated build checks

Violations of these standards will require remediation before code can be merged.
