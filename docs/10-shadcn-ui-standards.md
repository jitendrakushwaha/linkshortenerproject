# Shadcn/UI Component Standards

## Overview

**All UI components in this application must use Shadcn/UI.** No custom components should be created unless they cannot be built with existing Shadcn/UI components. Shadcn/UI provides a comprehensive library of accessible, customizable components built on Radix UI and Tailwind CSS.

**Shadcn/UI Documentation**: https://ui.shadcn.com/  
**Project Version**: Latest (installed via `shadcn` v4.2.0)

## Core Principle

> When building UI, always check if Shadcn/UI has a component for your use case FIRST. If it exists, use it. If it doesn't exist, propose extending or combining existing components.

## Installation

### Adding Components

```bash
# Add a component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog

# Add multiple components at once
npx shadcn-ui@latest add button card dialog input form
```

Components are installed in `components/ui/` directory and are fully customizable.

## Commonly Used Components

### Buttons

```typescript
// ✅ CORRECT - use Button from shadcn/ui
import { Button } from '@/components/ui/button';

export const ActionButtons = () => {
  return (
    <div className="flex gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
};

// ❌ INCORRECT - custom button
export const ActionButton = () => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Click Me
    </button>
  );
};
```

### Forms

```typescript
// ✅ CORRECT - use Form components from shadcn/ui
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

// ❌ INCORRECT - custom form
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border rounded"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
};
```

### Dialogs/Modals

```typescript
// ✅ CORRECT - use Dialog from shadcn/ui
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ConfirmDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ❌ INCORRECT - custom modal
export const ConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2>Are you sure?</h2>
            <p>This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

### Cards

```typescript
// ✅ CORRECT - use Card from shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const LinkCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortened Link</CardTitle>
        <CardDescription>Short code: abc123</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          https://example.com/very/long/url
        </p>
        <p className="text-sm font-semibold mt-2">Clicks: 42</p>
      </CardContent>
    </Card>
  );
};

// ❌ INCORRECT - custom card
export const LinkCard = () => {
  return (
    <div className="border rounded p-6 shadow">
      <h3 className="font-bold">Shortened Link</h3>
      <p className="text-sm text-gray-500">Short code: abc123</p>
      <p className="text-sm text-gray-600 mt-4">
        https://example.com/very/long/url
      </p>
      <p className="text-sm font-semibold mt-2">Clicks: 42</p>
    </div>
  );
};
```

### Alerts

```typescript
// ✅ CORRECT - use Alert from shadcn/ui
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ErrorAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>
  );
};
```

### Tables

```typescript
// ✅ CORRECT - use Table from shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
}

export const LinksTable = ({ links }: { links: Link[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short Code</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead>Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="font-mono">{link.shortCode}</TableCell>
            <TableCell className="truncate">{link.originalUrl}</TableCell>
            <TableCell>{link.clicks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Dropdowns

```typescript
// ✅ CORRECT - use DropdownMenu from shadcn/ui
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export const LinkActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

### Tooltips

```typescript
// ✅ CORRECT - use Tooltip from shadcn/ui
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export const InfoButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information goes here</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```

### Input Fields

```typescript
// ✅ CORRECT - use Input from shadcn/ui
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchBar = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search links..." className="flex-1" />
      <Button>Search</Button>
    </div>
  );
};

// ❌ INCORRECT - custom input
export const SearchBar = () => {
  return (
    <div className="flex gap-2">
      <input
        placeholder="Search links..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </div>
  );
};
```

## Component Composition

Combine Shadcn/UI components to create complex interfaces:

```typescript
// ✅ CORRECT - composing multiple shadcn/ui components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const CreateLinkForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Shortened Link</CardTitle>
        <CardDescription>Enter the URL you want to shorten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Original URL</label>
          <Input
            placeholder="https://example.com/very/long/url"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Expiration</label>
          <Input type="number" placeholder="Days (optional)" className="mt-1" />
        </div>
        <Button className="w-full">Create Link</Button>
      </CardContent>
    </Card>
  );
};
```

## Styling Shadcn Components

### Customizing with Tailwind

```typescript
// ✅ CORRECT - customize with Tailwind classes
import { Button } from '@/components/ui/button';

