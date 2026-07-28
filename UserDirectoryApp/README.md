# UserDirectoryApp

Frontend application for the User Directory project.

Built with:
- React + TypeScript
- Vite
- Auth0 (login/logout)

## Folder Structure

```text
UserDirectoryApp/
  src/
    main.tsx                 # App entry point + Auth0Provider setup
    App.tsx                  # Main layout and Add/List view switching
    api.ts                   # API calls to backend (/api/users)
    types.ts                 # Shared TypeScript types
    App.css                  # App-specific styles
    index.css                # Global styles

    LogoutButton.tsx         # Shows user info and logout action

    pages/
      WelcomePage.tsx        # Landing page for unauthenticated users
      AddUser.tsx            # Form to create a new user
      ListUsers.tsx          # Loads and displays users
      NotFoundPage.tsx       # Fallback page component

    test/
      setup.ts               # Vitest setup (jest-dom matchers)

    api.test.ts              # Unit tests for API helper
    LogoutButton.test.tsx    # Unit tests for Logout button
```

## How Data Flows

1. `main.tsx` configures Auth0.
2. `App.tsx` decides what to show:
   - Not logged in -> `WelcomePage`
   - Logged in -> Add/List views
3. `pages/AddUser.tsx` sends create request through `api.ts`.
4. `pages/ListUsers.tsx` fetches users through `api.ts`.

## Local Commands

```bash
npm install
npm run dev
npm test
```
