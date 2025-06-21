# 📁 File Structure Documentation

This document provides a comprehensive overview of the project's file structure, explaining the purpose and organization of each directory and key files.

## 🏗️ Project Overview

The Figma-to-Code Generator follows Next.js 14+ App Router conventions with a clean, modular architecture designed for scalability and maintainability.

```
figma-to-code-generator/
├── 📁 .github/                    # GitHub configuration
├── 📁 .next/                      # Next.js build output (auto-generated)
├── 📁 .vscode/                    # VS Code settings
├── 📁 docs/                       # Project documentation
├── 📁 public/                     # Static assets
├── 📁 src/                        # Source code
├── 📁 tests/                      # Test files
├── 📄 Configuration files         # Various config files
└── 📄 Documentation files         # README, LICENSE, etc.
```

## 📂 Detailed Structure

### Root Directory

```
├── 📄 .env.example               # Environment variables template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 .eslintrc.json            # ESLint configuration
├── 📄 CHANGELOG.md              # Version history
├── 📄 CONTRIBUTING.md           # Contribution guidelines
├── 📄 LICENSE                   # MIT license
├── 📄 README.md                 # Project overview
├── 📄 next.config.js            # Next.js configuration
├── 📄 package.json              # Dependencies and scripts
├── 📄 postcss.config.js         # PostCSS configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 jest.config.js            # Jest testing configuration
```

### GitHub Configuration (`.github/`)

```
.github/
├── 📁 ISSUE_TEMPLATE/           # Issue templates
│   ├── 📄 bug_report.md
│   ├── 📄 feature_request.md
│   └── 📄 question.md
├── 📁 workflows/                # GitHub Actions
│   ├── 📄 ci.yml               # Continuous integration
│   ├── 📄 deploy.yml           # Deployment workflow
│   └── 📄 lighthouse.yml       # Performance testing
├── 📄 PULL_REQUEST_TEMPLATE.md # PR template
└── 📄 CODEOWNERS              # Code ownership
```

### Documentation (`docs/`)

```
docs/
├── 📄 API.md                    # API documentation
├── 📄 DEPLOYMENT.md             # Deployment guide
├── 📄 FILE_STRUCTURE.md         # This file
├── 📄 IMPLEMENTATION_CHECKLIST.md # Implementation tasks
├── 📄 MIGRATION_STEPS.md        # Migration guide
├── 📄 PERFORMANCE_OPTIMIZATION_GUIDE.md # Performance guide
├── 📄 REFACTORING_PLAN.md       # Refactoring strategy
└── 📄 TROUBLESHOOTING.md        # Common issues and solutions
```

### Public Assets (`public/`)

```
public/
├── 📁 icons/                    # App icons and favicons
│   ├── 📄 favicon.ico
│   ├── 📄 icon-192.png
│   └── 📄 icon-512.png
├── 📁 images/                   # Static images
│   ├── 📄 hero-bg.jpg
│   ├── 📄 logo.svg
│   └── 📄 og-image.png
├── 📄 manifest.json             # PWA manifest
├── 📄 robots.txt               # Search engine directives
└── 📄 sitemap.xml              # Site structure for SEO
```

### Source Code (`src/`)

The main application source code is organized into logical modules:

```
src/
├── 📁 app/                      # Next.js App Router
├── 📁 components/               # React components
├── 📁 lib/                      # Utilities and configurations
├── 📁 services/                 # External service integrations
├── 📁 types/                    # TypeScript type definitions
└── 📁 styles/                   # Additional stylesheets
```

## 🎯 App Directory (`src/app/`)

Following Next.js 14+ App Router conventions:

```
app/
├── 📁 (dashboard)/              # Route groups
│   ├── 📁 analytics/           # Analytics dashboard
│   ├── 📁 settings/            # User settings
│   └── 📄 layout.tsx           # Dashboard layout
├── 📁 api/                      # API routes
│   ├── 📁 figma/               # Figma API endpoints
│   │   └── 📄 route.ts
│   ├── 📁 generate-code/       # Code generation endpoints
│   │   └── 📄 route.ts
│   └── 📁 auth/                # Authentication endpoints
├── 📁 generator/                # Generator page
│   ├── 📄 loading.tsx          # Loading UI
│   ├── 📄 error.tsx            # Error UI
│   └── 📄 page.tsx             # Main generator page
├── 📄 globals.css               # Global styles
├── 📄 layout.tsx                # Root layout
├── 📄 loading.tsx               # Global loading UI
├── 📄 not-found.tsx             # 404 page
├── 📄 page.tsx                  # Home page
└── 📄 providers.tsx             # App providers (React Query, etc.)
```

### API Routes Structure

