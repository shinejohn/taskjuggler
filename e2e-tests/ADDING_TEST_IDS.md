# Adding Test IDs to Components

To make E2E tests more reliable and maintainable, add `data-testid` attributes to key interactive elements.

## Vue Component Example

```vue
<template>
  <button 
    data-testid="login-submit-button"
    type="submit"
    class="btn btn-primary"
  >
    Sign in
  </button>
</template>
```

## Recommended Test IDs

### Authentication Pages

```vue
<!-- Login Page -->
<input data-testid="login-email" type="email" />
<input data-testid="login-password" type="password" />
<button data-testid="login-submit" type="submit">Sign in</button>
<button data-testid="google-login">Sign in with Google</button>
<a data-testid="forgot-password-link">Forgot password?</a>
<a data-testid="sign-up-link">Sign up</a>

<!-- Register Page -->
<input data-testid="register-name" />
<input data-testid="register-email" type="email" />
<input data-testid="register-password" type="password" />
<input data-testid="register-password-confirm" type="password" />
<button data-testid="register-submit" type="submit">Create account</button>
```

### Task Management

```vue
<!-- Tasks Page -->
<button data-testid="create-task-button">New Task</button>
<div data-testid="task-list">...</div>
<div data-testid="task-item-{id}">...</div>

<!-- Task Form -->
<input data-testid="task-title" />
<textarea data-testid="task-description" />
<button data-testid="task-save">Save</button>
```

### Navigation

```vue
<nav data-testid="main-navigation">
  <a data-testid="nav-login">Login</a>
  <a data-testid="nav-signup">Sign Up</a>
</nav>
```

## Using Test IDs in Tests

```typescript
// Instead of fragile selectors like:
await page.click('button.btn-primary');

// Use stable test IDs:
await page.click('[data-testid="login-submit"]');
```

## Benefits

1. **Stable** - Won't break if CSS classes change
2. **Clear intent** - Makes it obvious what element is being tested
3. **Maintainable** - Easy to find and update
4. **Fast** - Direct selector is faster than complex CSS queries

