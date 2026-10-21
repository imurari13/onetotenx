/* ==========================================================
   1to10X — Upcoming sessions (filterable) + From the blog
   Content comes from window.ONE10X_CONFIG.sessions / .posts (js/config.js).
   ========================================================== */
(function () {
  "use strict";
  var C = window.ONE10X_CONFIG || {};
  /* if the WebGL module cannot load (e.g. opened from file://), never leave the headline hidden */
  setTimeout(function () { var h = document.getElementById("h0"); if (h) h.classList.remove("gl-pending"); }, 2500);
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------------- UPCOMING SESSIONS ---------------- */
  var board = document.getElementById("up-board"), tabs = document.getElementById("up-tabs");
  var sessions = Array.isArray(C.sessions) ? C.sessions.filter(function (s) { return s && s.title; }) : [];
  if (board && sessions.length) {
    board.innerHTML = sessions.map(function (s) {
      var tag = s.href ? "a" : "article", href = s.href ? ' href="' + esc(s.href) + '"' : "";
      return '<' + tag + ' class="up-row" data-t="' + esc(s.type) + '"' + href + '>' +
        '<span class="up-type" data-t="' + esc(s.type) + '">' + esc(s.type) + '</span>' +
        '<div class="up-info"><h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p><span class="up-when">' + (s.when ? esc(s.when) : "Date to be announced") + '</span></div>' +
        (s.href ? '<span class="up-go" aria-hidden="true">' + ARROW + '</span>' : '<span></span>') +
        '</' + tag + '>';
    }).join("");

    var types = ["All"].concat(sessions.map(function (s) { return s.type; }).filter(function (t, i, a) { return a.indexOf(t) === i; }));
    tabs.innerHTML = types.map(function (t, i) { return '<button type="button" data-f="' + esc(t) + '" aria-pressed="' + (i === 0) + '">' + esc(t) + '</button>'; }).join("");

    var live = document.getElementById("up-live");
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]"); if (!b) return;
      tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      var rows = Array.prototype.slice.call(board.children), f = b.dataset.f;
      var state = window.gsap && window.Flip && !reduce ? Flip.getState(rows) : null;
      var n = 0;
      rows.forEach(function (r) { var show = f === "All" || r.dataset.t === f; r.hidden = !show; if (show) n++; });
      if (state) Flip.from(state, { duration: .7, ease: "power3.out", stagger: .05, absolute: true, onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .06 }); } });
      if (live) live.textContent = n + (n === 1 ? " session shown" : " sessions shown");
    });

    /* one reveal when the board scrolls in */
    if (window.gsap && window.ScrollTrigger && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(board.children, { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: .1, clearProps: "transform,opacity", scrollTrigger: { trigger: board, start: "top 82%", once: true } });
    }
  } else if (board) {
    board.innerHTML = '<p class="up-empty">New sessions are being scheduled. Join the list below to hear first.</p>';
  }

  /* ---------------- FROM THE BLOG ---------------- */
  var host = document.getElementById("bl-grid");
  var posts = Array.isArray(C.posts) ? C.posts.filter(function (p) { return p && p.title; }) : [];
  if (host && posts.length) {
    var art = '<div class="bl-art" aria-hidden="true"><svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="blg" x1="0" x2="1"><stop offset="0" stop-color="#ee5125"/><stop offset="1" stop-color="#e51f31"/></linearGradient></defs>' +
      '<path d="M20 372 C 200 366, 340 340, 440 250 S 600 60, 628 24" fill="none" stroke="url(#blg)" stroke-width="2.5" stroke-linecap="round" id="bl-path"/>' +
      [0, .2, .4, .6, .8, 1].map(function (t, i) { return '<circle r="' + (3 + i * 1.6) + '" fill="#ee5125" opacity="' + (.3 + i * .14) + '" class="bl-dot" data-t="' + t + '"/>'; }).join("") +
      '</svg></div>';
    function meta(p) { return (p.date ? '<span>' + esc(p.date) + '</span>' : '') + (p.placeholder ? '<span class="sx-note" style="margin:0">Placeholder</span>' : ''); }
    function wrap(p, cls, inner) { return p.url ? '<a class="' + cls + '" href="' + esc(p.url) + '">' + inner + '</a>' : '<article class="' + cls + '">' + inner + '</article>'; }
    var lead = posts[0], rest = posts.slice(1);
    host.innerHTML =
      wrap(lead, "bl-lead", art + '<div class="bl-meta">' + meta(lead) + '</div><h3>' + esc(lead.title) + '</h3><p>' + esc(lead.excerpt) + '</p>' + (lead.url ? '' : '<span class="bl-soon">Coming soon</span>')) +
      '<div class="bl-side">' + rest.map(function (p) {
        return wrap(p, "bl-item", '<div class="bl-meta" style="margin:0">' + meta(p) + '</div><h3>' + esc(p.title) + '</h3><p>' + esc(p.excerpt) + '</p>' + (p.url ? '' : '<span class="bl-soon">Coming soon</span>'));
      }).join("") + '</div>';

    /* the lead artwork: dots ride the curve once, when it scrolls in */
    var path = document.getElementById("bl-path"), dots = host.querySelectorAll(".bl-dot");
    if (path && dots.length) {
      var L = path.getTotalLength();
      var place = function (k) { dots.forEach(function (d) { var t = Math.min(+d.dataset.t, k), pt = path.getPointAtLength(L * t); d.setAttribute("cx", pt.x); d.setAttribute("cy", pt.y); }); };
      place(1);
      if (window.gsap && window.ScrollTrigger && !reduce) {
        path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
        var o = { k: 0 }; place(0);
        gsap.to(o, { k: 1, duration: 2.2, ease: "power3.inOut", onUpdate: function () { place(o.k); path.style.strokeDashoffset = L * (1 - o.k); }, scrollTrigger: { trigger: host, start: "top 78%", once: true } });
      }
    }
  } else if (host) {
    host.innerHTML = '<p class="up-empty">Stories from the community are on the way.</p>';
  }
})();
