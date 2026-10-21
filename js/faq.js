/* ==========================================================
   1to10X — FAQ behaviour
   GSAP (tweens) · ScrollTrigger (scroll-drawn "?", velocity marquee)
   · Flip (smooth re-layout when filtering) · custom text splitter
   ========================================================== */
(function () {
  const root = document.querySelector("#faq"); if (!root) return;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  if (hasG) { gsap.registerPlugin(ScrollTrigger); window.Flip && gsap.registerPlugin(Flip); }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const DATA = [
    ["general", "What exactly is 1to10X?", "1to10X is a Marcamor community where founders share how they took a business from one to ten times its size. You get a podcast, live webinars, in-person events and introductions to the people who can help you fund what comes next."],
    ["webinars", "Are the webinars free?", "There is always a free Community seat. Pro and VIP add Q&amp;A, replays, resources and the networking room — you can compare them on the <a href=\"webinars.html#tickets\">Webinars page</a>."],
    ["webinars", "How do I join a live session?", "Reserve a seat, and we email you the joining link plus a reminder before the session starts. Open it on any laptop or phone — no app to install."],
    ["webinars", "Will I get the replay?", "Pro and VIP seats include the recording and the slides. Free seats can watch live, and we share highlights with the community after each session."],
    ["podcast", "How can I be a podcast guest?", "Use the “Be a guest” form on the <a href=\"podcasts.html#guest\">Podcasts page</a>. Tell us your story and the lesson you would share — our team reads every pitch."],
    ["events", "Where are the in-person events?", "We are building community gatherings across Hyderabad, Chennai, Bengaluru, Gurugram and Mumbai. Dates are announced to the community first, so join the list to hear early."],
    ["payments", "Which payment methods do you accept?", "Razorpay covers UPI, cards, netbanking and wallets for India; Stripe covers international cards. Payments are handled by the gateway — 1to10X never sees your card details."],
    ["payments", "Can I get an invoice or a refund?", "Yes, we will help. Email <a href=\"mailto:info@marcamor.com\">info@marcamor.com</a> with your booking reference and we will sort out invoices or any change to your booking."],
    ["collab", "How can my brand collaborate with 1to10X?", "Pick a partnership package on the <a href=\"collab.html#packages\">Collab page</a> or send a custom enquiry. Partners get visibility across webinars, the podcast and community events."],
    ["collab", "Can I host or speak at a webinar?", "Absolutely. Send us your idea through the <a href=\"collab.html#enquiry\">collab enquiry form</a> — practical, first-hand founder stories are exactly what the community wants."],
    ["general", "How is my data used?", "Only to confirm your booking and send the updates you asked for. You can unsubscribe from any email, and we never sell your details."],
    ["general", "How do I reach the team?", "Tap “Talk to us” here, write to <a href=\"mailto:info@marcamor.com\">info@marcamor.com</a> or call <a href=\"tel:+919985202223\">+91 99852 02223</a>. We are in Hyderabad, India."]
  ];
  const CATS = [["all", "All"], ["general", "General"], ["webinars", "Webinars"], ["podcast", "Podcast"], ["events", "Events"], ["payments", "Payments"], ["collab", "Collab"]];

  /* ---------- build ---------- */
  const list = root.querySelector("#faq-list");
  list.innerHTML = DATA.map((d, i) => `
    <article class="faq-item" data-cat="${d[0]}" data-q="${(d[1] + " " + d[2]).replace(/<[^>]+>/g, "").toLowerCase()}">
      <button class="faq-head" aria-expanded="false" aria-controls="fa${i}" id="fq${i}">
        <span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${d[1]}</h3><span class="plus" aria-hidden="true"><i></i><i></i></span>
      </button>
      <div class="faq-body" id="fa${i}" role="region" aria-labelledby="fq${i}"><div class="faq-inner"><p>${d[2]}</p><span class="tag">${d[0]}</span></div></div>
    </article>`).join("") + `<div class="faq-empty"><b>No match for that.</b><p>Try a different word — or ask us directly.</p><button class="button-primary" data-open-contact>Talk to us <span aria-hidden="true">→</span></button></div>`;
  root.querySelector(".faq-chips").innerHTML = CATS.map((c, i) => `<button class="faq-chip ${i ? "" : "on"}" data-cat="${c[0]}">${c[1]}</button>`).join("");

  root.insertAdjacentHTML("afterbegin", '<div class="faq-orbs" aria-hidden="true"><i></i><i></i><i></i></div>');
  const kick = root.querySelector(".experience-kicker"); if (kick) kick.insertAdjacentHTML("afterend", `<span class="faq-count"><b>${DATA.length}</b> answers</span>`);
  [1, 6].forEach(i => list.children[i] && list.children[i].classList.add("hot"));
  const items = [...list.querySelectorAll(".faq-item")], empty = list.querySelector(".faq-empty");

  /* ---------- headline: split into words/chars, rise on scroll ---------- */
  const title = root.querySelector(".faq-title");
  if (title) {
    const walk = n => [...n.childNodes].map(c => c.nodeType === 3
      ? c.textContent.split(/(\s+)/).map(w => /^\s+$/.test(w) ? w : w ? `<span class="fw">${[...w].map(ch => `<span class="fc">${ch}</span>`).join("")}</span>` : "").join("")
      : `<${c.tagName.toLowerCase()}>${walk(c)}</${c.tagName.toLowerCase()}>`).join("");
    title.setAttribute("aria-label", title.textContent); title.innerHTML = walk(title);
    if (hasG && !reduce) gsap.from(title.querySelectorAll(".fc"), { yPercent: 115, rotate: 6, duration: 1.1, ease: "power4.out", stagger: .028, scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none reverse" } });
  }

  /* ---------- the giant “?” draws itself as you scroll ---------- */
  const qs = root.querySelector(".q-stroke"), dot = root.querySelector(".q-dot"), art = root.querySelector(".faq-art");
  if (hasG && qs && !reduce) {
    const L = qs.getTotalLength(); qs.style.strokeDasharray = L; qs.style.strokeDashoffset = L;
    gsap.to(qs, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root, start: "top 70%", end: "top 8%", scrub: .6 } });
    gsap.from(dot, { scale: 0, transformOrigin: "50% 50%", ease: "back.out(2)", scrollTrigger: { trigger: root, start: "top 12%", end: "top 2%", scrub: true } });
    gsap.to(root.querySelectorAll(".orbit-g"), { rotation: 360, transformOrigin: "200px 260px", duration: 26, ease: "none", repeat: -1, stagger: { each: -6 } });
    /* pointer tilt */
    const rx = gsap.quickTo(art.firstElementChild, "rotationY", { duration: .8, ease: "power3" }), ry = gsap.quickTo(art.firstElementChild, "rotationX", { duration: .8, ease: "power3" });
    root.addEventListener("pointermove", e => { const r = root.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - .5) * 26); ry(-((e.clientY - r.top) / r.height - .5) * 18); });
  } else if (qs) { qs.style.strokeDashoffset = 0; }

  /* ---------- accordion ---------- */
  let current = null;
  const toggle = (it, force) => {
    const open = force ?? !it.classList.contains("open"), body = it.querySelector(".faq-body"), head = it.querySelector(".faq-head");
    if (open && current && current !== it) toggle(current, false);
    it.classList.toggle("open", open); head.setAttribute("aria-expanded", open);
    current = open ? it : (current === it ? null : current);
    if (!hasG || reduce) { body.style.height = open ? "auto" : "0"; it.style.setProperty("--p", open ? 100 : 0); return; }
    gsap.killTweensOf([body, it]);
    gsap.to(body, { height: open ? "auto" : 0, duration: open ? .75 : .5, ease: open ? "power3.out" : "power3.inOut" });
    if (open) {
      gsap.fromTo(it, { "--p": 0 }, { "--p": 100, duration: 1.1, ease: "power2.out" });
      const p = body.querySelector("p");
      if (!p.dataset.split) { p.dataset.split = 1; (function w(n) { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.append(t); else { const sp = document.createElement("span"); sp.className = "aw"; sp.textContent = t; f.append(sp); } }); c.replaceWith(f); } else w(c); }); })(p); }
      gsap.fromTo(p.querySelectorAll(".aw"), { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .55, ease: "power2.out", stagger: .016, delay: .15 });
      gsap.from(body.querySelector(".tag"), { y: 20, opacity: 0, duration: .6, ease: "power3.out", delay: .35 });
      if (qs) { gsap.fromTo(dot, { y: 0 }, { y: -26, duration: .3, yoyo: true, repeat: 1, ease: "power2.out" }); gsap.fromTo(art, { scale: 1 }, { scale: 1.05, duration: .35, yoyo: true, repeat: 1, ease: "power2.inOut" }); }
    } else gsap.to(it, { "--p": 0, duration: .4 });
  };
  list.addEventListener("click", e => { const h = e.target.closest(".faq-head"); if (h) toggle(h.parentElement); });
  list.addEventListener("pointermove", e => { const it = e.target.closest(".faq-item"); if (!it) return; const r = it.getBoundingClientRect(); it.style.setProperty("--mx", e.clientX - r.left + "px"); it.style.setProperty("--my", e.clientY - r.top + "px"); });

  /* ---------- filter + search with Flip ---------- */
  let cat = "all", term = "";
  const apply = () => {
    const state = hasG && window.Flip && !reduce ? Flip.getState(items, { props: "opacity" }) : null;
    let n = 0;
    items.forEach(it => { const show = (cat === "all" || it.dataset.cat === cat) && (!term || it.dataset.q.includes(term)); it.style.display = show ? "" : "none"; if (show) n++; if (!show && it.classList.contains("open")) toggle(it, false); });
    empty.classList.toggle("on", !n);
    if (state) Flip.from(state, { duration: .7, ease: "power3.inOut", stagger: .035, absolute: false, onEnter: els => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: .05 }), onLeave: els => gsap.to(els, { opacity: 0, duration: .25 }) });
    window.ScrollTrigger && ScrollTrigger.refresh();
  };
  root.querySelector(".faq-chips").addEventListener("click", e => {
    const b = e.target.closest(".faq-chip"); if (!b) return;
    root.querySelectorAll(".faq-chip").forEach(x => x.classList.toggle("on", x === b)); cat = b.dataset.cat; apply();
  });
  const input = root.querySelector("#faq-search");
  let tm; input.addEventListener("input", () => { clearTimeout(tm); tm = setTimeout(() => { term = input.value.trim().toLowerCase(); apply(); }, 180); });
  addEventListener("keydown", e => { if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); window.__lenis && window.__lenis.scrollTo(root, { offset: -40 }); } });

  /* ---------- reveal list rows ---------- */
  if (hasG && !reduce) {
    gsap.from(items, { y: 60, opacity: 0, duration: .9, ease: "power3.out", stagger: .07, scrollTrigger: { trigger: list, start: "top 82%", toggleActions: "play none none reverse" } });
    gsap.from(root.querySelectorAll(".faq-search,.faq-chips,.faq-help"), { y: 34, opacity: 0, duration: .9, ease: "power3.out", stagger: .1, scrollTrigger: { trigger: title, start: "top 80%", toggleActions: "play none none reverse" } });

    /* Keep the marquee smooth; scrolling only gives it a subtle speed boost. */
    const rows = root.querySelectorAll(".faq-row");
    rows.forEach((row, i) => { row.innerHTML += row.innerHTML; });
    const tweens = [...rows].map((row, i) => gsap.fromTo(row, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 38, ease: "none", repeat: -1 }));
    const mq = root.querySelector(".faq-marquee");
    let vel = 0;
    ScrollTrigger.create({ trigger: mq, start: "top bottom", end: "bottom top", onUpdate: self => { vel = self.getVelocity(); } });
    gsap.ticker.add(() => {
      const target = 1 + Math.min(Math.abs(vel) / 1400, 0.8);
      tweens.forEach(tw => tw.timeScale(tw.timeScale() + (target - tw.timeScale()) * 0.08));
      vel *= 0.9;
    });
  }

  /* magnetic plus buttons */
  if (hasG && !reduce) {
    items.forEach(it => {
      const pl = it.querySelector(".plus"), head = it.querySelector(".faq-head");
      const mx = gsap.quickTo(pl, "x", { duration: .5, ease: "power3" }), my = gsap.quickTo(pl, "y", { duration: .5, ease: "power3" });
      head.addEventListener("pointermove", e => { const r = pl.getBoundingClientRect(); mx((e.clientX - (r.left + r.width / 2)) * .35); my((e.clientY - (r.top + r.height / 2)) * .35); });
      head.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
    gsap.to(root.querySelectorAll(".faq-orbs i"), { yPercent: i => [-30, 40, -20][i], ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 } });
  }
  /* keyboard: ↑ ↓ move between questions */
  list.addEventListener("keydown", e => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const vis = items.filter(i => i.style.display !== "none"), idx = vis.indexOf(document.activeElement.closest(".faq-item"));
    if (idx < 0) return; e.preventDefault();
    const nxt = vis[(idx + (e.key === "ArrowDown" ? 1 : -1) + vis.length) % vis.length]; nxt && nxt.querySelector(".faq-head").focus();
  });
  /* a page can open the FAQ on its own topic: <section id="faq" data-start="webinars"> */
  if (root.dataset.start) { const sb = root.querySelector('.faq-chip[data-cat="' + root.dataset.start + '"]'); sb && sb.click(); }
})();
