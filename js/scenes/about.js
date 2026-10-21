/* ==========================================================
   1to10X — ABOUT hero: the community galaxy
   One glowing core, four spiral arms of members. As you scroll the
   galaxy grows from a handful of nodes to hundreds: 1 → 10X.
   ========================================================== */
import { THREE, PAL, brand, matte, glow, flat, additive, halo, dust, rng, canvasTexture, rail, createStage } from "./common.js";

const canvas = document.querySelector("[data-scene-canvas]");
if (canvas) boot();

function boot() {
  const stage = createStage({
    canvas, fog: 0.012, exposure: 1.15, fov: 44,
    path: rail([
      { pos: [0, 15, 22], look: [0, 0, 0] },
      { pos: [12, 8, 15], look: [0, 0, 0] },
      { pos: [-6, 3.5, 9], look: [0, 0, 0] },
      { pos: [0.5, 1.2, 5.2], look: [0, 0, 0] }
    ])
  });
  if (!stage) return;
  const { scene } = stage;
  const R = rng(5);
  const root = new THREE.Group(); root.rotation.x = -0.18; scene.add(root);

  /* core */
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 32), glow(PAL.orange, 2.4)); root.add(core);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.55 })); root.add(shell);
  const shell2 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 0), new THREE.MeshBasicMaterial({ color: PAL.red, wireframe: true, transparent: true, opacity: 0.4 })); root.add(shell2);
  const coreHalo = halo(PAL.orange, 12, 0.7); root.add(coreHalo);
  const coreLight = new THREE.PointLight(PAL.orange, 120, 30, 1.6); root.add(coreLight);

  /* spiral galaxy: small stars */
  const N = 900, arms = 4;
  const stars = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  const pts = [];
  for (let i = 0; i < N; i++) {
    const arm = i % arms, t = Math.pow(R(), 0.7), rad = 3 + t * 15;
    const a = (arm / arms) * Math.PI * 2 + t * 5.2 + (R() - 0.5) * 0.45;
    const x = Math.cos(a) * rad + (R() - 0.5) * 0.9, z = Math.sin(a) * rad + (R() - 0.5) * 0.9, y = (R() - 0.5) * (1.8 - t * 0.9);
    m4.makeTranslation(x, y, z); stars.setMatrixAt(i, m4);
    const k = R(); col.setHex(k < 0.6 ? 0xffffff : 0xffffff).multiplyScalar(0.5 + R() * 0.5);
    if (k > 0.82) brand(R(), col).multiplyScalar(1.1);
    stars.setColorAt(i, col);
    pts.push(new THREE.Vector3(x, y, z));
  }
  root.add(stars);

  /* members: larger glowing nodes + links to neighbours */
  const M = 110, mem = [];
  const members = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 14, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }), M);
  for (let i = 0; i < M; i++) {
    const p = pts[(i * 7) % N].clone().multiplyScalar(1 + (R() - 0.5) * 0.04);
    mem.push(p); m4.makeTranslation(p.x, p.y, p.z); members.setMatrixAt(i, m4);
    members.setColorAt(i, brand(i / M).multiplyScalar(1.4));
  }
  root.add(members);
  const seg = [];
  mem.forEach((p, i) => {
    mem.map((q, j) => [j, p.distanceTo(q)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j, d]) => { if (d < 7) seg.push(p.x, p.y, p.z, mem[j].x, mem[j].y, mem[j].z); });
  });
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  const links = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: PAL.soft, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })); root.add(links);

  /* four word rings: LEARN · SHARE · CONNECT · GROW */
  const words = ["LEARN", "SHARE", "CONNECT", "GROW"], rings = [];
  words.forEach((w, i) => {
    const r = 5 + i * 2.6, g = new THREE.Group(); g.rotation.set(0.25 * (i % 2 ? 1 : -1), 0, 0.12 * i); root.add(g);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 6, 160).rotateX(Math.PI / 2), flat(i % 2 ? PAL.red : PAL.orange, 0.55)));
    const tex = canvasTexture(512, 128, (c, W, H) => { c.font = "800 78px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#f6f5f4"; c.shadowColor = "#ee5125"; c.shadowBlur = 24; c.fillText(w, W / 2, H / 2); });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(3.2, 0.8, 1); g.add(sp);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), flat(PAL.white)); g.add(dot);
    rings.push({ g, sp, dot, r, sp0: 0.12 + i * 0.03, ph: i * 1.7 });
  });

  const motes = dust(380, [60, 30, 60], 21); motes.position.y = 4; scene.add(motes);

  stage.onUpdate((t, dt, s) => {
    motes.userData.tick(t);
    root.rotation.y = t * 0.045 + s.smooth * 1.2;
    const grow = 0.08 + 0.92 * THREE.MathUtils.smoothstep(s.smooth + 0.15 + Math.sin(t * 0.4) * 0.01, 0, 0.75);
    stars.count = Math.max(40, Math.floor(N * grow)); members.count = Math.max(6, Math.floor(M * grow));
    links.material.opacity = 0.12 + 0.2 * grow;
    shell.rotation.set(t * 0.3, t * 0.4, 0); shell2.rotation.set(-t * 0.2, t * 0.25, t * 0.1);
    const pulse = 1 + Math.sin(t * 2.2) * 0.07; core.scale.setScalar(pulse); coreHalo.material.opacity = 0.62 + Math.sin(t * 2.2) * 0.1;
    rings.forEach(o => {
      const a = t * o.sp0 + o.ph;
      o.sp.position.set(Math.cos(a) * o.r, 0.5, Math.sin(a) * o.r); o.dot.position.set(Math.cos(a + 0.28) * o.r, 0, Math.sin(a + 0.28) * o.r);
    });
  });
  stage.start();
}
