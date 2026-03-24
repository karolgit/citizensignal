# CitizenSignal

CitizenSignal is a local election analysis project. This repository is organized so product documentation, application code, configuration, automation, and tests can evolve in one place without getting mixed together.

## TypeScript Scaffold

This repository now includes a Node-oriented TypeScript baseline with:

- `package.json` for scripts and development dependencies
- `tsconfig.json` for strict TypeScript compilation
- `vitest.config.ts` for test execution
- `src/` with a small application entry point
- `tests/` with administration workflow coverage
- `config/.env.example` for checked-in environment defaults

## Administration Foundation

The repository also includes a base administration domain for:

- segment-definition management
- user and privilege-group administration
- district source registration and classification
- audit event capture for administrator actions

Supporting design notes live in `docs/administration-architecture.md` and `docs/oci-terraform-alignment.md`.

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
2. Extend the in-memory repositories to Oracle-backed implementations when the database integration layer is ready.
3. Add API endpoints or UI flows on top of the administration services.
4. Expand `tests/` as additional product workflows are added.
