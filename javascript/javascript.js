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



//video play delay

// document.addEventListener('DOMContentLoaded', () => {
//   const video = document.getElementById('heroVideo');
  
//   // Set speed 
//   video.playbackRate = 0.6;
// });



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


// resize listener so the video automatically plays 
// when returning to desktop view and pauses when scaling down

 document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("heroVideo");
  const mobileBreakpoint = 768; // Adjust to match your CSS breakpoint

  function checkScreenSize() {
    if (window.innerWidth <= mobileBreakpoint) {
      // Mobile screen: pause video
      if (!video.paused) {
        video.pause();
      }
    } else {
      // Desktop screen: play video
      if (video.paused) {
        video.play().catch(function (error) {
          // Handles browser autoplay policy restrictions if any
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }

  // Check on initial page load
  checkScreenSize();

  // Check whenever screen is resized
  window.addEventListener("resize", checkScreenSize);
});