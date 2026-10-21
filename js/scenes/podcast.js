/* ==========================================================
   1to10X — PODCASTS hero: the recording studio
   Assets are unique to this page: boom-arm mics, pop filters,
   headphones, mixing desk, acoustic foam wall, ON-AIR neon,
   live waveform ring + equaliser floor ring.
   ========================================================== */
import {
  THREE, PAL, brand, matte, gloss, white, glow, flat, additive, mesh, halo, dust, rng,
  canvasTexture, roundRect, rail, loadLogo, createStage
} from "./common.js";

const canvas = document.querySelector("[data-scene-canvas]");
if (canvas) boot();

function boot() {
  const stage = createStage({
    canvas, fog: 0.03, exposure: 1.1,
    path: rail([
      { pos: [8.4, 3.5, 9.4], look: [0, 1.8, -0.8] },
      { pos: [6.2, 3.1, 7.4], look: [0, 1.6, -0.4] },
      { pos: [2.4, 2.3, 4.6], look: [0, 1.55, 0] },
      { pos: [-0.8, 1.95, 3.0], look: [0.4, 1.5, 0] }
    ])
  });
  if (!stage) return;
  const { scene } = stage;
  const R = rng(11);
  const root = new THREE.Group();
  scene.add(root);

  /* ---------- floor + rings ---------- */
  mesh(new THREE.CircleGeometry(40, 80).rotateX(-Math.PI / 2), matte(0x0b0b0c, 0.35, 0.55), 0, 0, 0, root).castShadow = false;
  [[3.35, 3.4, PAL.orange], [5.1, 5.13, PAL.white], [6.5, 6.53, PAL.red]].forEach(([a, b, c], i) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(a, b, 128).rotateX(-Math.PI / 2), glow(c, i === 1 ? 0.5 : 1.4));
    r.position.y = 0.012; root.add(r);
  });
  const pool = halo(PAL.orange, 13, 0.28); pool.position.set(0, 0.05, 0); pool.material.rotation = 0; root.add(pool);

  /* ---------- acoustic foam wall ---------- */
  const foamGeo = new THREE.ConeGeometry(0.56, 0.5, 4).rotateX(Math.PI / 2).rotateZ(Math.PI / 4);
  const cols = 22, rows = 9, foam = new THREE.InstancedMesh(foamGeo, matte(0x151517, 0.95, 0), cols * rows);
  const m4 = new THREE.Matrix4(), c4 = new THREE.Color();
  let n = 0;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    m4.makeTranslation((i - cols / 2 + 0.5) * 1.08, 0.7 + j * 1.08, -9.5);
    foam.setMatrixAt(n, m4);
    c4.setHex(0x151517).offsetHSL(0, 0, ((i + j) % 2) * 0.012 + R() * 0.01);
    foam.setColorAt(n++, c4);
  }
  foam.receiveShadow = true; root.add(foam);
  /* vertical light strips between foam bays */
  [-9, -3, 3, 9].forEach((x, i) => {
    const s = mesh(new THREE.BoxGeometry(0.09, 9.2, 0.09), glow(i % 2 ? PAL.red : PAL.orange, 2.2), x, 5, -9.1, root);
    s.castShadow = false;
    const h = halo(i % 2 ? PAL.red : PAL.orange, 3.2, 0.22); h.position.set(x, 5, -8.8); root.add(h);
  });

  /* ---------- ON AIR neon ---------- */
  const onAir = canvasTexture(1024, 400, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.lineWidth = 14; g.strokeStyle = "#e51f31"; g.shadowColor = "#e51f31"; g.shadowBlur = 40;
    roundRect(g, 30, 30, w - 60, h - 60, 70); g.stroke();
    g.fillStyle = "#fff"; g.shadowColor = "#ee5125"; g.shadowBlur = 36;
    g.font = "800 190px Inter, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("ON AIR", w / 2, h / 2 + 8);
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.03), new THREE.MeshBasicMaterial({ map: onAir, transparent: true, depthWrite: false }));
  sign.position.set(0, 6.4, -9.0); root.add(sign);
  const signHalo = halo(PAL.red, 9, 0.3); signHalo.position.set(0, 6.4, -8.8); root.add(signHalo);
  const signBack = mesh(new THREE.BoxGeometry(5.6, 2.4, 0.12), matte(0x0c0c0d, 0.6, 0.2), 0, 6.4, -9.12, root); signBack.castShadow = false;

  /* brand plate (real logo) */
  loadLogo(t => {
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
    plate.position.set(-8.2, 3.6, -9.0); root.add(plate);
  });

  /* ---------- round table ---------- */
  const table = new THREE.Group(); root.add(table);
  mesh(new THREE.CylinderGeometry(2.55, 2.55, 0.14, 96), gloss(0x0d0d0e), 0, 0.98, 0, table);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.022, 12, 128).rotateX(Math.PI / 2), glow(PAL.orange, 2.2));
  rim.position.y = 1.05; table.add(rim);
  const under = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.03, 12, 128).rotateX(Math.PI / 2), glow(PAL.red, 1.6));
  under.position.y = 0.9; table.add(under);
  mesh(new THREE.CylinderGeometry(0.42, 0.7, 0.9, 40), matte(0x151517, 0.5, 0.5), 0, 0.5, 0, table);
  mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.08, 48), matte(0x151517, 0.5, 0.5), 0, 0.04, 0, table);

  /* ---------- mixing desk ---------- */
  const mixer = new THREE.Group(); mixer.position.set(0, 1.1, 0); mixer.rotation.x = -0.12; table.add(mixer);
  mesh(new THREE.BoxGeometry(2.0, 0.14, 0.95), matte(0x0a0a0b, 0.35, 0.6), 0, 0, 0, mixer);
  mesh(new THREE.BoxGeometry(2.04, 0.04, 0.99), white(0.4), 0, -0.06, 0, mixer);
  const caps = [];
  for (let i = 0; i < 8; i++) {
    const x = -0.82 + i * 0.235;
    mesh(new THREE.BoxGeometry(0.035, 0.012, 0.52), flat(0x000000), x, 0.076, 0.1, mixer);
    const cap = mesh(new THREE.BoxGeometry(0.15, 0.045, 0.085), i === 2 || i === 5 ? glow(PAL.orange, 2) : white(0.3), x, 0.1, 0.1, mixer);
    caps.push(cap);
    mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.05, 20), matte(0x222226, 0.4, 0.5), x, 0.095, -0.28, mixer);
    mesh(new THREE.BoxGeometry(0.014, 0.004, 0.035), glow(PAL.soft, 1.5), x, 0.122, -0.285, mixer);
  }
  const vu = [];
  for (let i = 0; i < 12; i++) {
    const seg = mesh(new THREE.BoxGeometry(0.1, 0.012, 0.03), glow(i > 9 ? PAL.red : PAL.orange, 1.8), -0.62 + i * 0.113, 0.082, -0.4, mixer);
    seg.castShadow = false; vu.push(seg);
  }

  /* ---------- microphone on boom arm (asset factory) ---------- */
  const steelM = matte(0x1d1d20, 0.35, 0.8);
  function makeMic(angle) {
    const g = new THREE.Group();
    const bx = Math.cos(angle) * 2.25, bz = Math.sin(angle) * 2.25;
    g.position.set(bx, 1.05, bz);
    g.rotation.y = -angle + Math.PI;                              // local +x points toward the table centre
    mesh(new THREE.BoxGeometry(0.34, 0.18, 0.26), steelM, 0, -0.02, 0, g);              // clamp
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 16), steelM, 0, 0.8, 0, g);          // upright pole
    mesh(new THREE.SphereGeometry(0.075, 20, 16), matte(0x2a2a2e, 0.3, 0.7), 0, 1.62, 0, g);
    const arm = mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.7, 14), steelM, 0.78, 1.8, 0, g);
    arm.rotation.z = Math.PI / 2 - 0.24;
    mesh(new THREE.SphereGeometry(0.06, 16, 12), matte(0x2a2a2e, 0.3, 0.7), 1.56, 1.67, 0, g);
    /* shock mount + capsule */
    const mic = new THREE.Group(); mic.position.set(1.62, 1.46, 0); mic.rotation.z = -Math.PI / 2 + 0.2; g.add(mic);
    mesh(new THREE.CapsuleGeometry(0.115, 0.46, 8, 24), matte(0x0b0b0c, 0.28, 0.85), 0, 0, 0, mic);
    const grille = mesh(new THREE.SphereGeometry(0.135, 24, 16), new THREE.MeshStandardMaterial({ color: 0x2a2a2e, wireframe: true, metalness: 0.8, roughness: 0.4 }), 0, 0.26, 0, mic);
    grille.castShadow = false;
    const band = mesh(new THREE.TorusGeometry(0.12, 0.012, 10, 40).rotateX(Math.PI / 2), glow(PAL.orange, 2.4), 0, -0.04, 0, mic); band.castShadow = false;
    const mount = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.014, 10, 40).rotateX(Math.PI / 2), matte(0x1a1a1c, 0.6, 0.3));
    mount.position.y = 0.12; mic.add(mount);
    /* pop filter */
    const pop = new THREE.Group(); pop.position.set(2.0, 1.4, 0); pop.rotation.y = Math.PI / 2; g.add(pop);
    mesh(new THREE.TorusGeometry(0.3, 0.014, 12, 48), matte(0x1a1a1c, 0.5, 0.5), 0, 0, 0, pop);
    const mesh2 = new THREE.Mesh(new THREE.CircleGeometry(0.29, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false }));
    pop.add(mesh2);
    const hh = halo(PAL.orange, 1.1, 0.5); hh.position.set(1.62, 1.46, 0); g.add(hh);
    return g;
  }
  root.add(makeMic(Math.PI * 0.18));
  root.add(makeMic(Math.PI * 0.82));
  root.add(makeMic(Math.PI * 1.5));

  /* ---------- headphones ---------- */
  function makeHeadphones(x, z, ry) {
    const g = new THREE.Group(); g.position.set(x, 1.05, z); g.rotation.y = ry; root.add(g);
    const band = mesh(new THREE.TorusGeometry(0.27, 0.035, 12, 40, Math.PI), matte(0x0c0c0d, 0.5, 0.4), 0, 0.3, 0, g);
    const bandTop = mesh(new THREE.TorusGeometry(0.27, 0.012, 8, 40, Math.PI), glow(PAL.orange, 1.5), 0, 0.3, 0, g); bandTop.scale.set(1, 1, 1.5);
    [-1, 1].forEach(s => {
      const cup = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32), matte(0x0c0c0d, 0.35, 0.5), s * 0.27, 0.28, 0, g);
      cup.rotation.z = Math.PI / 2;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 8, 32), glow(PAL.red, 2.2));
      ring.position.set(s * 0.325, 0.28, 0); ring.rotation.y = Math.PI / 2; g.add(ring);
    });
    return g;
  }
  makeHeadphones(-1.25, 1.2, 0.5); makeHeadphones(1.2, 1.35, -0.5);

  /* ---------- guest chairs ---------- */
  [Math.PI * 0.18, Math.PI * 0.82].forEach(a => {
    const g = new THREE.Group(); g.position.set(Math.cos(a) * 3.7, 0, Math.sin(a) * 3.7); g.rotation.y = -a - Math.PI / 2 + Math.PI; root.add(g);
    mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 40), matte(0x141416, 0.8), 0, 0.62, 0, g);
    mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), steelM, 0, 0.3, 0, g);
    mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 5), steelM, 0, 0.03, 0, g);
    const back = mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.7, 40, 1, true, -1.0, 2.0), matte(0x141416, 0.85), 0, 1.05, 0.04, g);
    back.material.side = THREE.DoubleSide; back.rotation.y = Math.PI / 2;
    const piping = mesh(new THREE.TorusGeometry(0.505, 0.012, 8, 40), glow(PAL.orange, 1.6), 0, 0.69, 0, g).rotateX(Math.PI / 2); piping.castShadow = false;
  });

  /* ---------- equaliser floor ring ---------- */
  const BARS = 72, eq = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 1, 0.1).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }), BARS);
  for (let i = 0; i < BARS; i++) { const k = Math.abs(((i / BARS) * 2) - 1); eq.setColorAt(i, brand(k)); }
  root.add(eq);

  /* ---------- live waveform ring over the table ---------- */
  const SEG = 220, wp = new Float32Array((SEG + 1) * 3);
  const waveGeo = new THREE.BufferGeometry(); waveGeo.setAttribute("position", new THREE.BufferAttribute(wp, 3));
  const wave = new THREE.LineLoop(waveGeo, new THREE.LineBasicMaterial({ color: PAL.soft, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
  root.add(wave);
  const wave2 = new THREE.LineLoop(waveGeo, new THREE.LineBasicMaterial({ color: PAL.red, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }));
  root.add(wave2);

  /* ---------- pendant lamps ---------- */
  [[-4.6, 6.2, -2.2], [-1.6, 7.4, -3.6], [2.2, 6.6, -2.8], [5.0, 7.6, -1.4], [-6.8, 7.1, 1.2], [6.9, 6.6, 1.6]].forEach(([x, y, z], i) => {
    mesh(new THREE.CylinderGeometry(0.008, 0.008, 12, 6), flat(0x333336), x, y + 6, z, root).castShadow = false;
    const l = mesh(new THREE.SphereGeometry(0.2, 24, 16), glow(i % 2 ? PAL.white : PAL.orange, 2.8), x, y, z, root); l.castShadow = false;
    const h = halo(i % 2 ? PAL.white : PAL.orange, 2.4, 0.4); h.position.set(x, y, z); root.add(h);
  });

  const motes = dust(300, [30, 14, 26], 5); root.add(motes);

  /* ---------- animation ---------- */
  const tmp = new THREE.Object3D();
  stage.onUpdate((t, dt, s) => {
    motes.userData.tick(t);
    for (let i = 0; i < BARS; i++) {
      const a = (i / BARS) * Math.PI * 2, r = 9.2;
      const amp = 0.25 + 0.2 * (Math.sin(t * 2.4 + i * 0.55) * 0.5 + 0.5) + 0.7 * Math.pow(Math.sin(t * 1.1 + i * 0.21) * 0.5 + 0.5, 3);
      tmp.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      tmp.rotation.set(0, -a, 0);
      tmp.scale.set(1, amp * 0.55 * (1 + s.smooth * 1.2), 1);
      tmp.updateMatrix(); eq.setMatrixAt(i, tmp.matrix);
    }
    eq.instanceMatrix.needsUpdate = true;
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * Math.PI * 2;
      const w = Math.sin(a * 9 + t * 3.2) * 0.12 + Math.sin(a * 17 - t * 4.1) * 0.05 + Math.sin(a * 3 + t) * 0.07;
      wp[i * 3] = Math.cos(a) * (3.05 + w); wp[i * 3 + 1] = 3.35 + w * 0.6; wp[i * 3 + 2] = Math.sin(a) * (3.05 + w);
    }
    waveGeo.attributes.position.needsUpdate = true;
    wave.rotation.y = t * 0.1;
    wave2.rotation.y = -t * 0.08; wave2.position.y = 0.18 + Math.sin(t * 1.3) * 0.05;
    vu.forEach((seg, i) => { const on = Math.sin(t * 5 + i * 0.4) + Math.sin(t * 2.3) > (i - 5) * 0.28; seg.material.emissiveIntensity = on ? 2.2 : 0.12; });
    caps.forEach((c, i) => { c.position.z = 0.1 + Math.sin(t * 1.4 + i * 1.7) * 0.12; });
    signHalo.material.opacity = 0.26 + Math.sin(t * 2.2) * 0.05;
    rim.material.emissiveIntensity = 2 + Math.sin(t * 2) * 0.3;
  });
  stage.start();
}
