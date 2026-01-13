# Linear Sync

Obsidian plugin for bidirectional sync between Linear issues and Obsidian documents.

## Features

- **Issue → Document**: Fetch assigned Linear issues and add them as markdown sections
- **Document → Linear**: Push document content back to Linear issue descriptions

## Installation

1. Download the latest release
2. Extract to `.obsidian/plugins/linear-sync/`
3. Enable the plugin in Obsidian Settings → Community plugins

## Setup

1. Go to Settings → Linear Sync
2. Enter your [Linear API key](https://linear.app/settings/api)
3. Set the document path (e.g., `Linear/Tasks.md`)

## Usage

### Sync Issues to Document

Run command: **Linear Sync: Sync Issues to Document**

This fetches your assigned issues from Linear and prepends them to the document:

```markdown
# [ENG-123] Issue Title

# [ENG-124] Another Issue
```

### Sync Document to Linear

Run command: **Linear Sync: Sync Document to Linear**

Write content under each issue section, then sync to push it to Linear:

```markdown
# [ENG-123] Issue Title

My notes about this issue...
- Task 1
- Task 2
```

The content is wrapped in markers to preserve existing Linear descriptions:

```markdown
Original description in Linear

<!-- obsidian-sync-start -->
My notes about this issue...
- Task 1
- Task 2
<!-- obsidian-sync-end -->
```

## Development

```bash
npm install
npm run dev    # Development build
npm run build  # Production build
```

## License

MIT
