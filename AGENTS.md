# FRNDLY — AI AGENT OPERATING SYSTEM

This file defines how every AI agent must operate inside this project.

FRNDLY uses multiple AI models through 9Router. Models may change because
of rotation, fallback, quota exhaustion, provider availability, or task
specialization.

Therefore, agents MUST NOT rely on model-to-model memory. The project files
are the shared source of truth.

---

## 1. Project Context

Before performing any non-trivial task, understand the project through:

1. `RULES.md`
2. `CONTEXT.md`
3. The active task file
4. `ai/state/SESSION_STATE.md`
5. Relevant architecture/decision documentation
6. Existing source code

Do not assume the current model already knows the project.

---

## 2. Source of Truth

Use this priority when information conflicts:

1. Explicit user instruction in the current request
2. Current task specification
3. `RULES.md`
4. `CONTEXT.md`
5. `ai/state/SESSION_STATE.md`
6. Relevant architecture/decision documentation
7. Existing code and project conventions
8. AI assumptions

Do not silently invent requirements.

---

## 3. Required Startup Protocol

For every non-trivial task:

1. Read `AGENTS.md`.
2. Read `RULES.md`.
3. Read `CONTEXT.md`.
4. Identify and read the relevant task file.
5. Read `ai/state/SESSION_STATE.md` if it exists.
6. Explore only the relevant parts of the codebase.
7. Create a concise implementation plan.
8. Implement the task.
9. Verify the result.
10. Update `SESSION_STATE.md`.
11. Report the result.

Do not jump directly from a task description to code when the task affects
multiple files or systems.

---

## 4. Multi-Model / 9Router Protocol

9Router may switch the underlying model at any time.

Possible flow:

`Claude → Gemini → GPT → GitHub-hosted model → Antigravity`

The incoming model MUST assume it has no access to the previous model's
internal reasoning.

When taking over:

1. Read `RULES.md`.
2. Read `CONTEXT.md`.
3. Read the active task.
4. Read `ai/state/SESSION_STATE.md`.
5. Inspect current file changes.
6. Continue from the existing implementation.

Do not restart the task merely because the model changed.

Do not undo valid work merely because another model would implement it
differently.

---

## 5. Shared Project Memory

The shared working memory is:

`ai/state/SESSION_STATE.md`

Persist important project state there, including:

- Current objective
- Current phase
- Completed work
- Important discoveries
- Implementation decisions
- Files modified
- Files that must not be modified
- Dependencies
- Failed approaches
- Known issues
- Remaining work
- Verification results
- Next recommended action

Do NOT store hidden chain-of-thought.

Store concise, actionable project state only.

---

## 6. Task Protocol

Use:

`READ → UNDERSTAND → EXPLORE → PLAN → IMPLEMENT → VERIFY → UPDATE STATE → REPORT`

Do not jump directly from task description to implementation when the task
affects multiple files or systems.

---

## 7. RULES.md

`RULES.md` contains persistent project rules and restrictions.

Every agent MUST follow it.

Do not duplicate the contents of `RULES.md` into this file.
`RULES.md` remains the authoritative location for project-specific rules.

---

## 8. CONTEXT.md

`CONTEXT.md` contains project background and knowledge such as:

- Project purpose
- Product goals
- Architecture context
- Terminology
- Business context
- Existing assumptions
- Important historical information

Use it to understand the project.

Do not treat old context as a current task requirement unless the current
task or user instruction requires it.

Do not duplicate `CONTEXT.md` into this file.

---

## 9. Current Task

If the project contains:

`ai/state/CURRENT_TASK.md`

read it to identify the active task.

Recommended flow:

`CURRENT_TASK.md → TASK-XXX.md → SESSION_STATE.md → codebase`

If no current-task pointer exists, locate the relevant task from the user's
request or project task documentation.

---

## 10. Change Control

Before modifying a file, determine:

1. Is the file relevant?
2. Is the change required?
3. Could the change affect existing functionality?
4. Is there an existing component, utility, service, or API to reuse?
5. Is there a smaller safe change?

Prefer minimal, targeted changes.

Avoid unnecessary rewrites, unrelated refactoring, duplicate functionality,
duplicate APIs/components, unnecessary dependencies, and changes to
unrelated files.

---

## 11. Preserve Existing Decisions

Do not silently replace established project decisions.

Examples:

- UI architecture
- Component structure
- API contracts
- Database structure
- Authentication flow
- Navigation
- Currency formatting
- Design system
- Framework choice
- State management

