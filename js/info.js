/* 1to10X — info cards: staggered entrance, 3D tilt and cursor spotlight (GSAP) */
(function () {
  var root = document.querySelector(".ic"); if (!root) return;
  var cards = [].slice.call(root.querySelectorAll(".ic-card")), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || reduce) return;
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(cards, { y: 70, opacity: 0, rotationX: -18, transformOrigin: "50% 100%", duration: 1.1, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: root, start: "top 72%", once: true } });
    gsap.from(root.querySelectorAll(".ic-head > *"), { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: .1, scrollTrigger: { trigger: root, start: "top 80%", once: true } });
  }
  if (!matchMedia("(hover:hover)").matches) return;
  cards.forEach(function (c) {
    var rx = gsap.quickTo(c, "rotationY", { duration: .6, ease: "power3" }), ry = gsap.quickTo(c, "rotationX", { duration: .6, ease: "power3" });
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", (x * 100) + "%"); c.style.setProperty("--my", (y * 100) + "%");
      rx((x - .5) * 14); ry(-(y - .5) * 12);
    });
    c.addEventListener("pointerleave", function () { rx(0); ry(0); });
  });
})();
