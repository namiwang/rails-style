---
layout: home
---

<style>
  {% include assets/main.css %}
</style>

<span id="main-content"></span>

<p class="site-description"><em>rails.style</em> is a curated resource hub for Rails developers. Compare UI frameworks, rendering solutions, and more — with honest data to help you choose.</p>

<nav class="category-nav" aria-label="Categories">
  <a href="#ui-libraries">UI Libraries</a>
  <a href="#rendering">Rendering</a>
</nav>

<section class="category-section" id="ui-libraries" markdown="1">

## Design Systems & UI Libraries

<p class="section-intro">Rails-specific component libraries and design systems for building production interfaces.</p>

{% include rails_ui.html %}

</section>

<section class="category-section" id="rendering" markdown="1">

## Rendering Solutions

<p class="section-intro">Move beyond ERB partials with component-based architectures for reusable, testable UI.</p>

{% include rendering.html %}

### Further Reading

<ul class="resource-list">
{% for post in site.data.posts %}
  <li>
    <a href="{{ post.url }}">{{ post.title | escape }}</a>
  </li>
{% endfor %}
</ul>

</section>
