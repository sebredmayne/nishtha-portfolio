// Scroll-reveal for the "sheet" elements (notebook pages / cards / badges) used on
// every folder page. Sheets are visible by default in plain CSS (no-JS safe); this
// only opts them into a hide+reveal sequence once it knows it can actually animate.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sheets = document.querySelectorAll('.sheet');
  if (!sheets.length) return;

  function withGsap(cb, fallback) {
    if (window.gsap && window.ScrollTrigger) return cb();
    var core = document.createElement('script');
    core.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    core.onload = function () {
      var st = document.createElement('script');
      st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      st.onload = cb;
      st.onerror = fallback;
      document.head.appendChild(st);
    };
    core.onerror = fallback;
    document.head.appendChild(core);
  }

  function revealWithIntersectionObserver() {
    sheets.forEach(function (el) { el.classList.add('pre-reveal'); });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sheets.forEach(function (el) { io.observe(el); });
  }

  withGsap(function () {
    gsap.registerPlugin(ScrollTrigger);
    // GSAP reads each sheet's own inline `transform: rotate(...)` on first tween
    // and keeps it while animating y/opacity, so the paper-scatter tilt survives.
    gsap.utils.toArray(sheets).forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 46 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );
    });
    // .folder-in's own CSS keyframe already handles the folder's entrance.
  }, revealWithIntersectionObserver);
})();
