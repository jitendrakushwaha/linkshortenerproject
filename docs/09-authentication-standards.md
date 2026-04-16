# Authentication Standards

## Overview

**All authentication in this application is handled exclusively by Clerk.** No alternative authentication methods are permitted. Clerk handles user management, session management, and all authentication flows.

**Clerk Documentation**: https://clerk.com/docs  
**Project Integration**: `@clerk/nextjs` v7.2.1

## Clerk Setup

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Do not hardcode these values in code.

## Authentication Flows

### Sign In & Sign Up

All sign-in and sign-up flows **must launch as modals**, never as full pages.

```typescript
// ✅ CORRECT - modal-based authentication
'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';

export const AuthButtons = () => {
  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <button>Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button>Sign Up</button>
      </SignUpButton>
    </div>
  );
};

// ❌ INCORRECT - full page authentication
export const AuthButtons = () => {
  return (
    <div className="flex gap-4">
      <SignInButton mode="redirect">
        <button>Sign In</button>
      </SignInButton>
      <SignUpButton mode="redirect">
        <button>Sign Up</button>
      </SignUpButton>
    </div>
  );
};

// ❌ INCORRECT - alternative auth methods
export const CustomAuth = () => {
  const [email, setEmail] = useState('');
  // Custom authentication - NOT ALLOWED
};
```

## Protected Routes

### Dashboard Protection

The `/dashboard` route must be protected and require authentication.

```typescript
// app/dashboard/layout.tsx
// ✅ CORRECT - protected layout using Clerk middleware

import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Redirect unauthenticated users
  return (
    <ClerkLoaded>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <UserButton />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ClerkLoaded>
  );
}

// ❌ INCORRECT - no protection
export default async function DashboardLayout({ children }: Props) {
  return <div>{children}</div>;
}
```

### Middleware Protection

Use Clerk middleware to protect routes:

```typescript
// middleware.ts
// ✅ CORRECT - protect dashboard with middleware

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // Redirect authenticated users from home to dashboard
  if (req.nextUrl.pathname === '/' && auth().userId) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Re-include API routes
    '/(api|trpc)(.*)',
  ],
};
```

### Component-Level Protection

```typescript
// ✅ CORRECT - component-level protection
'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const ProtectedComponent = () => {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    redirect('/');
  }

  return <div>Protected content</div>;
};

// ✅ CORRECT - server component protection
import { auth } from '@clerk/nextjs/server';

export async function getData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Fetch user data
}
```

## Redirects

### Homepage to Dashboard Redirect

If a logged-in user accesses the homepage, redirect to dashboard:

```typescript
// app/page.tsx
// ✅ CORRECT - redirect authenticated users

import { auth, redirectToSignIn } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { HeroSection } from '@/components/HeroSection';

export default async function Home() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show landing page to unauthenticated users
  return (
    <main>
      <HeroSection />
    </main>
  );
}

// ❌ INCORRECT - no redirect
export default async function Home() {
  return <main><HeroSection /></main>;
}

// ❌ INCORRECT - client-side redirect (use server-side)
'use client';

export default function Home() {
  const { userId } = useAuth();

  if (userId) {
    useRouter().push('/dashboard');  // Too slow
  }

  return <main><HeroSection /></main>;
}
```

### Sign-In Redirects

```typescript
// app/sign-in/page.tsx
// ✅ CORRECT - sign-in page with modal

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn />;
}

// app/sign-up/page.tsx
// ✅ CORRECT - sign-up page with modal

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return <SignUp />;
}
```

## Using Authentication State

### Client Components

```typescript
// ✅ CORRECT - access user data in client component
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

export const UserGreeting = () => {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <h1>Hello, {user.firstName || 'User'}!</h1>;
};

// ✅ CORRECT - user data structure
interface UserData {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  createdAt: Date;
}
```

### Server Components

```typescript
// ✅ CORRECT - access user in server component
import { auth, currentUser } from '@clerk/nextjs/server';

export async function UserProfile() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return null;
  }

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

## User Button

Display user profile and logout button:

```typescript
// ✅ CORRECT - user button in header
'use client';

import { UserButton } from '@clerk/nextjs';

