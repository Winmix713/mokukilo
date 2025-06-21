# Contributing to Figma-to-Code Generator

Thank you for your interest in contributing to the Figma-to-Code Generator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- A Figma account with API access

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/yourusername/figma-to-code-generator.git
   cd figma-to-code-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

## 📋 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Node.js version: [e.g. 18.17.0]
- Next.js version: [e.g. 14.1.0]
```

### Suggesting Features

Feature requests are welcome! Please provide:

- **Clear description** of the feature
- **Use case** explaining why it would be useful
- **Possible implementation** if you have ideas
- **Alternatives considered**

### Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` new features
   - `fix:` bug fixes
   - `docs:` documentation changes
   - `style:` formatting changes
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🏗️ Project Structure

Understanding the project structure will help you contribute effectively:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (dashboard)/       # Route groups
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature components
├── lib/                  # Utilities and hooks
├── services/             # External services
├── types/                # TypeScript definitions
└── styles/               # Additional styles
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use strict mode settings

```typescript
// Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { ... }
```

### React Components

- Use functional components with hooks
- Implement proper prop types
- Use meaningful component names
- Keep components focused and small

```tsx
// Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS and Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Maintain consistent spacing and typography

```tsx
// Good
<div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### API Routes

- Use proper HTTP status codes
- Implement error handling
- Validate input data
- Add rate limiting where appropriate

```typescript
// Good
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    
    const result = await processData(validatedData);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions and components
- Use descriptive test names
- Test both happy path and error cases
- Aim for high test coverage

```typescript
// Good
describe('Button component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

- Test API endpoints
- Test user workflows
- Test component interactions

### E2E Tests

- Test critical user paths
- Test across different browsers
- Test responsive behavior

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document API endpoints
- Include usage examples

```typescript
/**
 * Generates React components from Figma design data
 * @param figmaData - The Figma file data
 * @param options - Generation options
 * @returns Array of generated components
 */
export function generateComponents(
  figmaData: FigmaApiResponse,
  options: CodeGenerationOptions
): GeneratedComponent[] {
  // Implementation
}
```

### README Updates

- Update README for new features
- Add examples for new functionality
- Keep installation instructions current

## 🔍 Code Review Process

### For Contributors

- Ensure your code follows the style guide
- Add tests for new functionality
- Update documentation as needed
- Respond to review feedback promptly

### For Reviewers

- Be constructive and helpful
- Focus on code quality and maintainability
- Check for security issues
- Verify tests are adequate

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Celebrate diverse perspectives

### Communication

- Use clear, concise language
- Be patient with newcomers
- Ask questions when unclear
- Share knowledge generously

## 🎯 Areas for Contribution

### High Priority

- Performance optimizations
- Accessibility improvements
- Test coverage expansion
- Documentation enhancements

### Medium Priority

- New framework support (Angular, Svelte)
- Additional styling options
- Enhanced error handling
- UI/UX improvements

### Low Priority

- Code refactoring
- Developer tooling
- Example projects
- Tutorial content

## 📞 Getting Help

If you need help:

1. Check existing documentation
2. Search through issues
3. Ask in discussions
4. Join our Discord community
5. Contact maintainers

## 🙏 Recognition

Contributors will be:

- Listed in the README
- Mentioned in release notes
- Invited to the contributors team
- Given credit in documentation

Thank you for contributing to make Figma-to-Code Generator better for everyone! 🎉