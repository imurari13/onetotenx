/* ==========================================================
   1to10X — EVENTS hero: the community hall
   Unique assets: the “X” monument, circular lighting truss,
   banquet tables + chairs, orbiting name badges, hanging banners,
   pendant light field, live connection arcs between tables.
   ========================================================== */
import {
  THREE, PAL, brand, matte, gloss, white, glow, flat, additive, mesh, halo, dust, rng, lightCone,
  canvasTexture, roundRect, brandGradient, rail, loadLogo, createStage
} from "./common.js";

const canvas = document.querySelector("[data-scene-canvas]");
if (canvas) boot();

function boot() {
  const stage = createStage({
    canvas, fog: 0.026, exposure: 1.12, fov: 42,
    path: rail([
      { pos: [15, 10.5, 16], look: [0, 1.8, 0] },
      { pos: [9, 6.2, 12.5], look: [0, 2.2, 0] },
      { pos: [-3.5, 3.6, 10], look: [0, 2.6, 0] },
      { pos: [-0.6, 2.9, 7.2], look: [0, 3, 0] }
    ])
  });
  if (!stage) return;
  const { scene } = stage;
  const R = rng(37);
  const root = new THREE.Group(); scene.add(root);

  /* ---------- floor: polar grid + paths ---------- */
  mesh(new THREE.CircleGeometry(40, 90).rotateX(-Math.PI / 2), matte(0x0b0b0c, 0.38, 0.5), 0, 0, 0, root).castShadow = false;
  [[2.6, 2.64, PAL.white, 0.6], [4.1, 4.15, PAL.orange, 1.6], [11.4, 11.46, PAL.red, 1.4]].forEach(([a, b, c, i]) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(a, b, 128).rotateX(-Math.PI / 2), glow(c, i)); r.position.y = 0.012; root.add(r);
  });
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 6.8).rotateX(-Math.PI / 2), flat(0xffffff, 0.12));
    l.position.set(Math.cos(a) * 7.7, 0.013, Math.sin(a) * 7.7); l.rotation.y = -a + Math.PI / 2; root.add(l);
  }
  const pool = halo(PAL.orange, 15, 0.26); pool.position.set(0, 0.06, 0); root.add(pool);

  /* ---------- central stage ---------- */
  mesh(new THREE.CylinderGeometry(3.3, 3.5, 0.35, 80), matte(0x131315, 0.3, 0.7), 0, 0.175, 0, root);
  const sRim = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.03, 10, 120).rotateX(Math.PI / 2), glow(PAL.orange, 2.4)); sRim.position.y = 0.36; root.add(sRim);

  /* ---------- the X monument ---------- */
  const X = new THREE.Group(); X.position.y = 2.85; root.add(X);
  const xMat = glow(PAL.orange, 1.7), xMat2 = glow(PAL.red, 1.7);
  const a1 = mesh(new THREE.BoxGeometry(0.55, 4.6, 0.55), xMat, 0, 0, 0, X); a1.rotation.z = 0.58;
  const a2 = mesh(new THREE.BoxGeometry(0.55, 4.6, 0.55), xMat2, 0, 0, 0, X); a2.rotation.z = -0.58;
  [a1, a2].forEach(a => { a.castShadow = false; });
  [0.58, -0.58].forEach(rz => {
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 4.75, 0.7)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    wire.rotation.z = rz; X.add(wire);
  });
  const xHalo = halo(PAL.orange, 11, 0.45); xHalo.position.set(0, 2.85, 0); root.add(xHalo);
  const xLight = new THREE.PointLight(PAL.orange, 40, 16, 1.8); xLight.position.set(0, 3, 0); root.add(xLight);

  /* ---------- circular truss + spots ---------- */
  const truss = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.1, 10, 96).rotateX(Math.PI / 2), matte(0x1d1d20, 0.35, 0.85)); truss.position.y = 9; root.add(truss);
  const truss2 = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.025, 8, 96).rotateX(Math.PI / 2), glow(PAL.white, 1.2)); truss2.position.y = 8.82; root.add(truss2);
  const cones = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, x = Math.cos(a) * 7.2, z = Math.sin(a) * 7.2;
    mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.28, 14), matte(0x0b0b0c, 0.4, 0.7), x, 8.8, z, root);
    const c = lightCone(i % 3 === 0 ? PAL.red : i % 2 ? PAL.white : PAL.orange, 1.1, 9, i % 2 ? 0.045 : 0.07);
    c.position.set(x, 8.7, z); c.lookAt(0, 0, 0); c.rotateX(Math.PI / 2); root.add(c); cones.push(c);
  }
  [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 2 + Math.PI / 4; mesh(new THREE.CylinderGeometry(0.01, 0.01, 6, 6), flat(0x333336), Math.cos(a) * 7.2, 12, Math.sin(a) * 7.2, root).castShadow = false; });

  /* ---------- banquet tables + chairs ---------- */
  const T = 8, centers = [];
  const chairGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.08, 20), backGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 20, 1, true, -0.9, 1.8);
  for (let i = 0; i < T; i++) {
    const a = (i / T) * Math.PI * 2 + Math.PI / T, x = Math.cos(a) * 9.6, z = Math.sin(a) * 9.6;
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.08, 48), gloss(0x0d0d0e), 0, 0.95, 0, g);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.015, 8, 64).rotateX(Math.PI / 2), glow(i % 2 ? PAL.red : PAL.orange, 2)); rim.position.y = 0.99; g.add(rim);
    mesh(new THREE.CylinderGeometry(0.1, 0.4, 0.92, 20), matte(0x151517, 0.5, 0.6), 0, 0.46, 0, g);
    const orb = mesh(new THREE.SphereGeometry(0.17, 20, 16), glow(PAL.white, 2.6), 0, 1.25, 0, g); orb.castShadow = false;
    const oh = halo(i % 2 ? PAL.red : PAL.orange, 1.8, 0.5); oh.position.set(0, 1.25, 0); g.add(oh);
    for (let k = 0; k < 6; k++) {
      const b = (k / 6) * Math.PI * 2, cx = Math.cos(b) * 1.65, cz = Math.sin(b) * 1.65;
      const ch = new THREE.Group(); ch.position.set(cx, 0, cz); ch.rotation.y = -b - Math.PI / 2; g.add(ch);
      mesh(chairGeo, matte(0x18181a, 0.8), 0, 0.5, 0, ch);
      mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.46, 8), matte(0x222226, 0.4, 0.8), 0, 0.25, 0, ch);
      const bk = mesh(backGeo, matte(0x18181a, 0.8), 0, 0.74, 0, ch); bk.material.side = THREE.DoubleSide; bk.rotation.y = Math.PI / 2 + Math.PI;
    }
    centers.push(new THREE.Vector3(x, 1.25, z));
  }

  /* ---------- connection arcs + travelling pulses ---------- */
  const arcs = [], pulses = [];
  for (let i = 0; i < T; i++) {
    const a = centers[i], b = centers[(i + 3) % T];
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += 4.2 + (i % 3);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), new THREE.LineBasicMaterial({ color: i % 2 ? PAL.red : PAL.orange, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }));
    root.add(line); arcs.push(line);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), flat(PAL.white)); root.add(p);
    const ph = halo(PAL.soft, 0.9, 0.7); p.add(ph);
    pulses.push({ p, curve, off: i / T });
  }

  /* ---------- name badges orbiting the monument ---------- */
  const badges = [];
  const names = ["Ananya", "Vikram", "Zoya", "Dev", "Nisha", "Arjun", "Tara", "Kiran", "Riya", "Sameer", "Leela", "Neel"];
  names.forEach((nm, i) => {
    const tex = canvasTexture(256, 360, (g, w, h) => {
      g.fillStyle = "#f6f5f4"; roundRect(g, 0, 0, w, h, 24); g.fill();
      g.fillStyle = brandGradient(g, 0, 0, w, 0); g.fillRect(0, 0, w, 74);
      g.fillStyle = "#fff"; g.font = "800 30px Inter, Arial"; g.textAlign = "center"; g.fillText("1to10X", w / 2, 49);
      g.fillStyle = "#111"; g.font = "800 40px Inter, Arial"; g.fillText(nm, w / 2, 200);
      g.fillStyle = "#777"; g.font = "600 22px Inter, Arial"; g.fillText(i % 2 ? "FOUNDER" : "COMMUNITY", w / 2, 242);
      g.fillStyle = "#e0dcd8"; roundRect(g, 90, 292, 76, 14, 7); g.fill();
    });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.01), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false }));
    const holder = new THREE.Group(); holder.add(card); root.add(holder);
    badges.push({ holder, a: (i / names.length) * Math.PI * 2, r: 5.2 + (i % 3) * 0.55, y: 2.2 + (i % 4) * 0.9, sp: 0.08 + (i % 3) * 0.015 });
  });

  /* ---------- hanging banners ---------- */
  loadLogo(t => {
    [[-12, 0.5], [12, -0.5], [0, 12.4]].forEach(([x, ry], i) => {
      const z = i === 2 ? -0 : 0;
      const g = new THREE.Group(); g.position.set(i === 2 ? 0 : x * 0.9, 6.2, i === 2 ? -12.4 : -5 * Math.sign(x)); g.rotation.y = i === 2 ? 0 : -Math.atan2(x, 6) * 0.5; root.add(g);
      mesh(new THREE.BoxGeometry(2.6, 5.4, 0.06), matte(0x0c0c0d, 0.5, 0.2), 0, 0, 0, g);
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: t, transparent: true })); logo.position.set(0, 0.7, 0.04); g.add(logo);
      const stripe = mesh(new THREE.BoxGeometry(2.6, 0.12, 0.08), glow(i % 2 ? PAL.red : PAL.orange, 2), 0, -2.64, 0.01, g); stripe.castShadow = false;
    });
  });

  /* ---------- pendant field ---------- */
  const pend = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }), 40);
  const m4 = new THREE.Matrix4(), cc = new THREE.Color();
  for (let i = 0; i < 40; i++) {
    const a = R() * Math.PI * 2, r = 4 + R() * 12;
    m4.makeTranslation(Math.cos(a) * r, 5 + R() * 3.5, Math.sin(a) * r); pend.setMatrixAt(i, m4);
    cc.setHex(R() < 0.35 ? PAL.orange : 0xffffff); pend.setColorAt(i, cc);
  }
  root.add(pend);
  const motes = dust(320, [36, 16, 36], 13); root.add(motes);

  /* ---------- animation ---------- */
  stage.onUpdate((t, dt, s) => {
    motes.userData.tick(t);
    X.rotation.y = t * 0.35 + s.smooth * 1.6;
    X.position.y = 2.85 + Math.sin(t * 0.9) * 0.12;
    xHalo.material.opacity = 0.4 + Math.sin(t * 1.7) * 0.06;
    truss.rotation.y = t * 0.03; truss2.rotation.y = t * 0.03;
    cones.forEach((c, i) => { c.material.opacity = (i % 2 ? 0.045 : 0.07) * (0.8 + Math.sin(t * 1.3 + i) * 0.3); });
    badges.forEach(b => {
      const a = b.a + t * b.sp;
      b.holder.position.set(Math.cos(a) * b.r, b.y + Math.sin(t * 0.8 + b.a * 3) * 0.12, Math.sin(a) * b.r);
      b.holder.rotation.y = -a + Math.PI / 2 + Math.sin(t * 0.6 + b.a) * 0.2;
    });
    pulses.forEach(p => { p.p.position.copy(p.curve.getPoint((t * 0.12 + p.off) % 1)); });
    sRim.material.emissiveIntensity = 2.2 + Math.sin(t * 2) * 0.4;
  });
  stage.start();
}
