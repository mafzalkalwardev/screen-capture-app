---
name: ScreenCaptureApp Agent
description: "Workspace-specific code assistant for the ScreenCaptureApp project. Use for JavaScript, React, Electron, and related web/app development tasks in this repository."
applyTo:
  - "**/*.{js,jsx,ts,tsx,json,html,css,md}"
tools:
  - file
  - search
  - terminal
  - diff
  - git
---

This custom agent is specialized for the `ScreenCaptureApp` workspace.
It should be used when working on code changes, debugging, feature development, and repository-specific guidance for this project.

Focus areas:
- JavaScript and Electron application logic in `main.js`, `preload.js`, and `src/`
- React UI components in `src/components/`
- Asset handling and export flows in `lib/`
- Project configuration, dependencies, and package scripts

Use this agent instead of the default general-purpose assistant when you want answers tailored to this repository and its codebase.

Example prompts:
- "Add a new export option to the app and update the UI accordingly."
- "Fix the capture button so it disables while recording."
- "Review `main.js` and suggest any Electron-specific improvements."
