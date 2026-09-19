(function () {
  function openLightbox(src, alt) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    overlay.appendChild(img);

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function close() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('.gallery-item, .post-cover img');
    if (!target) return;
    e.preventDefault();

    var img = target.tagName === 'IMG' ? target : target.querySelector('img');
    if (!img) return;

    var src = target.tagName === 'A' ? target.getAttribute('href') : img.src;
    openLightbox(src, img.alt);
  });
})();
