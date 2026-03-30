---
name: validate-project
description: Validate an existing project entry in `_data/*.yml` by re-fetching live data from GitHub, RubyGems, the official website, and ruby.libhunt.com. Reports any inaccurate, outdated, or missing fields. Use when the user wants to verify data accuracy or audit existing entries.
user-invocable: true
argument-hint: "[project key/name, category, or 'all']"
---

Validate one or more existing project entries in the site's `_data/*.yml` files by re-fetching live data from their sources and comparing it against what's stored locally.

## 1. Parse Input

Accept one of:

- A **project key or name** (e.g. `rubyui`, `Primer`) — validate that single entry
- A **category** (e.g. `rails_ui_tools`, `rendering_libs`) — validate all entries in that data file
- **`all`** — validate every entry across all data files

Map to the correct data file:

| Category | Data file |
|---|---|
| `rails_ui_tools` | `_data/rails_ui_tools.yml` |
| `rendering_libs` | `_data/rendering_libs.yml` |
| `form_builders` | `_data/form_builders.yml` |
| `icon_libs` | `_data/icon_libs.yml` |

## 2. Load Local Data

Read the target `_data/*.yml` file(s) and parse each entry. For `rails_ui_tools`, use the `key` field as the identifier; for other categories, use the `name` field.

If the specified project is not found, tell the user and list available entries.

## 3. Fetch Live Data

For each entry being validated, use `fetch_webpage` to gather fresh data from the same four sources used by the `fetch-project` skill. Use the entry's `links` fields to locate sources.

### 3.1 GitHub Repository

Use `links.github` if available. If not, try to find the repository by searching the project's homepage for a GitHub link.

Fetch the GitHub repository page. Extract:
- **Stars** — current stargazer count
- **Last commit date** — to re-evaluate `status`
- **License** — verify it hasn't changed
- **Archived status** — if the repo is archived, status should be `Maintenance` or `Paused`
- **Description** — compare with `name` for accuracy
- **Homepage URL** — compare with `links.home`

### 3.2 Official Website / Documentation

Fetch the URLs from `links.home`, `links.docs`, `links.pricing`, and `links.demo`.

Check for:
- **Links still live** — does each URL return a valid page? Flag any dead, redirected, or parked domain links as 🔴 Error
- **Component count** — recount from the docs/components page; compare with stored `components` value
- **Pricing changes** — compare current pricing with stored `pricing` field
- **Feature changes** — check if `figma`, `templates`, `icons`, `design_system`, or `form_builder` status has changed
- **Rendering approach** — verify the `rendering` field still matches
- **Styling approach** — verify the `styling` field still matches
- **Frontend JS** — verify the `frontend` field still matches
- **Discoverable links** — look for additional link types (github, docs, pricing, demo) not yet in the entry. If found, flag as 🟡 Stale (missing link that could be added).

### 3.3 RubyGems

Fetch `https://rubygems.org/gems/{gem-name}` to check:
- **Gem still exists** — compare with stored `gem` field
- **Latest version** — note if a new major version has been released
- **Last release date** — factor into `status` determination

### 3.4 Ruby LibHunt

Fetch `https://ruby.libhunt.com/{project-name}-alternatives` to check:
- **Still listed** — is the project still tracked?
- **Activity score** — factor into `status` determination

## 4. Compare & Detect Issues

For each field in the local entry, compare against the fetched data. Classify each discrepancy:

### Severity Levels

| Severity | Meaning | Examples |
|---|---|---|
| 🔴 **Error** | Data is factually wrong or a link is dead | Wrong rendering approach, wrong pricing tier, dead URL in `links.*` |
| 🟡 **Stale** | Data was correct but is now outdated | Component count changed significantly, status should change, new pricing, discoverable link missing from `links` |
| 🔵 **Info** | Minor or cosmetic, not urgent | Star count changed, new gem version, minor wording |

### Status Re-evaluation

Re-derive the `status` field using a two-step process:

#### Step 1: Check for official announcements

Look for explicit maintenance-mode or end-of-life declarations in:
- GitHub README banners or pinned notices
- Official blog posts or changelogs
- GitHub Discussions or issue announcements

If found, classify as `Maintenance` (or `Paused` if EOL) **regardless of recent commit activity**. Maintenance-mode projects may still have recent commits for security patches, dependency bumps, or critical bug fixes — these do not count as active development.

#### Step 2: Mechanical check (only if no official announcement found)

