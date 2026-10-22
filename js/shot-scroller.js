// Makes every .shot-scroller actually feel scrollable with a plain mouse:
// - click-and-drag to pan it horizontally
// - vertical wheel/trackpad scroll while hovering it moves it horizontally too
(function () {
  var scrollers = document.querySelectorAll('.shot-scroller');

  scrollers.forEach(function (el) {
    el.style.cursor = 'grab';

    // wheel: a plain mouse wheel only ever sends deltaY, so redirect vertical
    // scroll into horizontal movement while the pointer is over the strip.
    el.addEventListener(
      'wheel',
      function (e) {
        var delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta === 0) return;
        e.preventDefault();
        el.scrollLeft += delta;
      },
      { passive: false }
    );

    // drag-to-scroll with mouse/pointer
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    el.addEventListener('pointerdown', function (e) {
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.setPointerCapture(e.pointerId);
      // stop the browser's native "drag this image out" gesture from
      // hijacking the pointer instead of our own scroll-drag
      e.preventDefault();
    });

    el.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = 'grab';
      if (moved) {
        // swallow the click that follows a drag so links inside the strip
        // (e.g. a figure that happens to wrap an <a>) don't fire by accident
        var suppress = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          el.removeEventListener('click', suppress, true);
        };
        el.addEventListener('click', suppress, true);
      }
    }

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('pointerleave', function () {
      isDown = false;
      el.style.cursor = 'grab';
    });
  });
})();
