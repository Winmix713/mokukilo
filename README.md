# 🎨 Figma-to-Code Generator

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Transform Figma designs into production-ready React components with 95-100% visual accuracy in under 30 seconds.**

An AI-powered Next.js application that converts Figma designs into clean, accessible, and production-ready code using advanced processing pipelines and modern web technologies.

## ✨ Features

- 🚀 **Lightning Fast**: Generate components in under 30 seconds
- 🎯 **95-100% Visual Accuracy**: Pixel-perfect recreation of Figma designs
- ♿ **WCAG 2.1 AA Compliant**: Accessibility built-in by default
- 📱 **Responsive by Default**: Mobile-first, responsive components
- 🎨 **Multi-Framework Support**: React, Vue, HTML output options
- 🔧 **TypeScript Ready**: Full TypeScript support with auto-generated types
- 🎭 **Design System Ready**: Extracts and applies design tokens
- ⚡ **Next.js Optimized**: Built for Next.js 14+ with App Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Figma API Token ([Get yours here](https://www.figma.com/developers/api#access-tokens))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/figma-to-code-generator.git
cd figma-to-code-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your configuration to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Route groups for dashboard
│   ├── api/                     # API routes
│   │   ├── figma/              # Figma API integration
│   │   └── generate-code/      # Code generation endpoints
│   ├── generator/              # Generator page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── providers.tsx           # App providers
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   ├── layout/                 # Layout components
│   ├── sections/               # Page sections
│   └── figma-generator/        # Feature-specific components
├── lib/                        # Utilities and configurations
│   ├── utils.ts               # General utilities
│   ├── validations.ts         # Zod schemas
│   └── hooks/                 # Custom React hooks
├── services/                   # External service integrations
│   ├── figma-api.ts           # Figma API client
│   └── advanced-code-generator.ts # Code generation logic
├── types/                      # TypeScript type definitions
│   └── figma.ts               # Figma-related types
└── styles/                     # Additional stylesheets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Figma API Configuration
FIGMA_API_TOKEN=your_figma_token_here

# Database (Optional)
DATABASE_URL=your_database_url

# Redis Cache (Optional)
REDIS_URL=your_redis_url

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Figma API Setup

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to "Personal Access Tokens"
3. Generate a new token
4. Add it to your `.env.local` file

## 🎯 Usage

### Basic Usage

1. **Enter Figma URL**: Paste your Figma file or design URL
2. **Add API Token**: Enter your Figma personal access token
3. **Configure Options**: Choose framework, styling, and features
4. **Generate Code**: Click generate to create production-ready components

### Advanced Features

#### Custom Code Integration
```typescript
// Add custom JSX code
const customJSX = `
  // Custom logic here
  const [isActive, setIsActive] = useState(false)
`

// Add custom CSS
const customCSS = `
  .custom-animation {
    transition: all 0.3s ease;
  }
`
```

#### Framework Options
- **React + TypeScript**: Modern React with full type safety
- **Vue.js**: Vue 3 with Composition API
- **HTML + CSS**: Vanilla HTML with modern CSS

#### Styling Options
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: Scoped CSS modules
- **Styled Components**: CSS-in-JS solution
- **Plain CSS**: Traditional CSS approach

## 🏛️ Architecture

### 3-Phase Processing Pipeline

1. **Phase 1: Figma API Data Extraction**
   - Complete metadata extraction
   - Layer structure analysis
   - Style properties mapping

2. **Phase 2: Code Processing**
   - JSX/Vue component generation
   - CSS optimization and conversion
   - TypeScript type generation

3. **Phase 3: Quality Enhancement**
   - Accessibility compliance checking
   - Responsive design optimization
   - Performance optimization

### Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand + React Query
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📈 Performance

### Metrics
- **Lighthouse Score**: 95+ Performance
- **Bundle Size**: < 500KB (gzipped)
- **Time to Interactive**: < 3s
- **First Contentful Paint**: < 1.5s

### Optimization Features
- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization with next/image
- Font optimization with next/font
- API response caching
- Component lazy loading

## 🔒 Security

- Input validation with Zod schemas
- CSRF protection
- Rate limiting on API routes
- Secure headers configuration
- Environment variable validation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/figma-to-code-generator.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push to your fork and submit a pull request
git push origin feature/amazing-feature
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📝 API Documentation

### Figma API Endpoint

```typescript
POST /api/figma
Content-Type: application/json

{
  "figmaUrl": "https://www.figma.com/file/...",
  "apiKey": "figd_..."
}
```

### Code Generation Endpoint

```typescript
POST /api/generate-code
Content-Type: application/json

{
  "figmaData": { /* Figma file data */ },
  "options": {
    "framework": "react",
    "styling": "tailwind",
    "typescript": true,
    "accessibility": true,
    "responsive": true
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Figma API Connection Failed**
- Verify your API token is correct
- Check if the Figma file is accessible
- Ensure the URL format is correct

**Code Generation Errors**
- Check if the Figma file has valid components
- Verify the design structure is supported
- Try with a simpler design first

**Performance Issues**
- Clear browser cache
- Check network connection
- Reduce complexity of Figma file

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Figma API](https://www.figma.com/developers/api) for design data access
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📞 Support

- 📧 Email: support@figma-to-code.com
- 💬 Discord: [Join our community](https://discord.gg/figma-to-code)
- 📖 Documentation: [docs.figma-to-code.com](https://docs.figma-to-code.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/figma-to-code-generator/issues)

---

<div align="center">
  <p>Made with ❤️ by the Figma-to-Code team</p>
  <p>
    <a href="https://github.com/yourusername/figma-to-code-generator">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/figmatocode">🐦 Follow on Twitter</a> •
    <a href="https://figma-to-code.com">🌐 Visit Website</a>
  </p>
</div>