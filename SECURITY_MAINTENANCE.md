# Dependency security maintenance

Use Node.js 24. CI audits dependencies and builds the application.

Bun 1.3.14 remains the package manager. Run `bun install --frozen-lockfile`, `bun audit`, and `bun run build`. Vite 6 and ESLint 10 support the patched dependency graph; the minimatch override addresses remaining linter dependencies.

Existing lint reports five findings in unchanged source: four empty catch blocks and one fast-refresh export finding. TypeScript and production compilation pass.
