# Project Status Criteria

How we determine the `status` field for each project entry.

## Statuses

| Status | Condition |
|---|---|
| **Active** | Latest public change (commit or gem release) within the last 3 months |
| **Maintenance** | Last public change 3–12 months ago, **or** project has officially declared maintenance mode (even if commits are recent — security patches and dependency bumps don't count as active development) |
| **Paused** | Last public change 12+ months ago, or repository archived |
| **Unknown** | Cannot determine from public sources (e.g. closed-source product, no public repo) |

## Official announcements override mechanical checks

If a project explicitly announces "maintenance mode" (e.g. in a blog post, README banner, or GitHub discussion), it should be classified as **Maintenance** regardless of recent commit activity. Maintenance-mode commits are typically limited to:

- Security patches
- Dependency updates
- Critical bug fixes

These do not indicate active feature development.

## What counts as a "public change"

- A commit to the main branch on GitHub
- A new version released on RubyGems
- A new official blog post or changelog

Whichever is more recent is used.

## When to re-validate

Run the `validate-project` skill periodically to re-derive statuses from live data.
