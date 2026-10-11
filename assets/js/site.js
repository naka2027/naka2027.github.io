(() => {
  'use strict';
  document.querySelectorAll('.site-header').forEach((header) => {
    const toggle = header.querySelector('.nav-toggle');
    const links = header.querySelector('.nav-links');
    if (!toggle || !links) return;
    const close = (restoreFocus = false) => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && links.classList.contains('open')) close(true);
    });
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) close();
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => close()));
    window.addEventListener('resize', () => { if (window.innerWidth > 720) close(); }, { passive: true });
  });

  const bar = document.querySelector('.reading-progress span');
  const post = document.querySelector('.post-body');
  if (bar && post) {
    const update = () => {
      const start = post.getBoundingClientRect().top + window.scrollY;
      const end = start + post.offsetHeight - window.innerHeight;
      const pct = end > start ? Math.max(0, Math.min(1, (window.scrollY - start) / (end - start))) : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    // Wide research tables stay scrollable on narrow screens, without squeezing text.
    const english = document.documentElement.lang === 'en';
    post.querySelectorAll('table').forEach((table) => {
      if (table.closest('.table-scroll')) return;
      const region = document.createElement('div');
      region.className = 'table-scroll';
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', english ? 'Scrollable research data table' : '可横向滚动的研究数据表格');
      region.tabIndex = 0;
      table.parentNode.insertBefore(region, table);
      region.appendChild(table);
    });
  }

  // Zero-dependency static client-side filtering: no tracking and no remote search provider.
  document.querySelectorAll('[data-filter-input]').forEach((input) => {
    const kind = input.dataset.filterInput;
    const items = Array.from(document.querySelectorAll(`[data-filter-item="${kind}"]`));
    const count = document.querySelector(`[data-filter-count="${kind}"]`);
    const empty = document.querySelector(`[data-filter-empty="${kind}"]`);
    const groups = kind === 'questions' ? Array.from(document.querySelectorAll('[data-question-group]')) : [];
    const english = document.documentElement.lang === 'en';
    const filter = () => {
      const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      items.forEach((item) => {
        const text = (item.dataset.searchText || '').toLocaleLowerCase();
        const visible = terms.every((term) => text.includes(term));
        item.hidden = !visible;
        if (visible) shown += 1;
      });
      groups.forEach((group) => { group.hidden = !group.querySelector('[data-filter-item]:not([hidden])'); });
      if (count) count.textContent = english ? `${shown} results` : `找到 ${shown} 条结果`;
      if (empty) empty.hidden = shown !== 0;
    };
    input.addEventListener('input', filter);
    filter();
  });
})();
