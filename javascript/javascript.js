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



/*

const t = document.getElementById('theme'),
      R = document.documentElement;

t.addEventListener('click', () => {
    const dark = R.dataset.theme
        ? R.dataset.theme === 'dark'
        : matchMedia('(prefers-color-scheme:dark)').matches;
    R.dataset.theme = dark ? 'light' : 'dark';
});



// Spots video - mouse hover video to play

document.querySelectorAll('.media-hover-container').forEach(container => {
  const video = container.querySelector('.hover-video');

  container.addEventListener('mouseenter', () => {
    video.play();
  });

  container.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // Resets video back to start
  });
});






// loop the playlist for main page

const playlist = [
      "./videos/hero/法國巴黎.mp4",
      "./videos/hero/日本_02.mp4",
      "./videos/hero/埃及_02.mp4",
      "./videos/hero/冰島_02.mp4",
    ];

    let currentTrack = 0;
    const videoElement = document.getElementById("heroVideo");

    // 2. Listen for the 'ended' event
    videoElement.addEventListener("ended", () => {
      // Advance to next index, modulo length loops back to 0
      currentTrack = (currentTrack + 1) % playlist.length;
      
      // Update source and start playing
      videoElement.src = playlist[currentTrack];
      videoElement.play();
    });



document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  // Needed for reliable autoplay
  video.muted = true;
  video.playsInline = true;

  const mobileQuery = window.matchMedia("(max-width: 768px)");

  function handleScreenChange(e) {
    if (e.matches) {
      // Mobile: pause
      video.pause();
    } else {
      // Desktop: play
      video.play().catch(function (error) {
        console.log("Autoplay prevented:", error);
      });
    }
  }

  // Run once on load, then only when crossing the breakpoint
  handleScreenChange(mobileQuery);
  mobileQuery.addEventListener("change", handleScreenChange);
});





const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
onScroll();                                   // 重新整理時如果已經捲動，都會即時生效
window.addEventListener('scroll', onScroll, { passive: true });


*/