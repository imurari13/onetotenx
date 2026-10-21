/* ==========================================================
   1to10X — RECENT CONVERSATIONS (GSAP + ScrollTrigger)
   A pinned film-strip: vertical scroll drives the strip sideways.
   Each card scales/colours up as it reaches the centre, its big
   word drifts at a different speed (parallax), and a magnetic
   PLAY cursor follows the pointer. Click opens the video.

   TO ADD REAL VIDEOS: paste a YouTube link into `url` below.
   Cards with an empty url open a "coming soon" panel.
   ========================================================== */
(function () {
  var VIDEOS = [
    { title: "Behind the first big leap",       label: "Field notes",     word: "First move",   dur: "42 min", url: "" },
    { title: "Make room for the work",          label: "Creative work",   word: "Make room",    dur: "36 min", url: "" },
    { title: "What we learn together",          label: "People & ideas",  word: "Together",     dur: "51 min", url: "" },
    { title: "Finding your next chapter",       label: "Career & growth", word: "Next chapter", dur: "38 min", url: "" },
    { title: "The courage to begin again",      label: "Field notes",     word: "Begin again",  dur: "45 min", url: "" },
    { title: "Small habits, lasting change",    label: "Better work",     word: "Small shifts", dur: "33 min", url: "" },
    { title: "Making space for bold ideas",     label: "Creative work",   word: "Think bigger", dur: "40 min", url: "" },
    { title: "Lessons from the messy middle",   label: "Real stories",    word: "The middle",   dur: "47 min", url: "" },
    { title: "Building something that matters", label: "People & ideas",  word: "It matters",   dur: "39 min", url: "" },
    { title: "What happens when we connect",    label: "Community",       word: "Connect",      dur: "44 min", url: "" }
  ];
  var BG = [
    "radial-gradient(70% 60% at 20% 20%,#ff7a45,transparent 60%),radial-gradient(60% 60% at 90% 90%,#7a0f1c,transparent 60%),#2a0a0a",
    "radial-gradient(60% 60% at 80% 15%,#e51f31,transparent 60%),radial-gradient(70% 60% at 10% 90%,#3a1a6e,transparent 62%),#12091f",
    "radial-gradient(70% 60% at 50% 0%,#ee5125,transparent 62%),radial-gradient(60% 70% at 100% 100%,#00395c,transparent 60%),#06121c",
    "radial-gradient(60% 60% at 15% 85%,#ff9a3c,transparent 60%),radial-gradient(70% 60% at 85% 10%,#b3122a,transparent 60%),#1c0b06",
    "radial-gradient(70% 60% at 90% 50%,#ee5125,transparent 60%),radial-gradient(60% 60% at 0% 10%,#0b4a3f,transparent 62%),#07130f"
  ];

  var sec = document.getElementById("recent-videos");
  var track = document.getElementById("rv-track");
  if (!sec || !track) return;

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------- build cards ---------- */
  var bars = ""; for (var b = 0; b < 14; b++) bars += '<s style="--i:' + b + '"></s>';
  track.innerHTML = VIDEOS.map(function (v, i) {
    return '<button class="rv-card" type="button" data-i="' + i + '" aria-label="' + esc(v.title) + ', ' + esc(v.dur) + '">' +
      '<span class="rv-art" aria-hidden="true" style="--bg:' + BG[i % BG.length] + '"></span>' +
      '<span class="rv-n" aria-hidden="true">' + pad(i + 1) + '</span>' +
      '<span class="rv-tag">' + esc(v.label) + '</span>' +
      '<span class="rv-word" aria-hidden="true">' + esc(v.word) + '</span>' +
      '<span class="rv-wave" aria-hidden="true">' + bars + '</span>' +
      '<span class="rv-play" aria-hidden="true"></span>' +
      '<span class="rv-info"><small>' + esc(v.dur) + ' · 1to10X</small><h3>' + esc(v.title) + '</h3></span></button>';
  }).join("");
  var cards = [].slice.call(track.querySelectorAll(".rv-card"));
  var num = document.getElementById("rv-num"), bar = document.getElementById("rv-bar"), tot = document.getElementById("rv-total");
  if (tot) tot.textContent = "/ " + pad(VIDEOS.length);

  /* ---------- lightbox ---------- */
  var box = document.createElement("div");
  box.className = "rv-box"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Video player");
  box.innerHTML = '<div class="rv-box-in" id="rv-box-in"></div><button class="rv-x" type="button" aria-label="Close video">×</button>';
  document.body.appendChild(box);
  var boxIn = box.querySelector("#rv-box-in"), lastFocus = null;
  function ytId(u) {
    try {
      var x = new URL(u), h = x.hostname.replace(/^www\./, ""), id = "";
      if (h === "youtu.be") id = x.pathname.slice(1).split("/")[0];
      else if (/youtube(-nocookie)?\.com$/.test(h)) id = x.pathname === "/watch" ? (x.searchParams.get("v") || "") : (x.pathname.split("/").filter(Boolean)[1] || "");
      return /^[\w-]{11}$/.test(id) ? id : "";
    } catch (e) { return ""; }
  }
  function openBox(i) {
    var v = VIDEOS[i], id = v.url ? ytId(v.url) : "";
    lastFocus = document.activeElement;
    boxIn.innerHTML = id
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>'
      : '<div class="rv-box-demo"><span class="experience-kicker" style="justify-content:center">COMING SOON</span><h3>' + esc(v.title) + '</h3><p>This conversation is being edited. The video lands here soon.</p></div>';
    box.classList.add("on"); document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    if (window.gsap && !reduce) gsap.fromTo(boxIn, { scale: .92, opacity: 0, y: 24 }, { scale: 1, opacity: 1, y: 0, duration: .55, ease: "expo.out" });
    box.querySelector(".rv-x").focus();
  }
  function closeBox() {
    box.classList.remove("on"); boxIn.innerHTML = ""; document.documentElement.style.overflow = "";
    if (window.__lenis) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("rv-x")) closeBox(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("on")) closeBox(); });
  cards.forEach(function (c) { c.addEventListener("click", function () { openBox(+c.dataset.i); }); });

  if (!window.gsap || !window.ScrollTrigger) return;          /* plain swipe strip still works */
  gsap.registerPlugin(ScrollTrigger);

  /* heading: words rise out of a mask */
  var h2 = sec.querySelector(".rv-head h2");
  if (h2 && !reduce) {
    h2.innerHTML = h2.innerHTML.replace(/(<em>)([^<]+)(<\/em>)|([^<>\s]+)/g, function (m, a, b, c, d) {
      if (d) return '<span class="rv-w"><span>' + d + '</span></span>';
      return a + b.split(/\s+/).map(function (w) { return '<span class="rv-w"><span>' + w + '</span></span>'; }).join(" ") + c;
    });
    gsap.from(h2.querySelectorAll(".rv-w>span"), { yPercent: 115, rotate: 4, duration: 1.2, ease: "expo.out", stagger: .08, scrollTrigger: { trigger: sec, start: "top 70%", once: true } });
    gsap.from(sec.querySelectorAll(".rv-head p, .rv-meter, .experience-kicker"), { y: 24, opacity: 0, duration: 1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 65%", once: true } });
  }

  var mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (hover: hover)", function () {
    var pin = sec.querySelector(".rv-pin"), ghost = sec.querySelector(".rv-ghost");
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth + innerWidth * .05); };
    var setFocus = function () {
      var mid = innerWidth * .5, best = 0, bd = 1e9;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid), f = Math.max(0, 1 - d / (innerWidth * .42));
        c.style.setProperty("--f", f.toFixed(3));
        if (d < bd) { bd = d; best = i; }
      });
      cards.forEach(function (c, i) { c.classList.toggle("is-on", i === best); });
      if (num) num.textContent = pad(best + 1);
    };
    var strip = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top", end: function () { return "+=" + dist() * 1.1; },
        pin: true, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { if (bar) bar.style.transform = "scaleX(" + s.progress + ")"; }
      },
      onUpdate: setFocus                       /* runs on the smoothed position, so counter and cards agree */
    });
    /* parallax: each word slides against its card */
    cards.forEach(function (c) {
      var w = c.querySelector(".rv-word"), n = c.querySelector(".rv-n");
      gsap.fromTo(w, { x: 60 }, { x: -60, ease: "none", scrollTrigger: { trigger: c, containerAnimation: strip, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo(n, { x: -30 }, { x: 30, ease: "none", scrollTrigger: { trigger: c, containerAnimation: strip, start: "left right", end: "right left", scrub: true } });
    });
    if (ghost) gsap.to(ghost, { x: function () { return -(ghost.scrollWidth - innerWidth) * .9; }, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: function () { return "+=" + dist() * 1.1; }, scrub: true, invalidateOnRefresh: true } });
    setFocus();

    /* magnetic PLAY cursor + card tilt */
    var cur = document.getElementById("rv-cursor"), cleanup = [];
    if (cur) {
      var qx = gsap.quickTo(cur, "x", { duration: .35, ease: "power3" }), qy = gsap.quickTo(cur, "y", { duration: .35, ease: "power3" });
      cards.forEach(function (c) {
        var rx = gsap.quickTo(c, "rotationY", { duration: .6, ease: "power3" }), ry = gsap.quickTo(c, "rotationX", { duration: .6, ease: "power3" });
        var mv = function (e) { qx(e.clientX); qy(e.clientY); var r = c.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - .5) * 10); ry(-((e.clientY - r.top) / r.height - .5) * 8); };
        var en = function () { gsap.to(cur, { opacity: 1, scale: 1, duration: .4, ease: "back.out(2)" }); };
        var lv = function () { gsap.to(cur, { opacity: 0, scale: .3, duration: .3 }); rx(0); ry(0); };
        c.addEventListener("pointermove", mv); c.addEventListener("pointerenter", en); c.addEventListener("pointerleave", lv);
        cleanup.push(function () { c.removeEventListener("pointermove", mv); c.removeEventListener("pointerenter", en); c.removeEventListener("pointerleave", lv); gsap.set(c, { clearProps: "rotationX,rotationY" }); });
      });
    }
    return function () { cleanup.forEach(function (f) { f(); }); if (cur) gsap.set(cur, { opacity: 0 }); };
  });

  /* touch layout: native swipe — keep counter + progress in sync */
  mm.add("(max-width: 900px), (hover: none)", function () {
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      if (num) num.textContent = pad(Math.round(p * (VIDEOS.length - 1)) + 1);
    };
    track.addEventListener("scroll", sync, { passive: true }); sync();
    return function () { track.removeEventListener("scroll", sync); };
  });
  addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
