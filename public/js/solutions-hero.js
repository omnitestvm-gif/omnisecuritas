(() => {
  const hero = document.querySelector('.solutions-strata');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const video = hero.querySelector('video');
  const media = hero.querySelector('.solutions-media');
  const toggle = hero.querySelector('.solutions-motion-toggle');
  let inView = true;
  let userPaused = false;
  let failed = false;
  let playbackVersion = 0;
  const entrances = [];

  // A common document timeline keeps all entrance offsets on the same clock.
  if (!reduced.matches) {
    const start = document.timeline.currentTime ?? 0;
    function enter(elements, keyframes, delay, duration = 720, stagger = 0) {
      [...elements].forEach((element, index) => {
        const animation = element.animate(keyframes, {
          duration,
          easing: 'cubic-bezier(.22,1,.36,1)',
          fill: 'both',
        });
        animation.startTime = start + delay + index * stagger;
        entrances.push(animation);
        // Release final transforms after the entrance so sticky-header rendering
        // and responsive styles return to their natural, unanimated state.
        animation.finished.then(() => animation.cancel()).catch(() => {});
      });
    }
    const rise = [
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ];
    enter(
      document.querySelectorAll('.header > .brand, .header nav > a, .header > .nav-cta'),
      rise,
      0,
      520,
      35,
    );
    enter(hero.querySelectorAll('.breadcrumbs, .eyebrow'), rise, 60, 650, 60);
    enter(
      hero.querySelectorAll('.solutions-title-mask > span'),
      [
        { opacity: 0, transform: 'translateY(110%)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      140,
      820,
      120,
    );
    enter(hero.querySelectorAll('.page-title > p'), rise, 340);
    enter(
      hero.querySelectorAll('.page-actions .button'),
      [
        { opacity: 0, transform: 'translateY(12px) scale(.985)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      420,
    );
    enter(
      hero.querySelectorAll('.page-actions .text-link, .solutions-principle'),
      rise,
      480,
      650,
      60,
    );
    enter(
      hero.querySelectorAll('.solutions-media, .solutions-art-kicker'),
      [{ opacity: 0 }, { opacity: 1 }],
      160,
      1100,
      0,
    );
    enter(hero.querySelectorAll('.solutions-glass-card'), rise, 580, 750, 120);
    enter(hero.querySelectorAll('.solutions-foundation > *'), rise, 650, 650, 70);
  }

  function updateControl() {
    toggle.hidden = reduced.matches || failed;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', userPaused ? 'Play 3D animation' : 'Pause 3D animation');
    toggle.querySelector('span').textContent = userPaused ? 'Play motion' : 'Pause motion';
  }
  const canPlay = () => !reduced.matches && !document.hidden && inView && !userPaused && !failed;
  async function syncPlayback() {
    const version = ++playbackVersion;
    updateControl();
    if (!canPlay()) {
      video.pause();
      if (reduced.matches) media.classList.remove('is-ready');
      return;
    }
    if (!video.getAttribute('src')) {
      video.muted = true;
      video.src = video.dataset.src;
      video.load();
    }
    try {
      await video.play();
      if (version !== playbackVersion) return;
      if (!canPlay()) {
        video.pause();
        return;
      }
      media.classList.add('is-ready');
    } catch (error) {
      if (version !== playbackVersion || error.name === 'AbortError') return;
      // A browser that blocks autoplay retains the still and offers manual play.
      userPaused = true;
      updateControl();
    }
  }
  video.addEventListener('error', () => {
    failed = true;
    video.pause();
    media.classList.remove('is-ready');
    updateControl();
  });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    syncPlayback();
  });
  reduced.onchange = () => {
    if (reduced.matches) entrances.forEach((animation) => animation.cancel());
    syncPlayback();
  };
  document.addEventListener('visibilitychange', syncPlayback);
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    },
    { threshold: 0 },
  );
  observer.observe(hero);
  syncPlayback();
})();