export const CustomButtons = () => {
  return (
    <div className="flex gap-4">
      <Button className="w-full">Full Width Button</Button>
      <Button size="lg" className="text-lg">Large Button</Button>
      <Button size="sm">Small Button</Button>
      <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
        Gradient Button
      </Button>
    </div>
  );
};
```

### Component Variants

```typescript
// ✅ CORRECT - use built-in variants
import { Button } from '@/components/ui/button';

export const ButtonVariants = () => {
  return (
    <>
      {/* Size variants */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔔</Button>

      {/* Style variants */}
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </>
  );
};
```

## Icons with Lucide

Use Lucide React icons (included with Shadcn) for consistent iconography:

```typescript
// ✅ CORRECT - use Lucide icons with shadcn components
import { Button } from '@/components/ui/button';
import { Share2, Copy, Trash2, Edit2 } from 'lucide-react';

export const LinkActions = () => {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm">
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button variant="ghost" size="sm">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="ghost" size="sm">
        <Edit2 className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button variant="ghost" size="sm">
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};
```

## Accessible Components

Shadcn/UI components are built on Radix UI and follow WCAG guidelines:

```typescript
// ✅ CORRECT - accessible components out of the box
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const AccessibleDialog = () => {
  return (
    <Dialog>
      {/* Properly labeled dialog with semantic structure */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Action Required</DialogTitle>
        </DialogHeader>
        {/* Content with proper ARIA labels */}
      </DialogContent>
    </Dialog>
  );
};
```

## Dark Mode Support

Shadcn/UI components support dark mode out of the box:

```typescript
// ✅ CORRECT - components automatically support dark mode
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ThemeAwareCard = () => {
  // Automatically adapts to dark mode
  return (
    <Card>
      <CardHeader>
        <CardTitle>Light and Dark Mode</CardTitle>
      </CardHeader>
      <CardContent>Content adapts to theme automatically</CardContent>
    </Card>
  );
};
```

## When to Add New Components

Only add a component if:

1. **It doesn't exist in Shadcn/UI** - Check documentation first
2. **It's commonly used** - Not a one-off custom UI
3. **It combines existing components** - Composition over custom creation

```typescript
// ✅ ACCEPTABLE - composing multiple shadcn components
// components/LinkStats.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const LinkStats = ({ clicks, created, expires }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Total Clicks</span>
          <Badge variant="secondary">{clicks}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Created</span>
          <span className="text-sm text-gray-500">{created}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Expires</span>
          <span className="text-sm text-gray-500">{expires}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// ❌ INCORRECT - creating custom component when shadcn exists
export const LinkStats = () => {
  return (
    <div className="border rounded p-6 shadow">
      {/* Custom card implementation */}
    </div>
  );
};
```

## Common Issues

### Component Not Found

```bash
# Check if component is installed
ls components/ui/

# Install missing component
npx shadcn-ui@latest add button
```

### Styling Not Applied

```typescript
// ✅ CORRECT - use className for custom styling
import { Button } from '@/components/ui/button';

<Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
  Custom Button
</Button>

// ❌ INCORRECT - trying to override with inline styles
<Button style={{ width: '100%', background: 'blue' }}>
  Button
</Button>
```

### Form Validation

```typescript
// ✅ CORRECT - use react-hook-form with shadcn Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem } from '@/components/ui/form';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

export const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            {/* Error messages display automatically */}
          </FormItem>
        )}
      />
    </Form>
  );
};
```

## Resources

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)

## Checklist

- [ ] All UI components are from Shadcn/UI
- [ ] No custom components created without justification
- [ ] Components are properly composed
- [ ] Tailwind classes used for customization
- [ ] Icons use Lucide React
- [ ] Forms use react-hook-form + Shadcn Form
- [ ] Components are accessible
- [ ] Dark mode compatible
