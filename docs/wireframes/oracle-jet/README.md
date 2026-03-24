# Oracle JET Prototype

This folder contains a lightweight Oracle JET-based wireframe prototype for two roles:

- administrator
- campaign manager

## Files

- `index.html`: prototype entry point
- `js/main.js`: RequireJS bootstrap for Oracle JET
- `js/appController.js`: in-memory screen logic and interaction handlers
- `js/data.js`: in-memory sample data used by the prototype
- `css/app.css`: prototype-specific styling layered on top of the JET Redwood look

## Included Screens

- administrator dashboard
- campaign manager dashboard
- district setup
- source registry

## Notes

This prototype uses in-memory JavaScript objects only.

It is intended as a design and workflow prototype rather than a production application.

Because this repository does not currently include a local Oracle JET install, the prototype is wired in a CDN-style Oracle JET app structure.