| Condition | Status |
|---|---|
| Latest public change within the last 3 months | `Active` |
| Last public change 3–12 months ago | `Maintenance` |
| Last public change 12+ months ago, or repo archived | `Paused` |
| Cannot determine (no public repo, closed-source) | `Unknown` |

Refer to `_data/STATUS.md` for the full criteria definition.

### Fields to Validate (rails_ui_tools)

| Field | Validation method |
|---|---|
| `links.home` | Fetch the URL — is it reachable and not redirected to an unrelated domain? |
| `links.github` | Fetch the URL — does the repo still exist? Is it archived? |
| `links.docs` | Fetch the URL — is it reachable? Does it still contain documentation? |
| `links.pricing` | Fetch the URL — is it reachable? Does pricing info match the `pricing` field? |
| `links.demo` | Fetch the URL — is it reachable? Does it still show a demo? |
| `links` (missing) | Scan the homepage for discoverable links (github, docs, pricing, demo) not yet in the entry |
| `components` | Recount from docs; flag if the stored count differs by more than 20%. **Count unique component types, not theme variants.** If a project offers the same component (e.g. Button, Card, Modal) restyled across multiple themes, count it once — do not inflate the number with per-theme duplicates. Marketing copy like "150+ components" may be inflated — always verify by deduplicating across themes. |
| `design_system` | Check if a design system has been added or removed |
| `templates` | Check current template offering |
| `figma` | Look for Figma links on the site |
| `icons` | Check if icon set has been added or removed |
| `gem` | Verify gem still exists on RubyGems |
| `rendering` | Check source code or docs for rendering approach |
| `form_builder` | Check if form components have been added or removed |
| `styling` | Verify CSS framework hasn't changed |
| `frontend` | Verify JS framework hasn't changed |
| `pricing` | Compare current pricing page with stored value |
| `status` | Re-derive from commit activity and gem releases |

### Fields to Validate (rendering_libs)

| Field | Validation method |
|---|---|
| `links.home` | Fetch the URL — is it reachable? |
| `links.github` | Fetch the URL — does the repo still exist? |
| `links.docs` | Fetch the URL — is it reachable? |
| `links` (missing) | Scan for discoverable links not yet in the entry |
| `encapsulation` | Verify from docs or source |
| `templating` | Verify approach hasn't changed |
| `output` | Check if supported output formats changed |
| `performance` | Note if new benchmarks are available |

## 5. Present Validation Report

Display a report for each validated project. Group findings by severity.

### Report Format

For a single project:

```
## Validation Report: {Project Name}

**Data file:** `_data/{file}.yml`
**Sources checked:** GitHub ✓ | Website ✓ | RubyGems ✓ | LibHunt ✗

### 🔴 Errors (must fix)
- `links.home`: https://old-url.com is dead (404)
- `pricing`: Local says "Free" → website now shows "$49+" (Freemium)

### 🟡 Stale (should update)
- `links` (missing): GitHub repo found at https://github.com/owner/repo — add `links.github`
- `components`: Local says "~30" → docs now show ~45 components
- `status`: Local says "Active" → last commit was 14 months ago (should be "Paused")

### 🔵 Info
- GitHub stars: 1,200 → 1,850

### ✅ Verified correct
- rendering: Phlex ✓
- styling: Tailwind CSS ✓
- gem: true ✓
- links.home: reachable ✓
- links.github: reachable ✓
```

For multiple projects, show a summary table first:

```
| Project | Errors | Stale | Info | Status |
|---------|--------|-------|------|--------|
| RubyUI  | 0      | 2     | 1    | 🟡     |
| Protos  | 1      | 0     | 0    | 🔴     |
| ZestUI  | 0      | 0     | 3    | ✅     |
```

Then individual reports for any project with Errors or Stale findings.

## 6. Offer Fixes

After presenting the report, ask the user:

> Would you like me to update the entries with the corrected data? I can fix all issues, or you can choose specific fields.

If the user confirms:

1. Read the target `_data/*.yml` file
2. Update only the fields that were flagged as 🔴 Error or 🟡 Stale
3. Preserve existing formatting (2-space indentation, field order, quoting style; 4-space indentation for `links` values)
4. Show a diff of the changes before writing

**Do not** auto-fix 🔵 Info items unless the user explicitly requests it.

## 7. Post-Validation

After fixes are applied, tell the user:

> Updated `_data/{file}.yml`. Run `bundle exec jekyll serve` to verify the changes render correctly.
