/* 1to10X — creative sign-up: live progress, magnetic button, confetti on success (GSAP). Submit logic stays in commerce.js */
(function () {
  var form = document.querySelector(".jn-form"); if (!form) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bar = form.querySelector(".jn-prog i"), cnt = form.querySelector(".jn-top b");
  var name = form.querySelector('[name=name]'), mail = form.querySelector('[name=email]');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function sync() {
    var done = (name.value.trim() ? 1 : 0) + (EMAIL.test(mail.value.trim()) ? 1 : 0) + (form.querySelector('[name=interest]:checked') ? 1 : 0);
    bar.style.transform = "scaleX(" + done / 3 + ")"; cnt.textContent = done + " / 3";
    [name, mail].forEach(function (el) { if (el.value.trim()) el.closest(".jn-fld").classList.remove("fld-err"); });
  }
  form.addEventListener("input", sync); form.addEventListener("change", sync); sync();
  if (!window.gsap) return;
  if (window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".jn-copy > *, .jn-perks li", { y: 36, opacity: 0, duration: 1, ease: "expo.out", stagger: .09, scrollTrigger: { trigger: ".jn", start: "top 70%", once: true } });
    gsap.from(form, { y: 60, opacity: 0, rotate: 1.5, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".jn", start: "top 65%", once: true } });
    gsap.to(".jn-bg i", { y: function (i) { return (i % 2 ? -1 : 1) * 80; }, ease: "none", scrollTrigger: { trigger: ".jn", scrub: true } });
  }
  var chips = form.querySelectorAll(".jn-chips input");
  chips.forEach(function (c) { c.addEventListener("change", function () { if (!reduce) gsap.fromTo(c.nextElementSibling, { scale: .88 }, { scale: 1, duration: .6, ease: "back.out(3)" }); }); });
  var btn = form.querySelector("button[type=submit]");
  if (btn && !reduce && matchMedia("(hover:hover)").matches) {
    var qx = gsap.quickTo(btn, "x", { duration: .5, ease: "power3" }), qy = gsap.quickTo(btn, "y", { duration: .5, ease: "power3" });
    btn.addEventListener("pointermove", function (e) { var r = btn.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .06); qy((e.clientY - r.top - r.height / 2) * .2); });
    btn.addEventListener("pointerleave", function () { qx(0); qy(0); });
  }
  new MutationObserver(function () {
    if (!form.classList.contains("is-done") || reduce) return;
    var r = form.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, cols = ["#ee5125", "#e51f31", "#ff805f", "#fff"];
    for (var i = 0; i < 36; i++) {
      var s = document.createElement("i"); s.className = "jn-spark"; s.style.background = cols[i % 4]; s.style.left = cx + "px"; s.style.top = cy + "px"; document.body.appendChild(s);
      var a = Math.random() * 6.283, d = 120 + Math.random() * 260;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d + 80, opacity: 0, scale: .3, rotation: Math.random() * 360, duration: 1.2 + Math.random() * .6, ease: "power3.out", onComplete: function () { this.targets()[0].remove(); } });
    }
    gsap.from(form.querySelector(".form-success i"), { scale: 0, rotate: -90, duration: .9, ease: "back.out(2.4)" });
  }).observe(form, { attributes: true, attributeFilter: ["class"] });
})();
