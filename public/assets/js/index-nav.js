(function () {
  var sections = document.querySelectorAll('.story-section');
  var links = document.querySelectorAll('.index-nav a, .index-nav-mobile a');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  var linksByHref = {};
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    (linksByHref[href] = linksByHref[href] || []).push(link);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var matches = linksByHref['#' + entry.target.id];
        if (!matches || !entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        matches.forEach(function (l) {
          l.classList.add('is-active');
          if (l.closest('.index-nav-mobile')) {
            l.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
