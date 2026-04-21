(function() {
  const root = document.documentElement;

  // Persist theme across pages
  const savedTheme = localStorage.getItem('hv-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  const savedMotion = localStorage.getItem('hv-motion') === 'reduced';
  if (savedMotion) root.setAttribute('data-reduced-motion', 'true');

  // Nav scrolled state
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // IntersectionObserver for reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        if (e.target.dataset.count) animateCount(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-line, .fade-up, [data-count]').forEach(el => io.observe(el));

  // Number count-up
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const reduce = root.getAttribute('data-reduced-motion') === 'true';
    if (reduce) { el.textContent = target + suffix; return; }
    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (target < 10 ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Parallax phones
  const parallaxEls = document.querySelectorAll('.parallax-phone');
  function onParallax() {
    if (root.getAttribute('data-reduced-motion') === 'true') return;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / vh;
      const translate = Math.max(-60, Math.min(60, -progress * 80));
      el.style.transform = 'translate3d(0, ' + translate + 'px, 0)';
    });
  }
  window.addEventListener('scroll', onParallax, { passive: true });
  window.addEventListener('resize', onParallax);
  onParallax();

  // FAQ toggles
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('open'));
  });

  // Email form
  const form = document.querySelector('.email-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.parentElement.querySelector('.email-success');
      if (msg) msg.classList.add('on');
      form.querySelector('input').value = '';
    });
  }
})();
