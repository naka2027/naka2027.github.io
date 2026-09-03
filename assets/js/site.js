(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const bar = document.querySelector('.reading-progress span');
  const post = document.querySelector('.post-body');
  if (bar && post) {
    const update = () => {
      const start = post.offsetTop;
      const end = start + post.offsetHeight - window.innerHeight;
      const pct = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
})();
