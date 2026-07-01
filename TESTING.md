# Testing Documentation

This project uses a comprehensive testing setup with both unit/component tests and end-to-end (E2E) tests.

## Testing Stack

### Unit & Component Testing
- **Vitest** - Fast, modern testing framework with great ESM support
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - Browser environment simulation

### E2E Testing
- **Playwright** - Modern, reliable E2E testing framework
- Tests run across multiple browsers (Chromium, Firefox, WebKit)
- Mobile viewport testing (iPhone, Pixel)

## Running Tests

### Unit & Component Tests

```bash
# Run tests in watch mode (useful during development)
npm test

# Run tests once
npm run test:run

# Run tests with UI (visual test runner)
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (visual test runner)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### Run All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test File Organization

```
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx          # Component tests
├── lib/
│   ├── utils.tsx
│   └── utils.test.ts                # Unit tests
├── e2e/
│   ├── home.spec.ts                 # E2E tests for homepage
│   ├── navigation.spec.ts           # E2E tests for navigation
│   └── smoke.spec.ts                # E2E smoke tests
└── test/
    └── setup.ts                     # Test setup and configuration
```

## Test File Naming Conventions

- **Unit tests**: `*.test.ts`
- **Component tests**: `*.test.tsx`
- **E2E tests**: `*.spec.ts` (in `e2e/` directory)

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-module';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle clicks', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Click me');
    await expect(page.locator('.result')).toContainText('Success');
  });
});
```

## Current Test Coverage

### Unit Tests
- ✅ `lib/utils.test.ts` - Utility function tests (5 tests)
- ✅ `components/ui/button.test.tsx` - Button component tests (7 tests)

### E2E Tests
- ✅ `e2e/home.spec.ts` - Homepage functionality (5 tests)
- ✅ `e2e/navigation.spec.ts` - Navigation and routing (3 tests)
- ✅ `e2e/smoke.spec.ts` - Smoke tests (3 tests)
- ✅ `e2e/media.spec.ts` - Media loading tests

**Total: ~20 tests** (unit/component + E2E)

## Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `test/setup.ts` - Test environment setup

## CI/CD Integration

### GitHub Actions

Tests run automatically on every pull request via GitHub Actions. The workflow includes:

- **Unit & Component Tests** - Run on every PR
- **E2E Tests** - Run on every PR with Chromium browser
- **Lint & Type Check** - Verify code quality and TypeScript

**Workflow file**: `.github/workflows/test.yml`

**Triggers**:
- Pull requests to any branch
- Pushes to `main` or `claude-audit` branches

**Features**:
- ✅ Parallel job execution (unit, E2E, lint run simultaneously)
- ✅ NPM dependency caching for faster runs
- ✅ Coverage reports uploaded as artifacts
- ✅ Playwright reports on test failures
- ✅ Test results retention for 30 days

**Viewing Results**:
1. Go to your PR on GitHub
2. Scroll to the bottom to see check status
3. Click "Details" to view test results
4. Download artifacts for coverage/failure reports

### Manual CI Setup

For other CI environments, tests can be run with:

```bash
# Install dependencies and browsers
npm ci
npx playwright install --with-deps

# Run all tests
npm run test:all
```

## Best Practices

1. **Write tests for new features** - All new components and utilities should have tests
2. **Test user behavior, not implementation** - Focus on what users see and do
3. **Keep tests focused** - Each test should verify one specific behavior
4. **Use descriptive test names** - Test names should clearly describe what they verify
5. **Mock external dependencies** - Keep tests isolated and fast
6. **Test accessibility** - Use semantic queries (getByRole, getByLabel) in component tests
7. **Maintain test coverage** - Aim for high coverage on critical paths

## Troubleshooting

### Tests fail with "module not found"
- Run `npm install` to ensure all dependencies are installed
- Check that the import paths in your tests match your project structure

### Playwright tests timeout
- Ensure the dev server is running (`npm run dev`)
- Increase timeout in `playwright.config.ts` if needed
- Check network requests in the Playwright UI mode

### Coverage reports missing files
- Update the `coverage.exclude` array in `vitest.config.ts`
- Ensure files are properly imported and not in excluded directories

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
