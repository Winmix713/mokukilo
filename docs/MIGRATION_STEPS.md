# Step-by-Step Migration Guide

## Pre-Migration Checklist

- [ ] Backup current codebase
- [ ] Document current functionality
- [ ] Set up development environment
- [ ] Install required dependencies
- [ ] Create feature branch for migration

## Step 1: Clean Up Mixed Architecture (Day 1-2)

### Remove Vite Configuration Files

```bash
# Remove Vite-specific files
rm vite.config.ts
rm tsconfig.app.json
rm tsconfig.node.json
rm src/main.tsx
rm src/App.tsx
```

### Update package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Remove Vite Dependencies

```bash
npm uninstall vite @vitejs/plugin-react
```

### Consolidate CSS Files

```bash
# Move content from src/index.css to src/app/globals.css
cat src/index.css >> src/app/globals.css
rm src/index.css
```

## Step 2: Update TypeScript Configuration (Day 2-3)

### Enhanced tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/services/*": ["./src/services/*"],
      "@/app/*": ["./src/app/*"],
      "@/hooks/*": ["./src/lib/hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 3: Restructure File Organization (Day 3-4)

### Create New Directory Structure

```bash
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features
mkdir -p src/lib/hooks
mkdir -p src/lib/validations
mkdir -p src/styles
```

### Move Components

```bash
# Move UI components
mv src/components/ui/* src/components/ui/

# Move feature-specific components
mv src/components/figma-generator/* src/components/features/figma-generator/
mv src/components/sections/* src/components/features/sections/

# Move layout components
mv src/components/layout/* src/components/layout/
```

### Update Import Statements

Create a script to update imports:

```javascript
// scripts/update-imports.js
const fs = require('fs');
const path = require('path');

const updateImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update relative imports to absolute
  content = content.replace(
    /from ['"]\.\.\/\.\.\/components\//g,
    "from '@/components/"
  );
  content = content.replace(
    /from ['"]\.\.\/lib\//g,
    "from '@/lib/"
  );
  content = content.replace(
    /from ['"]\.\.\/types\//g,
    "from '@/types/"
  );
  
  fs.writeFileSync(filePath, content);
};

// Run on all TypeScript files
// node scripts/update-imports.js
```

## Step 4: Convert to App Router (Day 4-5)

### Create App Directory Structure

```bash
mkdir -p src/app/(dashboard)
mkdir -p src/app/api/figma
mkdir -p src/app/api/generate-code
```

### Convert Pages to App Router

#### Root Layout
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Figma-to-Code Generator',
  description: 'AI-powered Figma design to production-ready code generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

#### Home Page
```tsx
// src/app/page.tsx
import { Hero } from '@/components/features/sections/Hero'
import { Features } from '@/components/features/sections/Features'
import { ProcessFlow } from '@/components/features/sections/ProcessFlow'
import { Stats } from '@/components/features/sections/Stats'
import { Header } from '@/components/layout/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main>
        <Hero />
        <ProcessFlow />
        <Features />
        <Stats />
      </main>
    </div>
  )
}
```

#### Generator Page
```tsx
// src/app/generator/page.tsx
import { FigmaGenerator } from '@/components/features/figma-generator/FigmaGenerator'
import { Header } from '@/components/layout/Header'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="pt-8">
        <FigmaGenerator />
      </main>
    </div>
  )
}
```

### Add Loading and Error Pages

```tsx
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
```

```tsx
// src/app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

## Step 5: Optimize Performance (Day 5-6)

### Implement Dynamic Imports

```tsx
// src/components/features/figma-generator/FigmaGenerator.tsx
import dynamic from 'next/dynamic'

const CodeGenerationPanel = dynamic(
  () => import('./CodeGenerationPanel'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded"></div>,
    ssr: false
  }
)
```

### Add Image Optimization

```tsx
// Replace img tags with Next.js Image
import Image from 'next/image'

// Before
<img src="/hero-image.jpg" alt="Hero" className="w-full h-auto" />

// After
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  className="w-full h-auto"
  priority
/>
```

### Implement Suspense Boundaries

```tsx
// src/app/generator/page.tsx
import { Suspense } from 'react'

export default function GeneratorPage() {
  return (
    <div>
      <Header />
      <main className="pt-8">
        <Suspense fallback={<GeneratorSkeleton />}>
          <FigmaGenerator />
        </Suspense>
      </main>
    </div>
  )
}
```

## Step 6: Enhance API Routes (Day 6-7)

### Add Input Validation

```typescript
// src/lib/validations.ts
import { z } from 'zod'

export const figmaRequestSchema = z.object({
  figmaUrl: z.string().url().refine(
    (url) => url.includes('figma.com/file/') || url.includes('figma.com/design/'),
    'Must be a valid Figma file URL'
  ),
  apiKey: z.string().regex(/^figd_[a-zA-Z0-9_-]+$/, 'Invalid Figma API key format')
})

export const codeGenerationSchema = z.object({
  figmaData: z.object({}).passthrough(),
  options: z.object({
    framework: z.enum(['react', 'vue', 'html']),
    styling: z.enum(['tailwind', 'css-modules', 'styled-components', 'plain-css']),
    typescript: z.boolean(),
    accessibility: z.boolean(),
    responsive: z.boolean(),
    optimizeImages: z.boolean()
  }),
  customCode: z.object({
    jsx: z.string().optional(),
    css: z.string().optional(),
    cssAdvanced: z.string().optional()
  }).optional()
})
```

### Enhanced API Routes

```typescript
// src/app/api/figma/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { figmaRequestSchema } from '@/lib/validations'
import { FigmaApiClient } from '@/services/figma-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { figmaUrl, apiKey } = figmaRequestSchema.parse(body)

    const fileKey = FigmaApiClient.extractFileKey(figmaUrl)
    const apiClient = new FigmaApiClient(apiKey)
    
    const isValidConnection = await apiClient.validateConnection()
    if (!isValidConnection) {
      return NextResponse.json(
        { error: 'Invalid API key or no access to Figma API' },
        { status: 401 }
      )
    }

    const figmaData = await apiClient.getFile(fileKey)
    
    return NextResponse.json({
      success: true,
      data: figmaData,
      fileKey
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Figma API Error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Step 7: Add State Management (Day 7-8)

### Install Zustand

```bash
npm install zustand
```

### Create Store

```typescript
// src/lib/store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  figmaData: any | null
  generatedComponents: any[]
  isGenerating: boolean
  setFigmaData: (data: any) => void
  setGeneratedComponents: (components: any[]) => void
  setIsGenerating: (generating: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        figmaData: null,
        generatedComponents: [],
        isGenerating: false,
        setFigmaData: (data) => set({ figmaData: data }),
        setGeneratedComponents: (components) => set({ generatedComponents: components }),
        setIsGenerating: (generating) => set({ isGenerating: generating }),
      }),
      {
        name: 'figma-generator-storage',
        partialize: (state) => ({ figmaData: state.figmaData }),
      }
    )
  )
)
```

## Step 8: Add Testing Infrastructure (Day 8-9)

### Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

### Example Test

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
```

## Step 9: Add Code Quality Tools (Day 9-10)

### Install Dependencies

```bash
npm install --save-dev husky lint-staged prettier @commitlint/cli @commitlint/config-conventional
```

### Setup Husky

```bash
npx husky-init && npm install
```

### Configure Pre-commit Hook

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Lint-staged Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Step 10: Final Testing and Deployment (Day 10-11)

### Performance Testing

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun
```

### Build and Test

```bash
# Build the application
npm run build

# Test the build
npm start

# Run all tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] API endpoints working
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Error tracking setup
- [ ] Monitoring configured

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**
   ```bash
   git checkout main
   npm install
   npm run dev
   ```

2. **Partial Rollback**
   - Revert specific commits
   - Keep beneficial changes
   - Fix issues incrementally

3. **Data Recovery**
   - Restore from backups
   - Verify data integrity
   - Test functionality

## Post-Migration Tasks

- [ ] Update documentation
- [ ] Train team on new structure
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Plan next optimization phase

This migration guide ensures a smooth transition from the current mixed architecture to a optimized Next.js application while maintaining functionality and improving performance.