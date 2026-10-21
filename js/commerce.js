/* ==========================================================
   1to10X — COMMERCE: forms + checkout (Razorpay / Stripe)
   • window.openCheckout({kind, planId})  → ticket / pass / partnership flow
   • window.openPay(i)                    → legacy home-page hook (webinar plans)
   • any <form data-form="subscribe|guest|contact|collab-enquiry"> is auto-wired
   100% static: forms go to your inbox via a form service, payments via Razorpay/Stripe hosted checkout. Settings: js/config.js. If nothing is configured
   (static hosting) everything falls back to DEMO mode so the UI is testable.
   ========================================================== */
(function () {
  const CAT = window.ONE10X_CATALOG;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = n => "₹" + Number(n).toLocaleString("en-IN");
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const CFG = Object.assign({ forms: { provider: "none" }, razorpayKeyId: "", paymentLinks: {} }, window.ONE10X_CONFIG || {});
  const FP = CFG.forms || {};
  const formsLive = () => (FP.provider === "web3forms" && FP.accessKey) || (FP.provider === "formspree" && FP.endpoint) || (FP.provider === "formsubmit" && FP.email);

  /* ---------- send any form to your inbox through a static form service (no server needed) ---------- */
  async function sendForm(type, data) {
    const id = data.reference || ref();
    if (data.website_url) return { id };                       // honeypot: bots fill the hidden field
    const body = { ...data, form_type: type, reference: id, page: location.href };
    delete body.consent; delete body.website_url;
    if (!formsLive()) { await sleep(700); return { id, demo: true }; }
    let r, j = {};
    const subject = `1to10X · ${type} · ${id}`;
    if (FP.provider === "web3forms") {
      r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ access_key: FP.accessKey, subject, from_name: "1to10X website", ...body }) });
      j = await r.json().catch(() => ({})); if (!r.ok || j.success === false) throw new Error(j.message || "Could not send. Please try again.");
    } else if (FP.provider === "formspree") {
      r = await fetch(FP.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: subject, ...body }) });
      if (!r.ok) throw new Error("Could not send. Please try again.");
    } else {
      r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(FP.email), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: subject, _template: "table", ...body }) });
      j = await r.json().catch(() => ({})); if (!r.ok || j.success === "false") throw new Error(j.message || "Could not send. Please try again.");
    }
    return { id };
  }
  const linkFor = gw => { const l = (CFG.paymentLinks || {})[S.kind + ":" + S.planId]; return l && l[gw]; };
  const gateways = () => ["razorpay", "stripe"].filter(g => (g === "razorpay" && (CFG.razorpayKeyId || linkFor("razorpay"))) || (g === "stripe" && linkFor("stripe")));
  const ref = () => "1X-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const loadScript = src => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load payment script")); document.head.appendChild(s);
  });

  /* ==========================================================
     Inline forms  (subscribe / guest / contact / collab-enquiry)
     ========================================================== */
  function wireForms() {
    document.querySelectorAll("form[data-form]").forEach(form => {
      if (form.dataset.wired) return; form.dataset.wired = "1";
      form.noValidate = true;
      const type = form.dataset.form;
      form.insertAdjacentHTML("beforeend", '<input name="website_url" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0">');
      const note = form.querySelector(".form-note") || Object.assign(document.createElement("p"), { className: "form-note" });
      if (!note.parentNode) form.appendChild(note);
      const btn = form.querySelector("button[type=submit], button:not([type])") || form.querySelector("button");
      if (btn) { btn.type = "submit"; btn.disabled = false; btn.dataset.label = btn.dataset.label || btn.textContent.trim().replace(/^Sign-up opening soon$/, "Subscribe"); btn.textContent = btn.dataset.label; }
      form.addEventListener("submit", async e => {
        e.preventDefault();
        form.querySelectorAll(".fld-err").forEach(x => x.classList.remove("fld-err"));
        const data = Object.fromEntries(new FormData(form).entries());
        const bad = [...form.querySelectorAll("[required]")].filter(el => (el.type === "checkbox" ? !el.checked : !String(el.value).trim()) || (el.type === "email" && !EMAIL.test(el.value.trim())));
        if (bad.length) {
          bad.forEach(el => el.closest("label,.fld,div")?.classList.add("fld-err") || el.classList.add("fld-err"));
          note.className = "form-note is-error"; note.textContent = "Please complete the highlighted fields."; bad[0].focus(); return;
        }
        btn && (btn.disabled = true, btn.textContent = "Sending…");
        note.className = "form-note"; note.textContent = "";
        try {
          const res = await sendForm(type, data);
          form.classList.add("is-done");
          form.insertAdjacentHTML("beforeend", `<div class="form-success" role="status"><i>✓</i><b>${esc(form.dataset.success || "Thanks — you're on the list.")}</b><span>Reference ${esc(res.id)}${res.demo ? " · demo mode" : ""}</span></div>`);
          if (window.gsap) gsap.from(form.querySelector(".form-success"), { y: 24, opacity: 0, duration: .7, ease: "power3.out" });
        } catch (err) {
          note.className = "form-note is-error"; note.textContent = err.message || "Something went wrong. Please try again.";
          btn && (btn.disabled = false, btn.textContent = btn.dataset.label);
        }
      });
    });
  }

  /* ==========================================================
     Checkout modal
     ========================================================== */
  let modal, S;
  function build() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "co"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `<div class="co-back"></div><div class="co-card" tabindex="-1">
      <button class="co-x" aria-label="Close">×</button>
      <div class="co-head"><span class="co-kicker"></span><h3 class="co-title"></h3><ol class="co-steps"></ol></div>
      <div class="co-body"></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector(".co-back").onclick = close;
    modal.querySelector(".co-x").onclick = close;
    addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("on")) close(); });
  }
  function close() {
    modal.classList.remove("on"); modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("co-lock"); window.__lenis && window.__lenis.start();
    S && S.opener && S.opener.focus && S.opener.focus();
  }
  function open() {
    modal.classList.add("on"); modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("co-lock"); window.__lenis && window.__lenis.stop();
    setTimeout(() => modal.querySelector(".co-card").focus(), 30);
  }

  const plan = () => CAT.kinds[S.kind].plans.find(p => p.id === S.planId);
  const total = () => plan().price * (S.qty || 1);

  function steps() {
    const free = plan().price === 0 && !plan().custom;
    const names = free ? ["Plan", "Details", "Done"] : plan().custom ? ["Plan", "Details", "Done"] : ["Plan", "Details", "Pay", "Done"];
    const idx = { plan: 0, details: 1, pay: 2, done: names.length - 1 }[S.step];
    modal.querySelector(".co-steps").innerHTML = names.map((n, i) => `<li class="${i < idx ? "is-done" : i === idx ? "is-now" : ""}"><b>${i + 1}</b>${n}</li>`).join("");
  }
  function frame(html) {
    const body = modal.querySelector(".co-body");
    body.innerHTML = html;
    if (window.gsap) gsap.from(body.children, { y: 18, opacity: 0, duration: .5, stagger: .05, ease: "power3.out" });
    steps();
  }

  function viewPlan() {
    S.step = "plan";
    const k = CAT.kinds[S.kind];
    modal.querySelector(".co-kicker").textContent = "1to10X · " + k.title;
    modal.querySelector(".co-title").textContent = k.blurb;
    frame(`<div class="co-plans">${k.plans.map(p => `
      <button type="button" class="co-plan ${p.id === S.planId ? "on" : ""}" data-id="${p.id}">
        <span class="co-tag">${esc(p.tag)}</span>
        <strong>${esc(p.name)}</strong>
        <em>${p.custom ? "Let’s talk" : p.price === 0 ? "Free" : inr(p.price)}</em>
        <ul>${p.perks.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </button>`).join("")}</div>
      <div class="co-actions"><button class="co-btn" data-next>Continue →</button></div>`);
    modal.querySelectorAll(".co-plan").forEach(b => b.onclick = () => { S.planId = b.dataset.id; modal.querySelectorAll(".co-plan").forEach(x => x.classList.toggle("on", x === b)); });
    modal.querySelector("[data-next]").onclick = viewDetails;
  }

  function field(name, label, type = "text", req = false, ph = "", extra = "") {
    return `<label class="fld"><span>${label}${req ? " *" : ""}</span><input name="${name}" type="${type}" ${req ? "required" : ""} placeholder="${esc(ph)}" value="${esc(S.data[name] ?? "")}" ${extra}></label>`;
  }
  function viewDetails() {
    S.step = "details";
    const f = CAT.kinds[S.kind].fields, p = plan();
    modal.querySelector(".co-title").textContent = `${p.name} · ${p.custom ? "Custom quote" : p.price === 0 ? "Free" : inr(p.price)}`;
    frame(`<form class="co-form" novalidate>
      <div class="co-grid">
        ${field("name", "Full name", "text", true, "Your name", 'autocomplete="name"')}
        ${field("email", "Email", "email", true, "you@company.com", 'autocomplete="email"')}
        ${field("phone", "Phone / WhatsApp", "tel", true, "+91 …", 'autocomplete="tel" inputmode="tel"')}
        ${f.includes("company") ? field("company", "Company" + (S.kind === "collab" ? "" : " (optional)"), "text", S.kind === "collab", "Company or startup", 'autocomplete="organization"') : ""}
        ${f.includes("role") ? field("role", "Your role", "text", false, "Founder, Marketing lead…") : ""}
        ${f.includes("website") ? field("website", "Website", "url", false, "https://") : ""}
        ${f.includes("city") ? `<label class="fld"><span>City *</span><select name="city" required>${CAT.cities.map(c => `<option ${S.data.city === c ? "selected" : ""}>${c}</option>`).join("")}</select></label>` : ""}
        ${f.includes("qty") ? `<label class="fld"><span>Tickets</span><div class="co-qty"><button type="button" data-q="-1">−</button><output>${S.qty}</output><button type="button" data-q="1">+</button></div></label>` : ""}
      </div>
      ${f.includes("message") ? `<label class="fld"><span>What would you like to achieve?</span><textarea name="message" rows="3" placeholder="Tell us about your goals">${esc(S.data.message || "")}</textarea></label>` : ""}
      <label class="co-check"><input type="checkbox" name="consent" required> <span>I agree to be contacted about this booking and accept the terms.</span></label>
      <p class="form-note"></p>
      <div class="co-actions"><button type="button" class="co-ghost" data-back>← Back</button><button class="co-btn" type="submit">${p.price === 0 && !p.custom ? "Reserve my seat" : p.custom ? "Request a quote" : "Continue to payment →"}</button></div>
    </form>`);
    const form = modal.querySelector("form");
    form.querySelectorAll("[data-q]").forEach(b => b.onclick = () => { S.qty = Math.max(1, Math.min(10, S.qty + +b.dataset.q)); form.querySelector("output").textContent = S.qty; });
    modal.querySelector("[data-back]").onclick = () => { save(form); viewPlan(); };
    form.onsubmit = e => {
      e.preventDefault(); save(form);
      const note = form.querySelector(".form-note"); form.querySelectorAll(".fld-err").forEach(x => x.classList.remove("fld-err"));
      const bad = [...form.querySelectorAll("[required]")].filter(el => (el.type === "checkbox" ? !el.checked : !String(el.value).trim()) || (el.type === "email" && !EMAIL.test(el.value.trim())));
      if (bad.length) { bad.forEach(el => (el.closest(".fld, .co-check") || el).classList.add("fld-err")); note.className = "form-note is-error"; note.textContent = "Please fix the highlighted fields."; bad[0].focus(); return; }
      if (p.price === 0 || p.custom) submitNoPay(note, form); else viewPay();
    };
  }
  function save(form) { S.data = { ...S.data, ...Object.fromEntries(new FormData(form).entries()) }; }

  async function submitNoPay(note, form) {
    const btn = form.querySelector(".co-btn"); btn.disabled = true; btn.textContent = "Submitting…";
    try {
      const res = await sendForm(S.planId && plan().custom ? "quote-request" : "registration", payload());
      viewDone(res);
    } catch (e) { note.className = "form-note is-error"; note.textContent = e.message; btn.disabled = false; btn.textContent = "Try again"; }
  }
  const payload = (extra = {}) => ({ kind: S.kind, planId: S.planId, qty: S.qty, ...S.data, page: location.pathname, ...extra });

  async function viewPay() {
    S.step = "pay";
    const p = plan(), t = total(), gws = gateways();
    modal.querySelector(".co-title").textContent = "Secure checkout";
    if (!gws.includes(S.gw)) S.gw = gws[0] || "razorpay";
    const shown = gws.length ? gws : ["razorpay", "stripe"];
    const meta = { razorpay: ["Razorpay", "UPI · Cards · Netbanking · Wallets"], stripe: ["Stripe", "International cards · Apple/Google Pay"] };
    frame(`<div class="co-sum"><div><span>${esc(CAT.kinds[S.kind].title)} · ${esc(p.name)}</span><small>${S.qty} × ${inr(p.price)}</small></div><strong>${inr(t)}</strong></div>
      <div class="co-gws">${shown.map(g => `<button type="button" class="co-gw ${S.gw === g ? "on" : ""}" data-gw="${g}"><b>${meta[g][0]}</b><small>${meta[g][1]}</small></button>`).join("")}</div>
      ${gws.length ? "" : `<p class="co-demo">Demo mode — add your Razorpay key (or payment links) in <code>js/config.js</code> to take real payments. No money moves right now.</p>`}
      <p class="form-note"></p>
      <div class="co-actions"><button type="button" class="co-ghost" data-back>← Back</button><button class="co-btn" data-pay>Pay ${inr(t)}</button></div>
      <p class="co-secure">🔒 Payments are processed by the gateway. 1to10X never sees your card details.</p>`);
    modal.querySelectorAll(".co-gw").forEach(b => b.onclick = () => { S.gw = b.dataset.gw; modal.querySelectorAll(".co-gw").forEach(x => x.classList.toggle("on", x === b)); });
    modal.querySelector("[data-back]").onclick = viewDetails;
    modal.querySelector("[data-pay]").onclick = pay;
  }

  async function pay() {
    const btn = modal.querySelector("[data-pay]"), note = modal.querySelector(".form-note");
    const reset = msg => { btn.disabled = false; btn.textContent = "Pay " + inr(total()); if (msg) { note.className = "form-note is-error"; note.textContent = msg; } };
    btn.disabled = true; btn.textContent = "Starting secure payment…"; note.textContent = "";
    const reference = ref(), gw = S.gw, link = linkFor(gw), live = gateways().includes(gw);
    try {
      if (!live) { await sleep(1400); return viewDone({ id: reference, demo: true, amount: total() }); }   // DEMO
      /* 1) tell you about the booking before the money step (best-effort) */
      sendForm("booking-started", payload({ reference, gateway: gw, amount: total(), status: "payment started" })).catch(() => {});
      /* 2a) hosted payment link (Razorpay Payment Link / Stripe Payment Link): fixed price, tamper-proof */
      if (link) {
        sessionStorage.setItem("1x_pending", JSON.stringify({ ref: reference, email: S.data.email, kind: S.kind, planId: S.planId, qty: S.qty }));
        const u = new URL(link); if (gw === "stripe") { u.searchParams.set("prefilled_email", S.data.email); u.searchParams.set("client_reference_id", reference); }
        location.href = u.toString(); return;
      }
      /* 2b) Razorpay Checkout straight from the browser (needs only your PUBLIC key id) */
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const rzp = new Razorpay({
        key: CFG.razorpayKeyId, amount: total() * 100, currency: CAT.currency,
        name: "1to10X", description: `${CAT.kinds[S.kind].title} · ${plan().name} × ${S.qty}`,
        image: "../Assests/1to10X-Logo.png", notes: { reference, kind: S.kind, plan: S.planId, qty: String(S.qty) },
        prefill: { name: S.data.name, email: S.data.email, contact: S.data.phone }, theme: { color: "#ee5125" },
        modal: { ondismiss: () => reset() },
        handler: resp => { sendForm("booking-paid", payload({ reference, gateway: "razorpay", amount: total(), paymentId: resp.razorpay_payment_id, status: "paid" })).catch(() => {}); viewDone({ id: resp.razorpay_payment_id || reference, amount: total() }); }
      });
      rzp.on("payment.failed", r => reset((r.error && r.error.description) || "Payment failed. Try another method."));
      rzp.open();
    } catch (e) { reset(e.message || "Something went wrong."); }
  }

  function viewDone(res) {
    S.step = "done"; const p = plan(), paid = total();
    modal.querySelector(".co-title").textContent = p.custom ? "Request received" : "You're in.";
    frame(`<div class="co-done"><div class="co-tick"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-17"/></svg></div>
      <h4>${p.custom ? "We’ll send your custom quote within 1 working day." : "Booking confirmed" + (paid ? " · " + inr(paid) : "")}</h4>
      <p>A confirmation has been sent to <b>${esc(S.data.email)}</b>.</p>
      <div class="co-ref"><span>Reference</span><b>${esc(res.id)}</b>${res.demo ? "<i>DEMO</i>" : ""}</div>
      <div class="co-actions"><button class="co-btn" data-close>Done</button></div></div>`);
    modal.querySelector("[data-close]").onclick = close;
    if (window.gsap) {
      const path = modal.querySelector(".co-tick path"), circ = modal.querySelector(".co-tick circle");
      [circ, path].forEach(el => { const L = el.getTotalLength(); gsap.fromTo(el, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: .9, ease: "power2.out", delay: .1 }); });
      burst(modal.querySelector(".co-tick"));
    }
  }
  function burst(el) {
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 26; i++) {
      const d = document.createElement("i"); d.className = "co-conf";
      d.style.cssText = `left:${cx}px;top:${cy}px;background:${i % 3 ? "#ee5125" : i % 2 ? "#e51f31" : "#f6f5f4"}`;
      document.body.appendChild(d);
      const a = Math.random() * Math.PI * 2, v = 90 + Math.random() * 170;
      gsap.to(d, { x: Math.cos(a) * v, y: Math.sin(a) * v + 60, rotation: Math.random() * 540, opacity: 0, duration: 1.2 + Math.random() * .6, ease: "power2.out", onComplete: () => d.remove() });
    }
  }

  /* ---------- public API ---------- */
  window.openCheckout = function (opts = {}) {
    build();
    const kind = CAT.kinds[opts.kind] ? opts.kind : "webinar";
    S = { kind, planId: opts.planId || CAT.kinds[kind].plans[1].id, qty: 1, data: {}, step: "plan", opener: document.activeElement };
    open();
    opts.planId ? viewDetails() : viewPlan();
  };
  /* legacy hook used by the original home page buttons: openPay(planIndex) */
  window.openPay = function (i) { window.openCheckout({ kind: "webinar", planId: CAT.kinds.webinar.plans[i] ? CAT.kinds.webinar.plans[i].id : "pro" }); };
  window.openForm = function (type) { build(); /* contact modal */
    S = { kind: "webinar", planId: "free", qty: 1, data: {}, step: "plan", opener: document.activeElement };
    modal.querySelector(".co-kicker").textContent = "1to10X · Talk to us"; modal.querySelector(".co-title").textContent = "How can we help?";
    open(); frame(`<form class="co-form" data-form="contact" data-success="Thanks — we’ll reply within one working day.">
      <div class="co-grid">${field("name", "Your name", "text", true)}${field("email", "Email", "email", true)}</div>
      <label class="fld"><span>Message *</span><textarea name="message" rows="4" required placeholder="Ask us anything"></textarea></label>
      <p class="form-note"></p><div class="co-actions"><button class="co-btn" type="submit">Send message</button></div></form>`);
    wireForms();
  };

  /* data-checkout="webinar:pro" buttons anywhere */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-checkout]"); if (!b) return;
    e.preventDefault(); const [kind, planId] = b.dataset.checkout.split(":"); window.openCheckout({ kind, planId });
  });
  document.addEventListener("click", e => { if (e.target.closest("[data-open-contact]")) { e.preventDefault(); window.openForm("contact"); } });

  /* returned from a hosted payment link? set the link's "after payment" redirect to  …/webinars.html?paid=1  */
  const q = new URLSearchParams(location.search);
  if (q.get("paid")) {
    addEventListener("load", () => {
      let pend = {}; try { pend = JSON.parse(sessionStorage.getItem("1x_pending") || "{}"); } catch {}
      build(); const kind = CAT.kinds[pend.kind] ? pend.kind : "webinar";
      S = { kind, planId: pend.planId || CAT.kinds[kind].plans[1].id, qty: pend.qty || 1, data: { email: pend.email || "your inbox" }, step: "done" };
      open(); viewDone({ id: pend.ref || q.get("paid") }); sessionStorage.removeItem("1x_pending"); history.replaceState(null, "", location.pathname);
      sendForm("booking-paid", { reference: pend.ref || q.get("paid"), status: "returned from payment link", email: pend.email }).catch(() => {});
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireForms); else wireForms();
})();
