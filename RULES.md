# FRNDLY Engineering Rules

## Project
FRNDLY is a web-based management application for a garment/convection business.

## General Rules

1. Read existing code before modifying it.
2. Do not rewrite working modules unnecessarily.
3. Preserve the existing architecture unless there is a documented reason to change it.
4. Do not delete existing functionality without explicit approval.
5. Do not change business rules silently.
6. Do not perform destructive database changes without approval.
7. Prefer existing dependencies over introducing new ones.
8. Keep changes scoped to the current task.
9. Inspect related modules before making cross-cutting changes.
10. Run appropriate tests after making changes.
11. Explain important architectural changes.
12. Do not modify unrelated files.
13. Follow the existing naming conventions.
14. Prioritize maintainability over clever implementations.

## AI Workflow

Before implementation:

1. Understand the task.
2. Inspect relevant files.
3. Identify dependencies.
4. Create an implementation plan.
5. Implement the smallest appropriate change.
6. Run tests.
7. Review the result.
8. Report what changed.

## Important

When uncertain about business logic, ask for clarification instead of inventing requirements.