export const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center p-4">
        <h1>My App</h1>
        <UserButton />
      </div>
    </header>
  );
};

// ✅ CORRECT - customizing UserButton
<UserButton
  appearance={{
    elements: {
      avatarBox: 'w-10 h-10',
    },
  }}
  afterSignOutUrl="/"
/>
```

## Session Management

### Checking Session Status

```typescript
// ✅ CORRECT - verify session
import { auth } from '@clerk/nextjs/server';

export async function checkSession() {
  const { sessionId, userId } = await auth();

  if (!sessionId) {
    throw new Error('No active session');
  }

  return { sessionId, userId };
}

// ✅ CORRECT - refresh session
'use client';

import { useAuth } from '@clerk/nextjs';

export const SessionRefresher = () => {
  const { getToken } = useAuth();

  const refreshToken = async () => {
    const token = await getToken();
    console.log('Token refreshed:', token);
  };

  return <button onClick={refreshToken}>Refresh Token</button>;
};
```

### API Routes with Auth

```typescript
// app/api/protected/route.ts
// ✅ CORRECT - API route protection

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protected API logic
  return NextResponse.json({ data: 'Protected data' });
}

// ❌ INCORRECT - no authentication check
export async function GET(request: Request) {
  // Public endpoint - intentional
  return NextResponse.json({ data: 'Public data' });
}
```

## Error Handling

### Unauthorized Access

```typescript
// ✅ CORRECT - handle unauthorized access
import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You must be logged in to view this page.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  return <div>Protected content</div>;
}
```

## OAuth & Social Login

Clerk supports social login out of the box. Configure in Clerk dashboard:

```typescript
// ✅ CORRECT - social login included automatically

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  // Supports Google, GitHub, etc. automatically via Clerk dashboard config
  return <SignIn />;
}
```

## Webhook Integration

Handle Clerk events with webhooks:

```typescript
// app/api/webhooks/clerk/route.ts
// ✅ CORRECT - webhook handler

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id') || '';
  const svixTimestamp = headerPayload.get('svix-timestamp') || '';
  const svixSignature = headerPayload.get('svix-signature') || '';

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed');
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Handle different event types
  if (evt.type === 'user.created') {
    // Handle new user
    console.log('User created:', evt.data.id);
  }

  if (evt.type === 'user.updated') {
    // Handle user update
    console.log('User updated:', evt.data.id);
  }

  return new Response('Webhook received', { status: 200 });
}
```

## Common Patterns

### Protected Layout with Navigation

```typescript
// app/dashboard/layout.tsx
// ✅ CORRECT - dashboard with protection and navigation

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Navigation } from '@/components/Navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
```

### Public Page with Auth-Aware UI

```typescript
// app/page.tsx
// ✅ CORRECT - landing page with auth awareness

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default async function Home() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Link Shortener</h1>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 border border-gray-300 rounded">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>
      <section className="py-12 px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          Shorten Your Links
        </h2>
        <p className="text-center text-gray-600">
          Create short, memorable links and track their performance.
        </p>
      </section>
    </main>
  );
}
```

## Security Best Practices

1. **Never expose secret keys** - Only use `CLERK_SECRET_KEY` on server
2. **Validate sessions** - Always check `userId` on protected routes
3. **Use middleware** - Protect routes at the middleware layer
4. **HTTPS only** - Enforce in production
5. **No custom auth** - Never implement custom authentication
6. **Verify webhooks** - Always verify webhook signatures
7. **Handle token expiration** - Use `getToken()` for fresh tokens

## Troubleshooting

### Users Not Redirecting to Dashboard

- Check middleware is properly configured
- Verify `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- Ensure dashboard layout has auth protection

### Modal Not Appearing

- Ensure `mode="modal"` is set on SignIn/SignUp components
- Check environment variables are correctly set
- Verify Clerk provider is wrapping your app

### Middleware Not Protecting Routes

- Verify middleware.ts is at project root
- Check route patterns in `isProtectedRoute`
- Clear `.next` cache and rebuild

## References

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk React Hooks](https://clerk.com/docs/references/react/use-auth)
- [Clerk Middleware](https://clerk.com/docs/references/nextjs/clerk-middleware)
