(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const modal = document.getElementById('imageModal');
  const modalImg = modal?.querySelector('img');
  const modalCaption = modal?.querySelector('p');

  document.querySelectorAll('[data-modal-image]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modal || !modalImg || !modalCaption) return;
      modalImg.src = button.dataset.modalImage || '';
      modalImg.alt = button.dataset.modalAlt || '参考图片';
      modalCaption.textContent = button.dataset.modalAlt || '';
      if (typeof modal.showModal === 'function') modal.showModal();
    });
  });

  modal?.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
  modal?.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) modal.close();
  });

  // GitHub Pages is static, so the two counters use an anonymous public API.
  // A network failure only changes the two labels and never blocks the page.
  const namespace = 'xjtuselectionhanwentong2026';
  const todayEl = document.getElementById('todayViews');
  const totalEl = document.getElementById('totalViews');
  const chinaDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date()).replaceAll('-', '');

  const extractCount = (data) => {
    const candidates = [
      data?.count, data?.Count, data?.value, data?.Value,
      data?.data?.count, data?.data?.value
    ];
    const value = candidates.find((candidate) => Number.isFinite(Number(candidate)));
    return value == null ? null : Number(value);
  };

  const incrementCounter = async (name) => {
    const endpoint = `https://api.counterapi.dev/v1/${namespace}/${name}/up`;
    const response = await fetch(endpoint, { cache: 'no-store', mode: 'cors' });
    if (!response.ok) throw new Error(`Counter ${response.status}`);
    return extractCount(await response.json());
  };

  const formatCount = (value) => value == null
    ? '—'
    : new Intl.NumberFormat('zh-CN').format(value);

  (async () => {
    if (!todayEl || !totalEl) return;
    try {
      const [today, total] = await Promise.all([
        incrementCounter(`day${chinaDate}`),
        incrementCounter('total')
      ]);
      todayEl.textContent = formatCount(today);
      totalEl.textContent = formatCount(total);
    } catch (error) {
      console.warn('Visitor counter unavailable:', error);
      todayEl.textContent = '暂不可用';
      totalEl.textContent = '暂不可用';
      todayEl.style.fontSize = '15px';
      totalEl.style.fontSize = '15px';
    }
  })();
})();
