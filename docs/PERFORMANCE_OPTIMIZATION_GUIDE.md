# Performance Optimization Guide

## Overview
This guide provides specific performance optimization strategies for the Next.js Figma-to-Code Generator application.

## Current Performance Analysis

### Identified Issues
1. **Large Bundle Size**: Multiple framework configurations
2. **Unoptimized Images**: Using regular img tags
3. **No Code Splitting**: All code loaded upfront
4. **Missing Caching**: No API response caching
5. **Synchronous Loading**: No lazy loading implementation

## Optimization Strategies

### 1. Bundle Size Optimization

#### Remove Unused Dependencies
```bash
# Remove Vite-related packages
npm uninstall vite @vitejs/plugin-react

# Analyze bundle size
npm install --save-dev @next/bundle-analyzer
```

#### Tree Shaking Optimization
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config) => {
    config.optimization.usedExports = true
    return config
  },
})
```

### 2. Image Optimization

#### Replace img tags with Next.js Image
```tsx
// Before
<img src="/hero-image.jpg" alt="Hero" />

// After
import Image from 'next/image'
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Implement Responsive Images
```tsx
<Image
  src="/hero-image.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

### 3. Code Splitting & Lazy Loading

#### Dynamic Imports for Heavy Components
```tsx
// components/FigmaGenerator.tsx
import dynamic from 'next/dynamic'

const CodeGenerationPanel = dynamic(
  () => import('./CodeGenerationPanel'),
  {
    loading: () => <div>Loading code generator...</div>,
    ssr: false
  }
)

const ProcessingPipeline = dynamic(
  () => import('./ProcessingPipeline'),
  { loading: () => <div>Loading pipeline...</div> }
)
```

#### Route-based Code Splitting
```tsx
// app/generator/page.tsx
import dynamic from 'next/dynamic'

const FigmaGenerator = dynamic(
  () => import('@/components/figma-generator/FigmaGenerator'),
  {
    loading: () => <GeneratorSkeleton />,
    ssr: false
  }
)
```

### 4. Server Components Optimization

#### Convert to Server Components
```tsx
// app/page.tsx - Server Component
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      {/* Client component only where needed */}
      <FigmaGeneratorClient />
    </main>
  )
}
```

#### Streaming with Suspense
```tsx
// app/generator/page.tsx
import { Suspense } from 'react'

export default function GeneratorPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<GeneratorSkeleton />}>
        <FigmaGenerator />
      </Suspense>
    </div>
  )
}
```

### 5. API Performance Optimization

#### Implement Caching
```typescript
// lib/cache.ts
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key)
  
  if (cached) {
    return JSON.parse(cached)
  }
  
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}
```

#### API Route Optimization
```typescript
// app/api/figma/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCachedData } from '@/lib/cache'

export async function POST(request: NextRequest) {
  try {
    const { figmaUrl, apiKey } = await request.json()
    
    // Cache key based on URL and API key hash
    const cacheKey = `figma:${Buffer.from(figmaUrl).toString('base64')}`
    
    const figmaData = await getCachedData(
      cacheKey,
      () => fetchFigmaData(figmaUrl, apiKey),
      1800 // 30 minutes
    )
    
    return NextResponse.json({ success: true, data: figmaData })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Figma data' },
      { status: 500 }
    )
  }
}
```

### 6. Font Optimization

#### Use next/font
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 7. CSS Optimization

#### Critical CSS Inlining
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            .hero { /* styles */ }
            .header { /* styles */ }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### CSS-in-JS Optimization
```tsx
// For styled-components users
import { ServerStyleSheet } from 'styled-components'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sheet = new ServerStyleSheet()
  
  try {
    const styledChildren = sheet.collectStyles(children)
    const styleTags = sheet.getStyleElement()
    
    return (
      <html>
        <head>{styleTags}</head>
        <body>{styledChildren}</body>
      </html>
    )
  } finally {
    sheet.seal()
  }
}
```

### 8. Database Query Optimization

#### Connection Pooling
```typescript
// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export { pool }
```

#### Query Optimization
```typescript
// services/figma-service.ts
export class FigmaService {
  async getFigmaData(fileKey: string) {
    // Use prepared statements
    const query = 'SELECT * FROM figma_cache WHERE file_key = $1'
    const result = await pool.query(query, [fileKey])
    
    return result.rows[0]
  }
  
  async cacheFigmaData(fileKey: string, data: any) {
    const query = `
      INSERT INTO figma_cache (file_key, data, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (file_key)
      DO UPDATE SET data = $2, updated_at = NOW()
    `
    await pool.query(query, [fileKey, JSON.stringify(data)])
  }
}
```

### 9. Client-Side Performance

#### Optimize React Query
```tsx
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

#### Implement Virtual Scrolling
```tsx
// For large lists
import { FixedSizeList as List } from 'react-window'

function ComponentList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ComponentItem item={items[index]} />
    </div>
  )
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### 10. Monitoring & Measurement

#### Web Vitals Tracking
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

#### Custom Performance Monitoring
```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now()
    
    try {
      const result = await fn.apply(this, args)
      const duration = performance.now() - start
      
      // Log to analytics
      if (typeof window !== 'undefined') {
        gtag('event', 'timing_complete', {
          name,
          value: Math.round(duration),
        })
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      
      // Log error with timing
      console.error(`${name} failed after ${duration}ms:`, error)
      throw error
    }
  }
}
```

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Custom Metrics
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)
- **API Response Time**: < 500ms
- **Cache Hit Rate**: > 80%

## Testing Performance

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
```

### Performance Budget
```json
{
  "budget": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "interactive",
          "budget": 3000
        },
        {
          "metric": "first-meaningful-paint",
          "budget": 1000
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 500
        },
        {
          "resourceType": "total",
          "budget": 1000
        }
      ]
    }
  ]
}
```

## Implementation Priority

1. **High Impact, Low Effort**
   - Remove Vite configuration
   - Implement Next.js Image
   - Add basic caching

2. **High Impact, Medium Effort**
   - Convert to Server Components
   - Implement code splitting
   - Optimize bundle size

3. **Medium Impact, High Effort**
   - Add comprehensive caching
   - Implement virtual scrolling
   - Set up monitoring

This guide provides a roadmap for achieving significant performance improvements while maintaining code quality and developer experience.