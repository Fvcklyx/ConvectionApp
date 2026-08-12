# FRNDLY — CURRENT SESSION STATE

> Shared working memory for all AI models working through OpenCode/9Router.
>
> IMPORTANT:
> This file contains project state, decisions, progress, and handoff
> information. It must NOT contain hidden chain-of-thought.

---

## Current Phase

IDLE

Possible values:

- IDLE
- EXPLORATION
- PLANNING
- IMPLEMENTATION
- TESTING
- REVIEW
- BLOCKED
- COMPLETE

---

## Current Task

No active task.

Task file:

`None`

---

## Objective

No active objective.

---

## Completed

- AI shared-context system initialized.
- `AGENTS.md` defines the multi-model operating protocol.
- `RULES.md` is the authoritative project-rules file.
- `CONTEXT.md` is the project-context file.
- This file is the shared session/handoff state.

---

## Current Implementation

No active implementation.

---

## Important Decisions

### Shared Context

All AI models must reconstruct project state from project files rather than
assuming model-to-model memory.

The primary context chain is:

`AGENTS.md`
→ `RULES.md`
→ `CONTEXT.md`
→ `CURRENT_TASK.md`
→ task specification
→ `SESSION_STATE.md`
→ relevant source code

### Model Rotation

9Router may rotate/fallback between different models.

A model change must NOT cause valid work to be restarted or discarded.

---

## Files Modified

- None.

---

## Files That Must Not Be Modified

- None currently specified.

Add files here when a task explicitly protects them.

---

## Dependencies

None currently specified.

---

## Known Issues

None currently recorded.

---

## Remaining Work

- Create/activate a task in `CURRENT_TASK.md`.
- Keep this file updated whenever meaningful work is completed.

---

## Verification

Status: NOT STARTED

No active implementation requires verification.

---

## Next Recommended Action

When a task is assigned:

1. Read `RULES.md`.
2. Read `CONTEXT.md`.
3. Read `CURRENT_TASK.md`.
4. Read the active task specification.
5. Inspect the relevant code.
6. Update this file with the current objective and phase.
7. Implement and verify the task.
8. Update this file for the next agent.