```
api/
├── 📁 auth/                     # Authentication
│   ├── 📄 login/route.ts
│   ├── 📄 logout/route.ts
│   └── 📄 register/route.ts
├── 📁 figma/                    # Figma integration
│   ├── 📄 route.ts             # Main Figma API
│   ├── 📄 validate/route.ts    # URL validation
│   └── 📄 components/route.ts  # Component extraction
├── 📁 generate-code/            # Code generation
│   ├── 📄 route.ts             # Main generation
│   ├── 📄 preview/route.ts     # Code preview
│   └── 📄 download/route.ts    # File download
└── 📁 health/                   # Health checks
    └── 📄 route.ts
```

## 🧩 Components (`src/components/`)

Organized by functionality and reusability:

```
components/
├── 📁 ui/                       # Base UI components (shadcn/ui)
│   ├── 📄 badge.tsx
│   ├── 📄 button.tsx
│   ├── 📄 card.tsx
│   ├── 📄 checkbox.tsx
│   ├── 📄 input.tsx
│   ├── 📄 label.tsx
│   ├── 📄 progress.tsx
│   ├── 📄 select.tsx
│   ├── 📄 separator.tsx
│   ├── 📄 tabs.tsx
│   └── 📄 textarea.tsx
├── 📁 layout/                   # Layout components
│   ├── 📄 Header.tsx           # Main navigation
│   ├── 📄 Footer.tsx           # Site footer
│   ├── 📄 Sidebar.tsx          # Dashboard sidebar
│   └── 📄 Navigation.tsx       # Navigation menu
├── 📁 forms/                    # Form components
│   ├── 📄 FigmaUrlForm.tsx     # Figma URL input
│   ├── 📄 ConfigurationForm.tsx # Generation options
│   └── 📄 ContactForm.tsx      # Contact form
├── 📁 features/                 # Feature-specific components
│   ├── 📁 figma-generator/     # Main generator feature
│   │   ├── 📄 FigmaGenerator.tsx
│   │   ├── 📄 FigmaInfoDisplay.tsx
│   │   ├── 📄 CodeGenerationPanel.tsx
│   │   ├── 📄 CodePreview.tsx
│   │   ├── 📄 ProcessingPipeline.tsx
│   │   └── 📄 QualityReport.tsx
│   ├── 📁 sections/            # Landing page sections
│   │   ├── 📄 Hero.tsx
│   │   ├── 📄 Features.tsx
│   │   ├── 📄 ProcessFlow.tsx
│   │   └── 📄 Stats.tsx
│   └── 📁 dashboard/           # Dashboard components
│       ├── 📄 Overview.tsx
│       ├── 📄 RecentProjects.tsx
│       └── 📄 UsageStats.tsx
└── 📁 common/                   # Common/shared components
    ├── 📄 LoadingSpinner.tsx
    ├── 📄 ErrorBoundary.tsx
    ├── 📄 ConfirmDialog.tsx
    └── 📄 Toast.tsx
```

### Component Organization Principles

1. **UI Components**: Reusable, unstyled base components
2. **Layout Components**: Page structure and navigation
3. **Form Components**: Input handling and validation
4. **Feature Components**: Business logic and specific functionality
5. **Common Components**: Shared utilities and patterns

## 🛠️ Library (`src/lib/`)

Utilities, configurations, and custom hooks:

```
lib/
├── 📁 hooks/                    # Custom React hooks
│   ├── 📄 useLocalStorage.ts   # Local storage hook
│   ├── 📄 useDebounce.ts       # Debounce hook
│   ├── 📄 useFigmaApi.ts       # Figma API hook
│   └── 📄 useCodeGeneration.ts # Code generation hook
├── 📁 validations/              # Zod validation schemas
│   ├── 📄 figma.ts             # Figma-related schemas
│   ├── 📄 auth.ts              # Authentication schemas
│   └── 📄 generation.ts        # Code generation schemas
├── 📄 utils.ts                  # General utilities
├── 📄 constants.ts              # App constants
├── 📄 auth.ts                   # Authentication utilities
├── 📄 cache.ts                  # Caching utilities
├── 📄 db.ts                     # Database utilities
└── 📄 analytics.ts              # Analytics utilities
```

### Utility Functions

```typescript
// lib/utils.ts - Core utilities
export function cn(...inputs: ClassValue[]) // Class name utility
export function formatFileSize(bytes: number) // File size formatting
export function formatDuration(ms: number) // Duration formatting
export function debounce<T>(...) // Debounce function
export function copyToClipboard(text: string) // Clipboard utility
export function downloadFile(...) // File download utility
```

## 🔧 Services (`src/services/`)

External service integrations and business logic:

```
services/
├── 📄 figma-api.ts              # Figma API client
├── 📄 advanced-code-generator.ts # Code generation engine
├── 📄 auth-service.ts           # Authentication service
├── 📄 analytics-service.ts      # Analytics integration
├── 📄 cache-service.ts          # Caching service
└── 📄 email-service.ts          # Email notifications
```

### Service Architecture

