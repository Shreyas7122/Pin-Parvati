(function () {
  var sections = document.querySelectorAll('.story-section');
  var links = document.querySelectorAll('.index-nav .index-dot');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  var linkByHref = {};
  links.forEach(function (link) {
    linkByHref[link.getAttribute('href')] = link;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = linkByHref['#' + entry.target.id];
        if (!link || !entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
