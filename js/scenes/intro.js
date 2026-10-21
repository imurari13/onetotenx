/* ==========================================================
   1to10X — INTRO SCENE (WebGL / Three.js + GSAP)
   One idea: growth you can watch. ~14k particles stream along an
   exponential curve — a single dim point at "1", a dense blaze at
   "10X". The curve is drawn on load, then scroll carries it the rest
   of the way while the multiplier counter reads the head's height.
   Falls back to the original 2D canvas if WebGL is unavailable.
   ========================================================== */
import * as THREE from "three";

const h0 = document.getElementById("h0");
const stage = h0 && h0.querySelector(".h0s");
if (stage) boot();

function boot() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 760px)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const K = 4.2;                                  // curve steepness
  const curve = r => (Math.exp(K * r) - 1) / (Math.exp(K) - 1);  // 0..1, same maths as the shader

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return failSafe(); }
  if (!renderer.getContext()) return failSafe();

  const cv = renderer.domElement;
  cv.id = "h0gl"; cv.setAttribute("aria-hidden", "true");
  stage.insertBefore(cv, stage.firstChild);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 7);

  const N = small ? 6500 : 15000;
  const aT = new Float32Array(N), aS = new Float32Array(N * 3), pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    aT[i] = Math.random();
    aS[i * 3] = Math.random(); aS[i * 3 + 1] = Math.random(); aS[i * 3 + 2] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  geo.setAttribute("aS", new THREE.BufferAttribute(aS, 3));

  const uni = {
    uTime: { value: 0 }, uReveal: { value: 0.02 }, uMouse: { value: new THREE.Vector2(9, 9) },
    uHalf: { value: new THREE.Vector2(4, 2.2) }, uPR: { value: 1 }, uAlpha: { value: small ? 0.7 : 1 },
    uSpeed: { value: reduce ? 0 : 1 }, uK: { value: K }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aT; attribute vec3 aS;
      uniform float uTime, uReveal, uPR, uSpeed, uK; uniform vec2 uMouse, uHalf;
      varying float vA; varying vec3 vC;
      void main(){
        float t = fract(aT + uTime * 0.045 * uSpeed * (0.45 + aS.x * 0.9)) * uReveal;
        float h = (exp(uK * t) - 1.0) / (exp(uK) - 1.0);
        vec3 p = vec3(mix(-uHalf.x, uHalf.x, t), mix(-uHalf.y, uHalf.y, h), 0.0);
        /* spread widens with growth: the ribbon is a thread at 1, a river at 10X */
        float spread = 0.015 + pow(t, 2.2) * 0.62;
        float ang = aS.y * 6.2831 + uTime * 0.25 * uSpeed * (aS.z - 0.5);
        p.y += cos(ang) * spread * (aS.z * 0.9 + 0.1);
        p.z += sin(ang) * spread * 1.6 * aS.z;
        p.x += (aS.x - 0.5) * spread * 0.5;
        /* cursor pushes particles aside */
        vec2 d = p.xy - uMouse; float m = length(d);
        p.xy += normalize(d + 1e-4) * smoothstep(1.3, 0.0, m) * 0.55;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float head = smoothstep(0.16, 0.0, uReveal - t);        /* glow at the growing tip */
        gl_PointSize = (1.2 + aS.z * 2.6) * (0.45 + t * 1.25 + head * 1.4) * uPR * (7.0 / -mv.z);
        vA = smoothstep(0.0, 0.07, t) * (0.16 + t * 0.7 + head * 0.5);
        vC = mix(vec3(1.0, 0.72, 0.55), mix(vec3(0.93, 0.32, 0.145), vec3(0.9, 0.12, 0.19), smoothstep(0.55, 1.0, t)), smoothstep(0.0, 0.35, t + head * 0.4));
      }`,
    fragmentShader: `
      varying float vA; varying vec3 vC; uniform float uAlpha;
      void main(){
        float r = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.0, r); a *= a;
        gl_FragColor = vec4(vC, a * vA * uAlpha);
      }`
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const group = new THREE.Group(); group.add(pts); scene.add(group);

  /* hairline guide so the curve reads as a curve even between particles */
  const LN = 160, lp = new Float32Array(LN * 3);
  const lgeo = new THREE.BufferGeometry(); lgeo.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  const line = new THREE.Line(lgeo, new THREE.LineBasicMaterial({ color: 0xee5125, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  line.frustumCulled = false; group.add(line);
  function updateLine(reveal) {
    const hx = uni.uHalf.value.x, hy = uni.uHalf.value.y, n = Math.max(2, Math.round(LN * reveal));
    for (let i = 0; i < LN; i++) {
      const t = Math.min(i, n - 1) / (n - 1) * reveal;
      lp[i * 3] = -hx + 2 * hx * t; lp[i * 3 + 1] = -hy + 2 * hy * curve(t); lp[i * 3 + 2] = 0;
    }
    lgeo.attributes.position.needsUpdate = true;
  }

  /* arrowhead: rides the tip of the curve and points along its tangent, so the growth line ends as a finished arrow */
  const ahShape = new Float32Array([
     0.00,  0.00, 0,   -0.46,  0.24, 0,   -0.30,  0.00, 0,
     0.00,  0.00, 0,   -0.30,  0.00, 0,   -0.46, -0.24, 0
  ]);
  const ahGeo = new THREE.BufferGeometry(); ahGeo.setAttribute("position", new THREE.BufferAttribute(ahShape, 3));
  const ahMat = new THREE.MeshBasicMaterial({ color: 0xff5a2c, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  const arrowHead = new THREE.Mesh(ahGeo, ahMat); arrowHead.frustumCulled = false; group.add(arrowHead);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xee5125, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const halo = new THREE.Mesh(new THREE.CircleGeometry(0.34, 40), haloMat); halo.frustumCulled = false; group.add(halo);
  function updateArrow(reveal, time) {
    const hx = uni.uHalf.value.x, hy = uni.uHalf.value.y;
    const t = clamp(reveal, 0.001, 1), h = curve(t);
    const x = -hx + 2 * hx * t, y = -hy + 2 * hy * h;
    /* tangent of the curve in world units */
    const dydt = 2 * hy * (K * Math.exp(K * t)) / (Math.exp(K) - 1), dxdt = 2 * hx;
    arrowHead.position.set(x, y, 0.02); arrowHead.rotation.z = Math.atan2(dydt, dxdt);
    const grow = ease((reveal - 0.9) / 0.1);           /* the head only appears as the line completes */
    const s = (small ? 0.8 : 1.2) * (0.35 + 0.65 * grow) * (1 + 0.05 * Math.sin(time * 3));
    arrowHead.scale.set(s, s, 1); ahMat.opacity = 0.95 * grow;
    halo.position.set(x - Math.cos(arrowHead.rotation.z) * 0.12 * s, y - Math.sin(arrowHead.rotation.z) * 0.12 * s, 0);
    const hs = s * (1.1 + 0.25 * Math.sin(time * 2.2)); halo.scale.set(hs, hs, 1); haloMat.opacity = 0.16 * grow;
  }

  /* ---- sizing: curve spans the stage, sweeping lower-left → upper-right ---- */
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const pr = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
    uni.uPR.value = pr * (h / 900);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z, vw = vh * camera.aspect;
    uni.uHalf.value.set(vw * (w < 760 ? 0.40 : 0.385), vh * (w < 760 ? 0.34 : 0.33));
    group.position.set(w < 760 ? vw * 0.02 : vw * 0.07, w < 760 ? -vh * 0.04 : -vh * 0.02, 0);
    updateLine(state.reveal);
    mouseScale = { x: vw / 2, y: vh / 2 };
  }

  /* ---- state, pointer, scroll ---- */
  const state = { reveal: reduce ? 1 : 0.02, scrollBoost: 0 };
  let mx = 0, my = 0, sx = 0, sy = 0, mouseScale = { x: 4, y: 2 }, visible = true, P = 0;
  h0.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = -(((e.clientY - r.top) / r.height) * 2 - 1);
  });
  h0.addEventListener("pointerleave", () => { mx = my = 9; });
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(h0);

  /* multiplier read-out: the same maths as the curve's head */
  const xv = document.getElementById("h0xv"), xbar = document.getElementById("h0xbar");
  const xw = document.querySelector(".h0x");
  function readout() {
    const r = clamp(state.reveal, 0, 1), v = 1 + 9 * curve(r);
    if (xv) xv.textContent = v.toFixed(1);
    if (xbar) xbar.firstElementChild.style.transform = `scaleX(${r})`;
    if (xw) xw.setAttribute("aria-label", "Growth multiplier " + v.toFixed(1) + " times");
  }

  /* ---- orchestrated entrance (one sequence, then scroll takes over) ---- */
  const h1 = h0.querySelector(".h0t h1");
  if (h1 && window.gsap) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute("aria-label", h1.textContent.trim());
    h1.innerHTML = words.map(w => `<span class="h0m" aria-hidden="true"><span class="h0wd">${w}</span></span>`).join(" ");
    h0.classList.remove("gl-pending");
    if (!reduce) {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".h0wd", { yPercent: 112, rotate: 3, duration: 1.25, stagger: 0.07 }, 0.1)
        .from(".h0t > p, .h0b, .h0g", { y: 26, opacity: 0, duration: 1, stagger: 0.12, clearProps: "transform,opacity" }, 0.55)
        .from(".h0x", { opacity: 0, x: 24, duration: 1 }, 1.0)
        .to(state, { reveal: 1, duration: 3.6, ease: "power3.inOut", onUpdate: () => { updateLine(state.reveal); } }, 0.2);
    }
  } else { h0.classList.remove("gl-pending"); if (!reduce && window.gsap) gsap.to(state, { reveal: 1, duration: 3.2, ease: "power3.inOut" }); }

  /* magnetic buttons */
  if (!reduce && matchMedia("(hover:hover)").matches && window.gsap) {
    h0.querySelectorAll(".h0b a").forEach(b => {
      const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }), qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.22); qy((e.clientY - r.top - r.height / 2) * 0.3); });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });
  }

  resize();
  addEventListener("resize", resize);
  h0.classList.add("webgl-on");
  readout();

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const r = h0.getBoundingClientRect();
    if (r.bottom < 0 || !visible) return;
    P = clamp(-r.top / (h0.offsetHeight - innerHeight), 0, 1);
    /* scroll finishes what the entrance started */
    const target = Math.max(state.reveal, ease(P * 1.35));
    uni.uReveal.value += (target - uni.uReveal.value) * 0.12;
    if (P > 0) state.scrollBoost = uni.uReveal.value;
    sx += (mx - sx) * 0.06; sy += (my - sy) * 0.06;
    uni.uMouse.value.set(sx > 5 ? 9 : sx * mouseScale.x - group.position.x, sy > 5 ? 9 : sy * mouseScale.y - group.position.y);
    group.rotation.y = (sx > 5 ? 0 : sx) * 0.09; group.rotation.x = (sy > 5 ? 0 : -sy) * 0.05;
    camera.position.z = 7 - P * 2.6;
    cv.style.opacity = String(clamp(1 - ease((P - 0.55) / 0.45), 0, 1));
    uni.uTime.value = reduce ? 0 : clock.getElapsedTime();
    const shown = Math.max(state.reveal, uni.uReveal.value);
    if (xv) { const v = 1 + 9 * curve(shown); xv.textContent = v.toFixed(1); if (xbar) xbar.firstElementChild.style.transform = `scaleX(${shown})`; }
    if (P > 0.001) updateLine(uni.uReveal.value);
    updateArrow(shown, uni.uTime.value || clock.getElapsedTime());
    renderer.render(scene, camera);
  }
  frame();

  function failSafe() { h0.classList.remove("gl-pending"); }
}