```typescript
// services/figma-api.ts
export class FigmaApiClient {
  constructor(apiKey: string)
  async getFile(fileKey: string): Promise<FigmaApiResponse>
  async validateConnection(): Promise<boolean>
  static extractFileKey(url: string): string
  static validateApiKey(key: string): boolean
}

// services/advanced-code-generator.ts
export class AdvancedCodeGenerator {
  constructor(figmaData: FigmaApiResponse, options: CodeGenerationOptions)
  generateComponents(): GeneratedComponent[]
  setCustomCode(customCode: CustomCodeInputs): void
}
```

## 📝 Types (`src/types/`)

TypeScript type definitions:

```
types/
├── 📄 figma.ts                  # Figma API types
├── 📄 auth.ts                   # Authentication types
├── 📄 generation.ts             # Code generation types
├── 📄 api.ts                    # API response types
└── 📄 global.ts                 # Global type definitions
```

### Type Organization

```typescript
// types/figma.ts
export interface FigmaApiResponse { ... }
export interface FigmaNode { ... }
export interface GeneratedComponent { ... }
export interface AccessibilityReport { ... }
export interface ComponentMetadata { ... }

// types/generation.ts
export interface CodeGenerationOptions { ... }
export interface ProcessingPhase { ... }
export interface QualityReport { ... }
```

## 🎨 Styles (`src/styles/`)

Additional stylesheets and theme configurations:

```
styles/
├── 📄 components.css            # Component-specific styles
├── 📄 utilities.css             # Utility classes
├── 📄 animations.css            # Custom animations
└── 📄 themes.css                # Theme variables
```

## 🧪 Tests (`tests/`)

Comprehensive testing structure:

```
tests/
├── 📁 __mocks__/                # Mock files
│   ├── 📄 figma-api.ts
│   └── 📄 next-router.ts
├── 📁 components/               # Component tests
│   ├── 📁 ui/
│   ├── 📁 features/
│   └── 📁 layout/
├── 📁 pages/                    # Page tests
├── 📁 api/                      # API route tests
├── 📁 lib/                      # Utility tests
├── 📁 e2e/                      # End-to-end tests
│   ├── 📄 generator.spec.ts
│   ├── 📄 auth.spec.ts
│   └── 📄 navigation.spec.ts
├── 📄 setup.ts                  # Test setup
└── 📄 test-utils.tsx            # Testing utilities
```

## 📋 Configuration Files

### Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['www.figma.com', 'figma-alpha-api.s3.us-west-2.amazonaws.com'],
  },
  // Additional configurations...
}
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Tailwind Configuration (`tailwind.config.js`)

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { /* custom colors */ },
      animation: { /* custom animations */ }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

## 🔄 File Naming Conventions

### Components
- **PascalCase**: `FigmaGenerator.tsx`, `CodePreview.tsx`
- **Descriptive names**: Clearly indicate component purpose
- **Feature prefixes**: Group related components

### Utilities and Services
- **camelCase**: `figma-api.ts`, `code-generator.ts`
- **Kebab-case for files**: Separate words with hyphens
- **Descriptive suffixes**: `-service.ts`, `-utils.ts`, `-config.ts`

### Types and Interfaces
- **PascalCase**: `FigmaApiResponse`, `GeneratedComponent`
- **Descriptive names**: Indicate data structure purpose
- **Grouped by domain**: Related types in same file

### API Routes
- **Kebab-case directories**: `/api/generate-code/`
- **RESTful naming**: Use HTTP verbs and resource names
- **Nested structure**: Group related endpoints

## 📊 File Size Guidelines

### Recommended Limits
- **Components**: < 200 lines (split if larger)
- **Utilities**: < 150 lines per function group
- **Services**: < 300 lines (use composition)
- **Types**: < 100 lines per domain

### Refactoring Triggers
- **File > 300 lines**: Consider splitting
- **Function > 50 lines**: Extract smaller functions
- **Component > 200 lines**: Split into smaller components
- **Too many imports**: Review dependencies

## 🔍 Best Practices

### File Organization
1. **Single Responsibility**: Each file has one clear purpose
2. **Logical Grouping**: Related files in same directory
3. **Clear Naming**: Names indicate file purpose
4. **Consistent Structure**: Follow established patterns

### Import/Export Patterns
```typescript
// Prefer named exports
export function generateCode() { ... }
export class FigmaApiClient { ... }

// Use default exports for main component
export default function HomePage() { ... }

// Barrel exports for clean imports
// components/ui/index.ts
export { Button } from './button'
export { Card } from './card'
```

### Directory Structure
- **Flat when possible**: Avoid deep nesting
- **Group by feature**: Related functionality together
- **Separate concerns**: UI, business logic, utilities
- **Scale gradually**: Start simple, add structure as needed

This file structure provides a solid foundation for a scalable, maintainable Next.js application while following modern development practices and conventions.