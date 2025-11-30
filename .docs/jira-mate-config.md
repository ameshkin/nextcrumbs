# Jira-Mate Integration

This project uses **Jira-Mate** for syncing `.progress` files with Jira.

- Config file: `jira-mate.json` in the project root
- Schema: `./node_modules/@ameshkin/jira-mate/config/jira-mate.schema.json`
- Jira base URL: `https://pamcms.atlassian.net`
- Default issue type: `Task`
- Project key: `NXT`
- Progress mapping:
  - Root: `.progress`
  - Epics: `.progress/epics.json`
  - Stories: `.progress/stories/`
  - Bugs: `.progress/bugs.json`

## Commands

```bash
npm run jira:projects
```

This will show how Jira-Mate sees this project.
