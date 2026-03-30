---
name: fetch-project
description: Research a Rails-ecosystem project (UI library, rendering library, admin framework, etc.) by fetching data from GitHub, its official website, RubyGems, and ruby.libhunt.com, then append a structured YAML entry to the appropriate _data/*.yml file. Use when the user wants to add a new project to the site's comparison tables.
user-invocable: true
argument-hint: "[project name or URL]"
---

Research a Rails-ecosystem project across multiple sources and add it as a new entry to the appropriate `_data/*.yml` data file.

## 1. Parse Input

Accept a project name, URL (GitHub, website, or RubyGems), or a GitHub `owner/repo` path.

Determine the **target category** from the user's prompt or the project's nature:

| Category | Data file | When to use |
|---|---|---|
| `rails_ui_tools` | `_data/rails_ui_tools.yml` | UI component libraries, design systems, UI kits **(default)** |
| `rendering_libs` | `_data/rendering_libs.yml` | View rendering solutions (Phlex, ViewComponent, etc.) |
| `form_builders` | `_data/form_builders.yml` | Form builder libraries |
| `icon_libs` | `_data/icon_libs.yml` | Icon libraries |

If the category is ambiguous, ask the user before proceeding.

## 2. Check for Duplicates

Read the target `_data/*.yml` file. Check if the project already exists by matching the `key` field (for `rails_ui_tools`) or `name` field (for other categories). If it already exists, tell the user and stop — do not create duplicate entries.

## 3. Fetch Data from Sources

Use `fetch_webpage` to gather data from **four sources**. Fetch all available sources — some may not exist for every project.

### 3.1 GitHub Repository

Fetch the GitHub repository page to extract:
- **Description** — the repo's short description
- **Stars** — stargazer count
- **Language** — primary language (Ruby expected)
- **Last commit date** — to determine activity/status
- **License** — open source license type
- **Topics/tags** — often reveal rendering approach, styling, etc.
- **Homepage URL** — the "website" link shown in the repo sidebar (use this for `links.home` if it exists)

URL pattern: `https://github.com/{owner}/{repo}`

### 3.2 Official Website / Documentation

Fetch the project's official website or documentation site to extract:
- **Component count** — how many UI components are offered
- **Features** — design system, Figma integration, templates, icons, form builder
- **Rendering approach** — ERB, ViewComponent, Phlex, etc.
- **Styling approach** — Tailwind CSS, Bootstrap, Custom CSS, etc.
- **Frontend JS** — Stimulus, React, none, etc.
- **Pricing model** — Free, Freemium, Paid (with price if shown)

Also discover additional link targets:
- **Docs URL** — look for a "Docs", "Documentation", "Guide", or "API" link (only if it points to a different domain or path than the homepage)
- **Pricing URL** — look for a "Pricing", "Plans", or "Buy" link
- **Demo URL** — look for a "Demo", "Playground", "Preview", or "Try it" link

### 3.3 RubyGems

Fetch the RubyGems page to determine gem availability:

URL pattern: `https://rubygems.org/gems/{gem-name}`

Extract:
- **Gem exists** — true/false
- **Downloads** — total download count (useful context)
- **Latest version** — version number and release date

### 3.4 Ruby LibHunt

Fetch the ruby.libhunt.com page for additional context:

URL pattern: `https://ruby.libhunt.com/` — search for the project name, or try `https://ruby.libhunt.com/{project-name}-alternatives`

Extract:
- **Category** — how LibHunt categorizes the project
- **Popularity score** — relative popularity
- **Activity score** — how active the project is
- **Alternatives** — what similar projects exist (useful context)

## 4. Assemble YAML Entry

Map the fetched data to the correct schema based on the target category.

### Schema: `rails_ui_tools`

Fields must appear in this exact order to match existing entries:

```yaml
- key: {lowercase-alphanumeric-id}
  name: {Display Name}
  links:
    home: {official website URL — required unless GitHub-only project}
    github: {GitHub repository URL — omit if not on GitHub}
    docs: {documentation URL — omit if same as home}
    pricing: {pricing page URL — omit if free}
    demo: {live demo/playground URL — omit if none}
  components: "{approximate count, prefix with ~ if estimated}"
  design_system: {true|false}
  templates: {true|false|"description if partial"}
  figma: {true|false}
  icons: {true|false}
  gem: {true|false}
  rendering: {ERB|ViewComponent|Phlex|"ERB + helpers"|other}
  form_builder: {true|false}
  styling: {Custom|"Tailwind CSS"|Bootstrap|"Tailwind CSS, shadcn/ui"|other}
  frontend: "{Stimulus|React|""|other}"
  pricing: {Free|"Freemium ($XX+)"|"Paid ($XX+)"}
  status: {Active|Paused|Maintenance}
```

**Links map rules:**
- `links.home` — the primary URL visitors should see. Prefer the official website over GitHub. If the project is GitHub-only (no separate website), set `home` to the GitHub URL.
- `links.github` — always the GitHub repository URL (e.g. `https://github.com/owner/repo`). Omit if the project has no public GitHub repo.
- `links.docs` — only include if documentation lives at a different URL than `home`. Do not duplicate `home` here.
- `links.pricing` — only include for Freemium or Paid projects. Omit for Free projects.
- `links.demo` — only include if a live demo, playground, or preview page exists.
- Include at least `home`. Omit any link type that doesn't apply.

**Optional fields** — include only when applicable, placed directly after their parent field:
- `note:` — general note about the project (after `links`)
- `components_note:` — clarification on component count (after `components`)
- `gem_note:` — e.g. "unofficial", "private" (after `gem`)
- `rendering_note:` — e.g. "unofficial" (after `rendering`)
- `icons_name:` — name of the icon set (after `icons`)

**Field value guidelines:**

| Field | How to determine |
|---|---|
| `key` | Lowercase, no spaces/hyphens if possible. E.g. "rubyui", "csszero", "railsdesigner" |
| `links` | Discover all available link types during research. See links map rules above. |
| `components` | Count **unique component types** from docs/components page. Prefix with `~`. Quote the value: `"~30"`. If the same component (e.g. Button, Card) appears across multiple themes, count it once — do not inflate the number with per-theme variants. |
| `design_system` | `true` only if it offers a complete design system (tokens, guidelines, not just components) |
| `templates` | `true` if full page templates, `false` if none, `"few"` or description if partial |
| `figma` | `true` only if official Figma design kit is available |
| `icons` | `true` if ships with its own icon set |
| `gem` | `true` if installable via `gem install` or Bundler |
| `rendering` | The view layer technology used. Check the source code or docs |
| `form_builder` | `true` if provides form-specific components/helpers |
| `styling` | The CSS framework or approach. `"Custom"` if proprietary CSS |
| `frontend` | JavaScript framework used. `""` (empty string) if no JS framework |
| `pricing` | `"Free"` for open source. Include price: `"Paid ($99+)"`, `"Freemium ($XX+)"` |
| `status` | `"Active"` if committed in last 6 months. `"Maintenance"` if only bug fixes. `"Paused"` if stale |

### Schema: `rendering_libs`

```yaml
- name: {Display Name}
  links:
    home: {primary URL — official website or GitHub}
    github: {GitHub repository URL — omit if not on GitHub}
    docs: {documentation URL — omit if same as home}
  encapsulation: {Weak|Moderate|Strong}
  templating: {Template|"Ruby Class + Template"|"Pure Ruby"|other}
  output: {HTML|"HTML, JSON, XML"|other}
  performance: {1-9 benchmark score, omit if unknown}
```

**Links map rules for rendering_libs:**
- Same rules as `rails_ui_tools` above, but only `home`, `github`, and `docs` link types apply (no pricing/demo for rendering solutions).
- Entries without any links (e.g. ERB Partial) may omit the `links` field entirely.

### Schema: `form_builders` / `icon_libs`

These categories are still being defined. Use your best judgment to match the structure of existing entries in the file. If the file is empty, propose a reasonable schema based on the project's attributes and ask the user to confirm before writing.

## 5. Present for Review

Show the user the assembled YAML entry in a fenced code block. Clearly indicate:

- **Auto-determined fields** — values confidently extracted from sources
- **Uncertain fields** — values that were guessed or couldn't be verified (mark with `# ?` comment)
- **Missing fields** — values that couldn't be determined at all (ask the user)

Example:

```yaml
- key: superui
  name: SuperUI
  links:
    home: https://superui.dev/
    github: https://github.com/superui/super_ui
    docs: https://superui.dev/docs
    pricing: https://superui.dev/pricing
  components: "~35"
  design_system: false
  templates: false
  figma: false
  icons: false
  gem: true
  rendering: Phlex          # ? — inferred from dependencies, verify
  form_builder: false
  styling: Tailwind CSS
  frontend: Stimulus
  pricing: Free
  status: Active
```

Ask the user to confirm or correct before proceeding.

## 6. Write to Data File

After user confirmation:

1. Read the target `_data/*.yml` file
2. Append the new entry at the end of the file, preceded by a blank line
3. Maintain the same formatting as existing entries (2-space indentation, field order, quoting style)

**Formatting rules:**
- Use 2-space indentation for fields under the list item marker (`- key:` → `  name:`)
- Use 4-space indentation for link values under `links:` (`    home:`)
- Quote string values that contain special characters, commas, or start with `~`
- Boolean values are unquoted: `true`, `false`
- Empty strings are quoted: `""`
- Separate entries with a blank line

## 7. Post-Write

After writing, tell the user:

> Entry added to `_data/{file}.yml`. Run `bundle exec jekyll serve` to verify it renders correctly in the comparison table.
