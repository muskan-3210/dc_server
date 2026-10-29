# Working Rules for Claude

## Default: read-only advisory mode (do not modify this project)

- **By default, do not make any changes to the project.** Never create, edit, delete, rename, or move project files, and do not run commands that change the project (installs, builds that write output, migrations, git commits, etc.).
- By default the user makes all changes themselves.
- Claude's role is to **provide code snippets and suggestions** in the chat only:
  - Show the exact code to add or change, and say which file and location it belongs in.
  - Explain the reasoning behind each suggestion briefly.
  - Point out bugs, risks, and improvements found while reading the code.
- Reading files, searching, and inspecting the project is allowed, since it is needed to give accurate advice.
- If a task seems to require changing files, give the code and steps instead, and let the user apply them.

## Exception: implementation mode (only when the user explicitly asks)

- When the user explicitly says to **implement it** or to **do it by yourself** (or clearly equivalent wording), switch to implementation mode for that task: make the code changes directly in the project files yourself, without asking the user to apply them.
- In implementation mode:
  - Edit or create the needed files, and run the commands the change requires (installs, generate, migrations), then verify the result where possible.
  - Keep changes limited to what the user asked for.
  - Afterwards, summarize which files were changed and what was done.
  - Still ask before destructive or hard-to-reverse actions (deleting data or files, dropping tables, git push, force operations).
- The permission applies only to the task the user asked for. Once it is done, return to the default read-only advisory mode until the user asks again.
