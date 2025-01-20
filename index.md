---
layout: home
---

<style>
  {% include assets/main.css %}
</style>

_rails.style_ is a curated list of design systems, UI components, and frontend frameworks for Ruby on Rails applications.

<!-- TODO desc -->

<!-- ## Rendering Solutions -->

## Rails-specific Design Systems & UI Frameworks

{% include rails_ui.html %}

## Posts and Discussions

<ul>
{% for post in site.data.posts %}
  <li>
    {% include link_preview.html url=post %}
  </li>
{% endfor %}
</ul>

<script defer src="/assets/main.js"></script>
<script defer src="https://unpkg.com/alpinejs-component@latest/dist/component.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

<!-- TODO comments panel performance (cache?) -->
<!-- TODO git activity sparkline -->
