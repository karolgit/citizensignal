# CitizenSignal

CitizenSignal is a local election analysis project. This repository is organized so product documentation, application code, configuration, automation, and tests can evolve in one place without getting mixed together.

## TypeScript Scaffold

This repository now includes a Node-oriented TypeScript baseline with:

- `package.json` for scripts and development dependencies
- `tsconfig.json` for strict TypeScript compilation
- `vitest.config.ts` for test execution
- `src/` with a small application entry point
- `tests/` with a sample test
- `config/.env.example` for checked-in environment defaults

## Getting Started

1. Install dependencies with `npm install`.
2. Start the development entry point with `npm run dev`.
3. Run the test suite with `npm test`.
4. Build the project with `npm run build`.

## Repository Layout

- `prd/` - product requirement documents and planning prompts.
- `docs/` - supporting documentation such as architecture notes, workflows, research summaries, and operational runbooks.
- `src/` - application source code.
- `config/` - environment templates, app configuration, and deployment-related settings.
- `tests/` - automated tests and test fixtures.
- `scripts/` - helper scripts for setup, data tasks, linting, and developer workflows.

## Working Conventions

- Keep product-facing requirements and planning materials in `prd/`.
- Put implementation and technical design docs in `docs/`.
- Keep source code organized by application area under `src/` once the stack is chosen.
- Use `src/index.ts` as the application entry point unless we later split into multiple services.
- Store checked-in configuration templates in `config/`; keep secrets out of the repository.
- Add tests alongside the capabilities they validate, using `tests/` for integration, system, and shared fixtures.
- Use `scripts/` for repeatable project tasks instead of relying on one-off shell history.

## Suggested Next Steps

1. Run `npm install` to generate the lockfile and install the TypeScript toolchain.
2. Replace the sample `src/app.ts` logic with the first real domain module.
3. Expand `tests/` as the first services and workflows are added.
4. Add architecture and setup notes to `docs/` as implementation begins.
