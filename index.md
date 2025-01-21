---
layout: home
---

<style>
  {% include assets/main.css %}
</style>

_rails.style_ is a curated resource hub for Rails developers. It currently focuses on UI related libraires, and will expand to cover other topics (background jobs, administration) in the future.

## Rendering Solutions

Early Rails applications use ERB (or others like Haml) partials and bloated helpers. Modern Rails projects often emphasizes encapsulation and component-based design. There's a few libraries to create reusable and testable UI components.

|                                                            | Encapsulation | **Templating**        | **Output**          | **Performance**<sup>*</sup> |
| ---------------------------------------------------------- | ------------- | --------------------- | ------------------- | --------------------------- |
| ERB Partial                                                | Bad           | Template              | HTML                | 3                           |
| [ViewComponent](https://viewcomponent.org/)                | Not Bad       | Ruby Class + Template | HTML                | 6                           |
| [Phlex](https://www.phlex.fun/)                            | Not Bad       | Pure Ruby             | HTML (more planned) | 8                           |
| [Papercraft](https://github.com/digital-fabric/papercraft) | Not Bad       | Pure Ruby             | HTML, JSON, XML     | 9                           |
| [Cells](https://github.com/trailblazer/cells)              | Not Bad       | Ruby Class + Template | HTML                | 2                           |
| [Hanami::View](https://github.com/hanami/view)             | Not Bad       | Ruby Class + Template | HTML, JSON, XML     |                             |

\* performance data source: [view-layer-benchmarks](https://github.com/KonnorRogers/view-layer-benchmarks)

## Rails-specific Design Systems & UI Libraries

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
