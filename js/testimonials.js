/* ==========================================================
   1to10X — TESTIMONIALS
   Scroll-driven 3D coverflow (GSAP + ScrollTrigger + Lenis):
   scroll down → cards glide through, the centre card lifts, tilts to
   your cursor and reveals its words one by one. Below: an infinite
   "wall of love" that speeds up with your scroll velocity.

   >>> The names, roles, companies and quotes below are SAMPLE
   >>> CONTENT for presentation — replace with real members.
   Avatars use pravatar.cc placeholders (initials show if offline).
   ========================================================== */
(function () {
  const root = document.querySelector("[data-tm]"); if (!root) return;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const A = n => `https://i.pravatar.cc/160?img=${n}`;
  const ALL = [
    { t: ["general", "webinars"], q: "I came for one webinar and left with a roadmap. Hearing founders share real numbers, not polished slides, changed how I run my own business.", n: "Aarav Mehta", r: "Founder, Lumio Labs", img: 12, chip: "Rewrote pricing in a week" },
    { t: ["general", "events"], q: "The room at the Hyderabad meetup was the best I have been in. Three intros that week turned into my first two enterprise customers.", n: "Sana Qureshi", r: "CEO, Kinara Foods", img: 47, chip: "2 enterprise customers" },
    { t: ["podcast", "general"], q: "Being a guest felt like a conversation, not an interview. People still message me about the 1 → 10X episode months later.", n: "Rohan Iyer", r: "Co-founder, Tessera", img: 33, chip: "Guest · Episode 04" },
    { t: ["webinars"], q: "The Pro replay is worth it alone — I rewatched the funding session twice and finally understood how to talk to investors.", n: "Meera Nair", r: "Founder, Petal & Co", img: 5, chip: "Closed a seed round" },
    { t: ["events", "general"], q: "No stage fright, no stiff networking. Just curious people who actually help each other. I met my co-founder at a 1to10X table.", n: "Kabir Shah", r: "Co-founder, Orbit Pay", img: 15, chip: "Found a co-founder" },
    { t: ["podcast"], q: "I listen on my commute. Every episode leaves me with one idea I can use that same day. That is rare.", n: "Isha Reddy", r: "Product lead, Fernwood", img: 25, chip: "Weekly listener" },
    { t: ["webinars", "events"], q: "As a sponsor, we expected logos and handshakes. We got real conversations with founders who became customers.", n: "Vikram Rao", r: "Partnerships, Stackwise", img: 52, chip: "Partner · Growth tier" },
    { t: ["general", "podcast", "webinars"], q: "1to10X made growth feel less lonely. Every session reminds me that someone has already solved the problem I am stuck on.", n: "Ananya Das", r: "Founder, Studio Marigold", img: 44, chip: "Member since day one" },
    { t: ["general", "events", "webinars"], q: "Practical, warm and a little bit addictive. I now block the community sessions in my calendar like board meetings.", n: "Dev Malhotra", r: "COO, Northbeam", img: 68, chip: "Never misses a session" }
  ];
  const tags = (root.dataset.tm || "general").split(",").map(s => s.trim());
  let list = ALL.filter(x => x.t.some(t => tags.includes(t)));
  if (list.length < 5) list = ALL;
  list = list.slice(0, 8);
  const N = list.length;
  const initials = n => n.split(" ").map(s => s[0]).join("");
  const star = '<svg viewBox="0 0 20 20"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7 4.9 17.5 6 11.8 1.7 7.8l5.8-.7z"/></svg>';

  /* ---------- markup ---------- */
  root.innerHTML = `
    <div class="tm-wrap" style="--n:${N}">
      <div class="tm-pin">
        <div class="tm-bg" aria-hidden="true"><i class="o1"></i><i class="o2"></i><span class="tm-quote-mark">“</span></div>
        <div class="tm-head">
          <span class="experience-kicker">VOICES FROM THE COMMUNITY</span>
          <h2 class="tm-title">Founders say it <em>better.</em></h2>
        </div>
        <div class="tm-stage" role="list">
          ${list.map((x, i) => `
          <article class="tm-card" role="listitem" data-i="${i}" aria-label="Testimonial from ${x.n}">
            <div class="tm-shine"></div>
            <div class="tm-stars" aria-label="5 out of 5 stars">${star.repeat(5)}</div>
            <blockquote class="tm-text">${x.q.split(" ").map(w => `<span class="tw">${w}</span>`).join(" ")}</blockquote>
            <span class="tm-chip">${x.chip}</span>
            <div class="tm-who">
              <span class="tm-av"><b>${initials(x.n)}</b><img src="${A(x.img)}" alt="" loading="lazy" onerror="this.remove()"></span>
              <span><strong>${x.n}</strong><small>${x.r}</small></span>
            </div>
          </article>`).join("")}
        </div>
        <div class="tm-nav">
          <button class="tm-arrow" data-dir="-1" aria-label="Previous testimonial">←</button>
          <div class="tm-prog"><span class="tm-count"><b>01</b> / ${String(N).padStart(2, "0")}</span><div class="tm-bar"><i></i></div></div>
          <button class="tm-arrow" data-dir="1" aria-label="Next testimonial">→</button>
        </div>
      </div>
    </div>
    <div class="tm-wall" aria-hidden="true">
      <div class="tm-row">${ALL.map(x => `<span class="tm-mini"><img src="${A(x.img)}" alt="" loading="lazy" onerror="this.remove()"><em>“${x.q.split(". ")[0].replace(/\.$/, "")}.”</em><b>${x.n}</b></span>`).join("")}</div>
      <div class="tm-row r2">${[...ALL].reverse().map(x => `<span class="tm-mini"><img src="${A(x.img)}" alt="" loading="lazy" onerror="this.remove()"><em>“${x.q.split(". ")[0].replace(/\.$/, "")}.”</em><b>${x.n}</b></span>`).join("")}</div>
    </div>`;

  const wrap = root.querySelector(".tm-wrap"), stage = root.querySelector(".tm-stage"), cards = [...root.querySelectorAll(".tm-card")];
  const count = root.querySelector(".tm-count b"), bar = root.querySelector(".tm-bar i"), pin = root.querySelector(".tm-pin");
  let spacing = 380, cur = 0, target = 0, active = -1;

  const measure = () => { const w = cards[0].offsetWidth; spacing = Math.min(w * 0.9, innerWidth * 0.7); };
  measure(); addEventListener("resize", measure);

  const place = pos => {                    // pos = fractional card index at the centre
    cards.forEach((c, i) => {
      const d = i - pos, a = Math.abs(d);
      gsap.set(c, {
        xPercent: -50, yPercent: -50,
        x: d * spacing * (a > 1 ? 1 - Math.min(a - 1, 3) * 0.06 : 1),
        z: -Math.min(a, 4) * 220, rotationY: Math.max(-1, Math.min(1, d)) * -32 * Math.min(a, 1.4),
        scale: 1 - Math.min(a, 3) * 0.09, opacity: Math.max(0, 1 - a * 0.42),
        filter: `blur(${Math.min(a * 2.4, 7).toFixed(2)}px) brightness(${(1 - Math.min(a * 0.22, .6)).toFixed(2)})`,
        zIndex: 100 - Math.round(a * 10)
      });
    });
  };
  const setActive = i => {
    if (i === active) return; active = i;
    cards.forEach((c, k) => c.classList.toggle("is-on", k === i));
    count.textContent = String(i + 1).padStart(2, "0");
    root.style.setProperty("--hue", i % 2 ? "var(--red)" : "var(--orange)");
    if (hasG && !reduce) gsap.fromTo(cards[i].querySelectorAll(".tw"), { opacity: .18, y: 8 }, { opacity: 1, y: 0, duration: .5, stagger: .018, ease: "power2.out", overwrite: true });
  };

  /* ---------- scroll → position ---------- */
  if (hasG && !reduce && innerWidth > 0) {
    gsap.registerPlugin(ScrollTrigger);
    wrap.style.height = (N * 62 + 100) + "svh"; root.classList.add("tm-pinned");
    ScrollTrigger.create({ trigger: wrap, start: "top top", end: "bottom bottom", onUpdate: s => { target = s.progress * (N - 1); } });
    gsap.ticker.add(() => {
      cur += (target - cur) * 0.085; place(cur);
      setActive(Math.max(0, Math.min(N - 1, Math.round(cur))));
      bar.style.transform = `scaleX(${(cur / (N - 1 || 1)).toFixed(4)})`;
    });
    /* intro */
    gsap.from(root.querySelector(".tm-head").children, { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: .12, scrollTrigger: { trigger: wrap, start: "top 75%", toggleActions: "play none none reverse" } });
    gsap.fromTo(root.querySelector(".tm-quote-mark"), { yPercent: 30, rotation: -8 }, { yPercent: -30, rotation: 8, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(root.querySelectorAll(".tm-bg i"), { yPercent: i => (i ? 40 : -40), ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 1 } });
    /* jump to a card (arrows / click) */
    const goTo = i => {
      i = Math.max(0, Math.min(N - 1, i));
      const top = wrap.getBoundingClientRect().top + scrollY, span = wrap.offsetHeight - innerHeight;
      const y = top + span * (i / (N - 1 || 1));
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.3 }) : scrollTo({ top: y, behavior: "smooth" });
    };
    root.querySelectorAll(".tm-arrow").forEach(b => b.onclick = () => goTo(Math.round(cur) + +b.dataset.dir));
    cards.forEach((c, i) => c.addEventListener("click", () => { if (i !== active) goTo(i); }));
    addEventListener("keydown", e => { const r = wrap.getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) { if (e.key === "ArrowRight") goTo(Math.round(cur) + 1); if (e.key === "ArrowLeft") goTo(Math.round(cur) - 1); } });
    /* 3D tilt + shine on the active card */
    stage.addEventListener("pointermove", e => {
      const c = cards[active]; if (!c) return; const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--sx", px * 100 + "%"); c.style.setProperty("--sy", py * 100 + "%");
      gsap.to(c, { rotationX: (py - .5) * -10, rotationY: (px - .5) * 12, duration: .5, ease: "power3.out", overwrite: "auto" });
    });
    stage.addEventListener("pointerleave", () => cards[active] && gsap.to(cards[active], { rotationX: 0, duration: .8, ease: "power3.out" }));
    place(0); setActive(0);

    /* wall of love: scroll-velocity marquee */
    const rows = root.querySelectorAll(".tm-row");
    rows.forEach(r => { r.innerHTML += r.innerHTML; });
    const tw = [...rows].map((r, i) => gsap.fromTo(r, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 60, ease: "none", repeat: -1 }));
    let vel = 0; ScrollTrigger.create({ trigger: root.querySelector(".tm-wall"), start: "top bottom", end: "bottom top", onUpdate: s => { vel = s.getVelocity(); } });
    gsap.ticker.add(() => { const t = 1 + Math.min(Math.abs(vel) / 300, 6); tw.forEach(x => x.timeScale(x.timeScale() + (t - x.timeScale()) * .08)); vel *= .9; });
    gsap.from(root.querySelector(".tm-wall"), { opacity: 0, y: 60, duration: 1, ease: "power3.out", scrollTrigger: { trigger: root.querySelector(".tm-wall"), start: "top 92%", toggleActions: "play none none reverse" } });
  } else {
    /* reduced motion / no GSAP: simple scroll-snap row */
    root.classList.add("tm-static"); cards.forEach(c => c.classList.add("is-on"));
  }
})();
