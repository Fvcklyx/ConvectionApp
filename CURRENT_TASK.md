# FRNDLY — CURRENT TASK

> This file is the active-task pointer for all AI agents.
>
> Keep it short. The detailed task belongs in `docs/tasks/TASK-XXX.md`.

---

## Status

IDLE

Possible values:

- IDLE
- IN PROGRESS
- BLOCKED
- REVIEW
- COMPLETE

---

## Active Task

None

---

## Task File

None

Example:

`docs/tasks/TASK-001.md`

---

## Objective

No active task.

---

## Primary Agent

None

Example:

`MainDeveloper`

---

## Current Specialist

None

Examples:

- `Frontend`
- `Backend`
- `Researcher`
- `Visual`
- `QA`
- `Reviewer`

---

## Task Constraints

None currently specified.

---

## Important Instructions

Before starting an active task, every AI agent must read:

1. `AGENTS.md`
2. `RULES.md`
3. `CONTEXT.md`
4. This file
5. The referenced task file
6. `ai/state/SESSION_STATE.md`

---

## Handoff

When a model finishes or is rotated out:

1. Update `SESSION_STATE.md`.
2. Record completed work.
3. Record files modified.
4. Record important decisions.
5. Record known issues.
6. Record remaining work.
7. Record the next recommended action.

The next model must continue from that state instead of restarting.
