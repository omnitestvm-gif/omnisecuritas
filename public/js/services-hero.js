(() => {
  const hero = document.querySelector('.services-cinematic');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 900px) and (orientation: landscape)');
  const canvas = hero.querySelector('.services-stars');
  // The starfield is painted only on resize; all sky movement comes from the video.
  function paintStars() {
    const { width, height } = hero.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    let seed = 7123;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < Math.floor((width * height) / 6500); i++) {
      const x = random() * width;
      const y = random() * height;
      const radius = 0.35 + random() * 0.7;
      ctx.fillStyle = `rgba(229,234,242,${0.14 + random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const resize = new ResizeObserver(paintStars);
  resize.observe(hero);
  paintStars();

  const videos = [...hero.querySelectorAll('video')];
  let active = 0;
  let crossfading = false;
  let starting = false;
  let frame;
  let inView = true;
  let failed = false;
  const shouldPlay = () =>
    desktop.matches && !reduced.matches && !document.hidden && inView && !failed;

  function failVideo() {
    failed = true;
    cancelAnimationFrame(frame);
    videos.forEach((video) => video.pause());
    hero.classList.remove('has-horizon-video');
  }
  videos.forEach((video) => {
    video.muted = true;
    video.addEventListener('error', failVideo);
  });

  function renderVideo() {
    if (!shouldPlay()) {
      videos.forEach((video) => video.pause());
      if (reduced.matches || !desktop.matches) hero.classList.remove('has-horizon-video');
      return;
    }
    const current = videos[active];
    const next = videos[1 - active];
    const remaining = current.duration - current.currentTime;
    // Last second crossfades into the next forward-playing copy of the clip.
    if (
      Number.isFinite(remaining) &&
      remaining <= 1 &&
      !crossfading &&
      !starting &&
      next.readyState >= 2
    ) {
      starting = true;
      next.currentTime = 0;
      next
        .play()
        .then(() => {
          if (!shouldPlay()) {
            next.pause();
            starting = false;
            return;
          }
          crossfading = true;
          starting = false;
        })
        .catch(failVideo);
    }
    if (crossfading) {
      const progress = Math.min(1, Math.max(0, 1 - remaining));
      current.style.opacity = String(1 - progress);
      next.style.opacity = String(progress);
      if (progress >= 0.995 || current.ended) {
        current.pause();
        current.currentTime = 0;
        current.style.opacity = '0';
        next.style.opacity = '1';
        active = 1 - active;
        crossfading = false;
      }
    } else if (current.ended && !starting) {
      // Keep forward playback even if a slow connection delays the second copy.
      current.currentTime = 0;
      current.play().catch(failVideo);
    }
    frame = requestAnimationFrame(renderVideo);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame);
    if (!shouldPlay()) {
      videos.forEach((video) => video.pause());
      if (reduced.matches || !desktop.matches) hero.classList.remove('has-horizon-video');
      return;
    }
    videos.forEach((video) => {
      if (!video.getAttribute('src')) {
        video.src = 'assets/media/services-horizon.mp4';
        video.preload = 'auto';
        video.load();
      }
    });
    videos[active]
      .play()
      .then(() => {
        if (!shouldPlay()) {
          videos[active].pause();
          return;
        }
        videos[active].style.opacity = '1';
        hero.classList.add('has-horizon-video');
        if (crossfading) videos[1 - active].play().catch(failVideo);
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(renderVideo);
      })
      .catch(failVideo);
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    },
    { threshold: 0 },
  );
  observer.observe(hero);
  desktop.onchange = syncPlayback;
  reduced.onchange = syncPlayback;
  document.addEventListener('visibilitychange', syncPlayback);
  syncPlayback();

  if (window.gsap) {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });
      intro
        .from('.header', { y: -12, opacity: 0, duration: 0.45 }, 0)
        .from(hero.querySelector('.breadcrumbs'), { opacity: 0 }, 0.05)
        .from(hero.querySelector('.eyebrow'), { y: 10, opacity: 0 }, 0.08)
        .from(
          hero.querySelectorAll('.services-title-line'),
          { y: 35, opacity: 0, clipPath: 'inset(100% 0 0 0)', stagger: 0.1 },
          0.12,
        )
        .from(hero.querySelector('.page-title > p'), { y: 12, opacity: 0 }, 0.27)
        .from(hero.querySelector('.page-actions'), { y: 10, opacity: 0 }, 0.36)
        .from(hero.querySelector('.services-console'), { y: 55, opacity: 0, duration: 0.8 }, 0.4)
        .from(
          hero.querySelectorAll(
            '.services-console-sidebar, .services-console-topbar, .services-pathway, .services-focus',
          ),
          { y: 14, opacity: 0, stagger: 0.06, duration: 0.55 },
          0.58,
        );
    });
  }
})();
