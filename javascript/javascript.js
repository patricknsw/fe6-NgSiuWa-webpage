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

    // 影片真係出到畫面先切換，避免黑屏
    video.addEventListener('playing', () => {
      if (container.matches(':hover')) container.classList.add('is-playing');
    });

    container.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    container.addEventListener('mouseleave', () => {
      container.classList.remove('is-playing');
      video.pause();
      video.currentTime = 0;
    });
  });

  // ---------- Hero video playlist (double-buffer) + mobile pause ----------
  const vids = [document.getElementById('heroVideoA'), document.getElementById('heroVideoB')];
  if (vids[0] && vids[1]) {
    const playlist = [
      './videos/hero/法國巴黎.mp4',
      './videos/hero/日本_02.mp4',
      './videos/hero/埃及_02.mp4',
      './videos/hero/冰島_02.mp4',
    ];
    let front = 0;    // 而家顯示緊邊個 video
    let current = 0;  // 而家播緊 playlist 第幾條

    const preload = (v, i) => { v.src = playlist[i]; v.load(); };
    vids.forEach(v => { v.muted = true; v.playsInline = true; v.loop = false; });
    preload(vids[1], 1 % playlist.length); // 預載第二條

    const swap = () => {
      const prev = vids[front];
      const next = vids[1 - front];
      next.currentTime = 0;
      next.play().then(() => {
        next.classList.add('is-active');
        prev.classList.remove('is-active');
        front = 1 - front;
        current = (current + 1) % playlist.length;
        // 淡出完之後，喺背景預載再下一條
        setTimeout(() => {
          prev.pause();
          preload(prev, (current + 1) % playlist.length);
        }, 900);
      }).catch(() => {});
    };

    vids.forEach(v => v.addEventListener('ended', () => {
      if (v === vids[front]) swap();
    }));

    const mobileQuery = matchMedia('(max-width: 768px)');
    const handleScreenChange = e => {
      if (e.matches) vids[front].pause();
      else vids[front].play().catch(err => console.log('Autoplay prevented:', err));
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

  // ---------- 學一句當地話 ----------
  const pBox = document.getElementById('phraseBox');
  if (pBox) {
    const P = {
      kyoto: {lang:'ja-JP', list:[['おおきに','ookini','京都話嘅「多謝」'],['すみません','sumimasen','唔該／對唔住'],['おいしい','oishii','好食'],['トイレはどこですか','toire wa doko desu ka','洗手間喺邊度？']]},
      paris: {lang:'fr-FR', list:[['Bonjour','bon-zhoor','日安，入舖頭第一句要講'],['Merci','mer-si','多謝'],['L\'addition, s\'il vous plaît','la-di-syon sil voo pleh','唔該埋單'],['Où sont les toilettes ?','oo son lay twa-let','洗手間喺邊度？']]},
      iceland: {lang:'is-IS', list:[['Takk fyrir','tahk fi-rir','多謝'],['Skál!','skaul','乾杯！'],['Halló','hah-loh','你好'],['Þetta reddast','theh-ta red-ahst','船到橋頭自然直（冰島人口頭禪）']]},
      egypt: {lang:'ar-EG', list:[['شكراً (Shukran)','shuk-ran','多謝'],['يلا (Yalla)','yal-la','行啦！快啲！'],['بكام ده؟ (Bikam da?)','bi-kam da','呢個幾錢？（議價必備）'],['أهلاً وسهلاً (Ahlan wa sahlan)','ah-lan wa sah-lan','歡迎']]}
    };
    const key = Object.keys(P).find(k => document.body.classList.contains(k));
    if (key) {
      const {lang, list} = P[key];
      const t = document.getElementById('phraseText');
      const s = document.getElementById('phraseSub');
      const btn = document.getElementById('phraseBtn');
      const say = document.getElementById('phraseSay');
      let i = Math.floor(Math.random() * list.length);
      const show = () => { t.textContent = list[i][0]; s.textContent = list[i][1] + '｜' + list[i][2]; };
      show();
      btn.addEventListener('click', e => { e.preventDefault(); i = (i + 1) % list.length; show(); });
      if ('speechSynthesis' in window) {
        say.hidden = false;
        say.addEventListener('click', e => {
          e.preventDefault();
          const u = new SpeechSynthesisUtterance(list[i][0].replace(/\(.*\)/, ''));
          u.lang = lang;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        });
      }
    }
  }
});



