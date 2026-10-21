/* ==========================================================
   1to10X — MOTION LAYER
   Lenis smooth scroll + GSAP ScrollTrigger, shared by all pages.
   ========================================================== */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.4, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  root.classList.add("js-motion");

  const goTo = (target, offset = 0) => {
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) });
    else (typeof target === "number" ? window.scrollTo({ top: target }) : target.scrollIntoView());
  };
  window.__goTo = goTo;

  /* in-page anchors glide instead of jump (incl. “page.html#id” pointing at this page) */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank") return;
    const u = new URL(a.href, location.href);
    if (!u.hash || u.hash === "#" || u.pathname !== location.pathname) return;
    const el = document.querySelector(u.hash);
    if (!el) return;
    e.preventDefault();
    goTo(el, -(parseInt(getComputedStyle(root).getPropertyValue("--header-h")) || 84) + 2);
    history.replaceState(null, "", u.hash);
  });
  if (location.hash && document.querySelector(location.hash)) {
    addEventListener("load", () => setTimeout(() => goTo(document.querySelector(location.hash), -80), 250));
  }

  /* ---------- progress bar ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

  /* ---------- header: hide on scroll down, show on scroll up ---------- */
  const header = document.querySelector(".site-header, body > header");
  if (header) {
    let last = 0;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: self => {
        const y = self.scroll(), d = y - last;
        if (Math.abs(d) < 4) return;
        const menuOpen = document.querySelector("#menu.on");
        header.classList.toggle("header-hidden", d > 0 && y > 240 && !menuOpen);
        last = y;
      }
    });
  }
  /* current-page pill */
  document.querySelectorAll(".nl a").forEach(a => {
    const href = a.getAttribute("href") || "";
    const file = location.pathname.split("/").pop() || "index.html";
    if (href === file && !href.includes("#")) a.classList.add("is-current");
  });

  if (reduce) { root.classList.remove("js-motion"); return; }

  /* ---------- hero scene: copy glides away as the camera moves ---------- */
  document.querySelectorAll(".scene-hero").forEach(hero => {
    const copy = hero.querySelector(".scene-copy");
    const bits = hero.querySelectorAll(".scene-label, .scene-hint, .scene-cue");
    /* intro */
    if (copy) {
      gsap.from(copy.children, { y: 46, opacity: 0, duration: 1.2, ease: "power4.out", stagger: 0.11, delay: 0.25 });
      gsap.to(copy, {
        yPercent: -14, opacity: 0, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "38% top", scrub: true }
      });
    }
    gsap.to(bits, { opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "20% top", scrub: true } });
  });

  /* ---------- reveal on scroll (headings, cards, forms, bands) ---------- */
  const seen = new Set();
  const group = (sel, vars = {}) => {
    document.querySelectorAll(sel).forEach(parent => {
      const kids = [...parent.children].filter(k => !seen.has(k));
      if (!kids.length) return;
      kids.forEach(k => seen.add(k));
      gsap.from(kids, Object.assign({
        y: 56, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: parent, start: "top 82%", toggleActions: "play none none reverse" }
      }, vars));
    });
  };
  group(".section-heading, .section-intro, .join-copy");
  group(".episode-grid, .principle-grid, .course-grid, .path-grid", { y: 90, stagger: 0.16, duration: 1.2 });
  group(".about-wrap > .page-copy");
  document.querySelectorAll(".feature-band, .join-form, .about-cube-stage").forEach(el => {
    if (seen.has(el)) return;
    gsap.from(el, { y: 80, opacity: 0, scale: 0.97, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
  });

  /* section → section: headings stay crisp, panels breathe in/out */
  document.querySelectorAll(".content-section, .course-preview").forEach(sec => {
    gsap.fromTo(sec, { "--sec": 0 }, { "--sec": 1, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "top 40%", scrub: true } });
  });

  /* footer slides up into view */
  const foot = document.querySelector(".experience-footer, .ft");
  if (foot) gsap.from(foot, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: foot, start: "top 98%", toggleActions: "play none none reverse" } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
