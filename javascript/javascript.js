document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ---------- Theme toggle (persisted) ----------
  const themeBtn = document.getElementById('theme');
  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.dataset.theme = saved;
  } catch {}

  themeBtn?.addEventListener('click', () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  });

  // ---------- Hover-to-play videos ----------
  document.querySelectorAll('.media-hover-container').forEach(container => {
    const video = container.querySelector('.hover-video');
    if (!video) return;

    container.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    container.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ---------- Hero video playlist + mobile pause ----------
  const hero = document.getElementById('heroVideo');
  if (hero) {
    const playlist = [
      './videos/hero/法國巴黎.mp4',
      './videos/hero/日本_02.mp4',
      './videos/hero/埃及_02.mp4',
      './videos/hero/冰島_02.mp4',
    ];
    let current = 0;

    hero.muted = true;
    hero.playsInline = true;
    hero.loop = false; // 'ended' won't fire if loop is on

    hero.addEventListener('ended', () => {
      current = (current + 1) % playlist.length;
      hero.src = playlist[current];
      hero.play().catch(() => {});
    });

    const mobileQuery = matchMedia('(max-width: 768px)');
    const handleScreenChange = e => {
      if (e.matches) hero.pause();
      else hero.play().catch(err => console.log('Autoplay prevented:', err));
    };
    handleScreenChange(mobileQuery);
    mobileQuery.addEventListener('change', handleScreenChange);
  }

  // ---------- Header shadow on scroll ----------
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    onScroll(); // applies immediately if the page reloads already scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});