If a previous decision appears incorrect, document the issue and proposed
correction before making a major architectural change.

---

## 12. Frontend Rules

Follow the existing frontend architecture.

The project may use:

- React
- Tailwind CSS
- Shadcn UI
- Framer Motion

Reuse existing components and utilities.

Preserve navigation, typography, responsive behavior, design language,
currency formatting, authentication flow, and existing interactions.

Do not introduce another UI framework unless explicitly requested.

For visual changes, inspect the existing implementation first.

---

## 13. Backend Rules

Respect the existing backend architecture.

When Laravel/backend code is involved, inspect relevant:

- Routes
- Controllers
- Services
- Models
- Migrations
- Requests
- Resources
- Policies
- Authentication
- Authorization
- Database relationships

Reuse existing business logic where possible.

Do not create duplicate endpoints or duplicate business logic.

---

## 14. Visual and Image Research

A multimodal model does NOT automatically have web or Google Image Search.

Separate:

- Vision / image understanding
- Web / image search
- Implementation

When external visual assets are required:

1. Use available browser/search tools.
2. Search for relevant candidates.
3. Evaluate relevance and quality.
4. Consider source and usage/licensing requirements.
5. Use a vision-capable model for analysis when appropriate.
6. Implement only after the asset/reference is established.

Never invent external image URLs.

---

## 15. Browser / Search Tools

When the task requires current external information, documentation,
image search, or web research, use the available browser/search capability
when provided.

Do not claim that a model searched the web unless an actual search/browser
tool was used.

---

## 16. Skills

Use a skill when its purpose matches the current task.

Potential skills include:

- 9router
- frontend
- backend
- visual
- testing
- code-review
- task-execution

Do not load unrelated skills.

Skills provide procedures. They are NOT project memory.

Project memory belongs in `ai/state/SESSION_STATE.md`.

If a `skills/` directory exists, inspect the relevant skill before a task
that clearly matches it.

---

## 17. CodeGraph

When CodeGraph is available, use it to understand relationships between:

- Components
- Functions
- Classes
- Services
- APIs
- Dependencies
- Imports

Use CodeGraph to reduce unnecessary exploration.

Important findings should still be verified against the actual source code.

---

## 18. Obsidian / Knowledge Base

If an Obsidian knowledge base is connected, use it for long-term project
knowledge such as architecture, research, decisions, product requirements,
technical documentation, and historical decisions.

Do not load the entire knowledge base. Retrieve only relevant information.

Immediate project files and explicit user instructions take priority.

---

## 19. Agent Handoff

When another model may continue the task, update:

`ai/state/SESSION_STATE.md`

Use this structure:

```markdown
# FRNDLY — CURRENT SESSION STATE

## Current Phase
...

## Objective
...

## Completed
- ...

## Current Implementation
- ...

## Important Decisions
- ...

## Files Modified
- ...

## Files That Must Not Be Modified
- ...

## Remaining Work
- ...

## Verification
- ...

## Known Issues
- ...

## Next Recommended Action
...
```

Keep the state concise and actionable.

The next model MUST read this file before continuing.

---

## 20. Verification

Never claim completion without verification.

Check the task's acceptance criteria.

Where applicable, verify:

- Build
- Type checking
- Lint
- Runtime behavior
- API behavior
- Database behavior
- UI behavior
- Responsive behavior
- Console errors
- Existing functionality
- Relevant tests

Use:

`Requirement → Expected result → Actual result → PASS / FAIL`

If something was not tested, say so.

---

## 21. Task Completion

Before declaring a significant task complete:

1. Verify the implementation.
2. Update `ai/state/SESSION_STATE.md`.
3. Record important decisions.
4. Record changed files.
5. Record known issues.
6. Record remaining work, if any.

Never claim something works if it was not verified.

---

## 22. Final Response

When reporting completed work, provide:

1. What changed
2. Important files changed
3. Verification performed
4. Remaining issues

Keep the report concise and factual.

---

## 23. Absolute Rule

Never assume another AI model remembers previous work.

Never assume another AI model understands the project.

The next model must be able to continue using:

`AGENTS.md`
+
`RULES.md`
+
`CONTEXT.md`
+
`CURRENT_TASK.md` (if present)
+
`TASK.md`
+
`SESSION_STATE.md`
+
`existing code`

This is the shared AI context protocol for FRNDLY.
