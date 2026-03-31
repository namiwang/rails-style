---
layout: home
---

<style>
  {% include assets/main.css %}
</style>

<span id="main-content"></span>

# A Curated Directory of Rails Tools & Libraries
{: .sr-only}

<p class="site-description">Side-by-side comparisons of Rails tools and libraries. <a href="https://github.com/namiwang/rails-style/issues" target="_blank" rel="noopener noreferrer">Contribute or report errors &nearr;</a></p>

<nav class="category-nav" aria-label="Categories">
  <a href="#ui-libraries">UI Libraries</a>
  <a href="#rendering">Rendering</a>
  <a href="#starters">Starter Kits</a>
  <!-- <a href="#admin">Admin</a> -->
  <!-- <a href="#ai">LLM / AI</a> -->
  <!-- <a href="#background-jobs">Background Jobs</a> -->
  <!-- <a href="#job-boards">Job Boards</a> -->
</nav>

<section class="category-section" id="ui-libraries" markdown="1">

## Rails UI Frameworks & Component Libraries

<p class="section-intro">Rails-specific component libraries and design systems for building production interfaces.</p>

{% include rails_ui.html %}

{% include further_reading.html category="ui-libraries" %}

</section>

<section class="category-section" id="rendering" markdown="1">

## Rails Rendering Solutions: ViewComponent, Phlex & More

<p class="section-intro">Move beyond ERB partials with component-based architectures for reusable, testable UI.</p>

{% include rendering.html %}

{% include further_reading.html category="rendering" %}

</section>

<section class="category-section" id="starters" markdown="1">

## Starter Kits & App Templates

<p class="section-intro">Pre-built Rails application templates and SaaS starters to launch faster.</p>

{% include starters.html %}

{% include further_reading.html category="starters" %}

</section>

{% comment %}
<section class="category-section" id="admin" markdown="1">

## Rails Admin Frameworks & Panels

<p class="section-intro">Admin panels and back-office tools for managing your Rails application data.</p>

{% include admin.html %}

{% include further_reading.html category="admin" %}

</section>

<section class="category-section" id="ai" markdown="1">

## LLM / AI Libraries for Ruby

<p class="section-intro">Ruby and Rails libraries for integrating large language models, embeddings, and AI agents.</p>

{% include ai.html %}

{% include further_reading.html category="ai" %}

</section>

<section class="category-section" id="background-jobs" markdown="1">

## Background Job Frameworks

<p class="section-intro">Job processing frameworks for queuing and running work asynchronously in Rails.</p>

{% include background_jobs.html %}

{% include further_reading.html category="background-jobs" %}

</section>

<section class="category-section" id="job-boards" markdown="1">

## Ruby & Rails Job Boards

<p class="section-intro">Places to find Ruby and Rails developer positions — or to hire Rails talent.</p>

{% include job_boards.html %}

{% include further_reading.html category="job-boards" %}

</section>
{% endcomment %}

<script>
(function() {
  var nav = document.querySelector('.category-nav');
  var links = nav.querySelectorAll('a[href^="#"]');
  var sections = [];
  links.forEach(function(link) {
    var s = document.querySelector(link.getAttribute('href'));
    if (s) sections.push({ el: s, link: link });
  });

  function update() {
    var offset = nav.offsetHeight + 16;
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.getBoundingClientRect().top <= offset) active = sections[i];
    }
    links.forEach(function(l) { l.classList.remove('active'); });
    if (active) active.link.classList.add('active');

    nav.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
</script>
