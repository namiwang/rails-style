---
layout: home
---

<style>
  {% include assets/main.css %}
</style>

_rails.style_ is a curated resource hub for Rails developers. It currently focuses on UI related libraries, and will expand to cover other topics (background jobs, administration, mailers, newsletters, etc.) in the future.

## UI & Design

<details open>
  <summary>
    <h3 style="display:inline-block">Rendering Solutions</h3>
  </summary>
  {% include ui/rendering.md %}
</details>

<details open>
  <summary>
    <h3 style="display:inline-block">Rails-specific Design Systems & UI Libraries</h3>
  </summary>
  {% include ui/ui.html %}
</details>

<details open>
  <summary>
    <h3 style="display:inline-block">Articles & Insights</h3>
  </summary>
  {% include ui/posts.html %}
</details>

## Admin Frameworks

{% include admin.html %}

<script defer src="/assets/main.js"></script>
<script defer src="https://unpkg.com/alpinejs-component@latest/dist/component.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

<!-- TODO comments panel performance (cache?) -->
<!-- TODO git activity sparkline -->
