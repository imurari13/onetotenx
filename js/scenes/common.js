/* ==========================================================
   1to10X — shared 3D toolkit
   One palette, one lighting language, one scroll contract for
   every hero scene (webinars / podcasts / events).
   ========================================================== */
import * as THREE from "three";
export { THREE };

/* ---- Brand palette (matches theme.css tokens) ---- */
export const PAL = {
  bg: 0x090909,
  charcoal: 0x111112,
  steel: 0x1a1a1c,
  graphite: 0x27272b,
  white: 0xf6f5f4,
  orange: 0xee5125,
  red: 0xe51f31,
  soft: 0xff805f
};
const cOrange = new THREE.Color(PAL.orange);
const cRed = new THREE.Color(PAL.red);
export const brand = (t, out = new THREE.Color()) => out.copy(cOrange).lerp(cRed, THREE.MathUtils.clamp(t, 0, 1));

/* ---- Materials ---- */
export const matte = (color = PAL.charcoal, rough = 0.78, metal = 0.1) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
export const gloss = (color = PAL.charcoal) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.22, metalness: 0.75 });
export const white = (rough = 0.45) =>
  new THREE.MeshStandardMaterial({ color: PAL.white, roughness: rough, metalness: 0.05 });
/* self-lit brand colour — the “signature glow” of every scene */
export const glow = (color = PAL.orange, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, roughness: 1 });
export const flat = (color, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
export const additive = (color, opacity = 0.2) =>
  new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });

export const mesh = (geo, mat, x = 0, y = 0, z = 0, parent) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
};

/* ---- Canvas textures ---- */
export function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.userData = { canvas: c, ctx: g };
  return t;
}
export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
export const brandGradient = (g, x0, y0, x1, y1) => {
  const k = g.createLinearGradient(x0, y0, x1, y1);
  k.addColorStop(0, "#ee5125");
  k.addColorStop(1, "#e51f31");
  return k;
};

let haloTex;
export function halo(color = PAL.orange, size = 3, opacity = 0.55) {
  if (!haloTex) {
    haloTex = canvasTexture(128, 128, (g, w, h) => {
      const k = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      k.addColorStop(0, "rgba(255,255,255,1)");
      k.addColorStop(0.25, "rgba(255,255,255,.45)");
      k.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = k; g.fillRect(0, 0, w, h);
    });
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  s.scale.setScalar(size);
  return s;
}

export function loadLogo(onLoad) {
  new THREE.TextureLoader().load("../Assests/1to10X-Logo.png", t => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    onLoad(t);
  });
}

/* soft cone of light (volumetric look without post-processing) */
export function lightCone(color, radius, height, opacity = 0.09) {
  const geo = new THREE.ConeGeometry(radius, height, 40, 1, true);
  geo.translate(0, -height / 2, 0);
  return new THREE.Mesh(geo, additive(color, opacity));
}

/* drifting dust — adds depth to the empty void around every scene */
export function dust(count = 260, spread = [24, 12, 24], seed = 7) {
  const pos = new Float32Array(count * 3);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() - 0.5) * spread[0];
    pos[i * 3 + 1] = rnd() * spread[1];
    pos[i * 3 + 2] = (rnd() - 0.5) * spread[2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    color: PAL.soft, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  pts.userData.tick = t => { pts.rotation.y = t * 0.012; pts.position.y = Math.sin(t * 0.2) * 0.15; };
  return pts;
}

/* seeded random so every visit builds the same scene */
export const rng = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* camera rail built from keyframes: p∈[0,1] → position + look-at */
export function rail(keys) {
  const pos = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k.pos)), false, "centripetal");
  const look = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k.look)), false, "centripetal");
  return p => ({ pos: pos.getPoint(THREE.MathUtils.clamp(p, 0, 1)), look: look.getPoint(THREE.MathUtils.clamp(p, 0, 1)) });
}

/* ==========================================================
   createStage — renderer, camera, lights, loop, scroll + pointer
   ========================================================== */
export function createStage({ canvas, path, fog = 0.032, fov = 40, exposure = 1.08, shift = 0.15, onFrame }) {
  const host = canvas.parentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    document.documentElement.classList.add("no-webgl");
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.bg);
  scene.fog = new THREE.FogExp2(PAL.bg, fog);

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 140);

  /* shared lighting language: cool-neutral white key + brand orange / red rims */
  scene.add(new THREE.HemisphereLight(0xdfe3ff, 0x120a08, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(6, 12, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 40 });
  key.shadow.bias = -0.0006;
  scene.add(key);
  const rimO = new THREE.PointLight(PAL.orange, 70, 40, 1.6); rimO.position.set(-9, 5, -4); scene.add(rimO);
  const rimR = new THREE.PointLight(PAL.red, 55, 40, 1.6); rimR.position.set(10, 4, -8); scene.add(rimR);

  /* state */
  const state = { progress: 0, smooth: 0, mx: 0, my: 0, sx: 0, sy: 0, visible: true, t: 0 };
  const lookAt = new THREE.Vector3();
  const updaters = [];

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* portrait screens: widen the field so the whole set stays in frame */
    camera.fov = w / h < 0.8 ? fov + 14 : fov;
    /* landscape: slide the scene to the right so it never sits behind the headline */
    if (w / h > 1.1) camera.setViewOffset(w, h, -w * shift, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  host.addEventListener("pointermove", e => {
    const r = host.getBoundingClientRect();
    state.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    state.my = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  host.addEventListener("pointerleave", () => { state.mx = 0; state.my = 0; });

  /* scroll contract: the sticky hero wrapper drives state.progress (0 → 1) */
  const wrapper = host.closest(".scene-hero");
  if (window.ScrollTrigger && wrapper) {
    ScrollTrigger.create({
      trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: self => { state.progress = self.progress; }
    });
  }
  new IntersectionObserver(e => { state.visible = e[0].isIntersecting; }, { threshold: 0 }).observe(wrapper || host);

  const clock = new THREE.Clock();
  const frame = () => {
    requestAnimationFrame(frame);
    if (!state.visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    state.t += dt;
    const ease = 1 - Math.pow(0.0015, dt);          // frame-rate independent smoothing
    state.smooth += (state.progress - state.smooth) * Math.min(ease * 0.9, 1);
    state.sx += (state.mx - state.sx) * Math.min(ease, 1);
    state.sy += (state.my - state.sy) * Math.min(ease, 1);

    const p = path(state.smooth);
    /* cursor parallax: tiny sideways + vertical drift, fades out as the hero scrolls away */
    const amt = reduce ? 0 : (1 - state.smooth * 0.8);
    camera.position.copy(p.pos);
    camera.position.x += state.sx * 1.1 * amt;
    camera.position.y += -state.sy * 0.45 * amt;
    lookAt.copy(p.look);
    lookAt.x += state.sx * 0.35 * amt;
    camera.lookAt(lookAt);

    updaters.forEach(fn => fn(state.t, dt, state));
    onFrame && onFrame(state.t, dt, state);
    renderer.render(scene, camera);
  };

  return {
    THREE, scene, camera, renderer, state, key,
    onUpdate: fn => updaters.push(fn),
    start: () => { frame(); document.documentElement.classList.add("scene-ready"); }
  };
}
