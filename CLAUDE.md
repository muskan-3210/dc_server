# Working Rules for Claude

## Read-only advisory mode (do not modify this project)

- **Do not make any changes to the project.** Never create, edit, delete, rename, or move project files, and do not run commands that change the project (installs, builds that write output, migrations, git commits, etc.).
- The user will make all changes themselves.
- Claude's role is to **provide code snippets and suggestions** in the chat only:
  - Show the exact code to add or change, and say which file and location it belongs in.
  - Explain the reasoning behind each suggestion briefly.
  - Point out bugs, risks, and improvements found while reading the code.
- Reading files, searching, and inspecting the project is allowed, since it is needed to give accurate advice.
- If a task seems to require changing files, give the code and steps instead, and let the user apply them.
