/* ==========================================================
   1to10X — WEBINARS hero: the live stage
   Unique assets: curved LED wall with live chart, 1x→10x growth
   steps, lectern, broadcast camera + ring light, seated audience,
   floating participant tiles, lighting truss with beams.
   ========================================================== */
import {
  THREE, PAL, brand, matte, gloss, white, glow, flat, additive, mesh, halo, dust, rng, lightCone,
  canvasTexture, roundRect, brandGradient, rail, loadLogo, createStage
} from "./common.js";

const canvas = document.querySelector("[data-scene-canvas]");
if (canvas) boot();

function boot() {
  const stage = createStage({
    canvas, fog: 0.028, exposure: 1.1,
    path: rail([
      { pos: [0, 5.6, 15], look: [0, 3.2, -4] },
      { pos: [-4.2, 3.9, 9.2], look: [0, 2.9, -4] },
      { pos: [-1.2, 2.7, 4.2], look: [0.2, 3.1, -5] },
      { pos: [1.2, 2.5, 1.2], look: [0, 3.4, -5.5] }
    ])
  });
  if (!stage) return;
  const { scene } = stage;
  const R = rng(23);
  const root = new THREE.Group(); scene.add(root);

  /* floor */
  mesh(new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2), matte(0x0b0b0c, 0.4, 0.5), 0, 0, 0, root).castShadow = false;

  /* ---------- stage ---------- */
  mesh(new THREE.BoxGeometry(17, 0.3, 7), matte(0x131315, 0.35, 0.6), 0, 0.15, -3.2, root);
  const edge = mesh(new THREE.BoxGeometry(17.02, 0.05, 0.05), glow(PAL.orange, 2.4), 0, 0.3, 0.31, root); edge.castShadow = false;
  const edge2 = mesh(new THREE.BoxGeometry(17.02, 0.03, 0.03), glow(PAL.red, 2), 0, 0.02, 0.31, root); edge2.castShadow = false;
  const sPool = halo(PAL.orange, 16, 0.2); sPool.position.set(0, 0.35, -2.5); root.add(sPool);

  /* ---------- LED wall (live chart) ---------- */
  const W = 1280, H = 640;
  const screenTex = canvasTexture(W, H, () => {});
  const sg = screenTex.userData.ctx;
  let logoImg = null;
  const li = new Image(); li.src = "../Assests/1to10X-Logo.png"; li.onload = () => { logoImg = li; };
  function drawScreen(t, p) {
    sg.fillStyle = "#0a0a0b"; sg.fillRect(0, 0, W, H);
    const gl = sg.createRadialGradient(W * 0.8, H * 0.2, 0, W * 0.8, H * 0.2, W * 0.7);
    gl.addColorStop(0, "rgba(238,81,37,.28)"); gl.addColorStop(1, "rgba(238,81,37,0)");
    sg.fillStyle = gl; sg.fillRect(0, 0, W, H);
    /* grid */
    sg.strokeStyle = "rgba(255,255,255,.06)"; sg.lineWidth = 1;
    for (let x = 0; x <= W; x += 64) { sg.beginPath(); sg.moveTo(x, 0); sg.lineTo(x, H); sg.stroke(); }
    for (let y = 0; y <= H; y += 64) { sg.beginPath(); sg.moveTo(0, y); sg.lineTo(W, y); sg.stroke(); }
    /* header */
    sg.fillStyle = "#e51f31"; sg.beginPath(); sg.arc(70, 66, 11 + Math.sin(t * 5) * 2, 0, 7); sg.fill();
    sg.fillStyle = "#fff"; sg.font = "700 30px Inter, Arial"; sg.textAlign = "left"; sg.textBaseline = "middle";
    sg.fillText("LIVE", 96, 66);
    sg.fillStyle = "#a5a5aa"; sg.font = "600 26px Inter, Arial";
    const viewers = 1200 + Math.floor(Math.sin(t * 0.7) * 40 + t * 3) % 400;
    sg.fillText(viewers.toLocaleString() + " watching", 190, 66);
    if (logoImg) sg.drawImage(logoImg, W - 300, -70, 280, 280);
    /* title */
    sg.fillStyle = "#f6f5f4"; sg.font = "800 78px Inter, Arial"; sg.fillText("From 1x to 10x.", 70, 190);
    sg.fillStyle = "#a5a5aa"; sg.font = "500 28px Inter, Arial"; sg.fillText("Real founders. Real numbers. Real growth.", 70, 250);
    /* bars */
    const bx = 70, by = H - 70, bw = 78, gap = 36, maxH = 270;
    for (let i = 0; i < 10; i++) {
      const k = Math.max(0, Math.min(1, ((t * 0.35 + 0.15) % 1.6) * 1.3 - i * 0.07));
      const h = (0.12 + 0.88 * (i / 9) ** 1.4) * maxH * (0.25 + 0.75 * k);
      const g = sg.createLinearGradient(0, by - h, 0, by);
      g.addColorStop(0, i > 6 ? "#e51f31" : "#ee5125"); g.addColorStop(1, i > 6 ? "#ee5125" : "rgba(246,245,244,.9)");
      sg.fillStyle = i < 3 ? "rgba(246,245,244,.88)" : g;
      roundRect(sg, bx + i * (bw + gap), by - h, bw, h, 10); sg.fill();
    }
    sg.fillStyle = "#f6f5f4"; sg.font = "700 24px Inter, Arial"; sg.textAlign = "center";
    sg.fillText("1x", bx + bw / 2, by + 36); sg.fillText("10x", bx + 9 * (bw + gap) + bw / 2, by + 36);
    /* trend line */
    sg.strokeStyle = brandGradient(sg, 0, 0, W, 0); sg.lineWidth = 6; sg.lineCap = "round"; sg.beginPath();
    for (let i = 0; i <= 60; i++) {
      const x = 900 + (i / 60) * 320, y = 480 - Math.pow(i / 60, 2) * 230 + Math.sin(i * 0.5 + t * 2) * 6;
      i ? sg.lineTo(x, y) : sg.moveTo(x, y);
    }
    sg.stroke();
    screenTex.needsUpdate = true;
  }
  drawScreen(0, 0);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 6.4), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  wall.position.set(0, 4.2, -6.4); root.add(wall);
  mesh(new THREE.BoxGeometry(13.1, 6.7, 0.18), matte(0x050506, 0.4, 0.6), 0, 4.2, -6.55, root);
  [[0, 7.58, 13.1, 0.05], [0, 0.82, 13.1, 0.05]].forEach(([x, y, w, h], i) => { const e = mesh(new THREE.BoxGeometry(w, h, 0.06), glow(i ? PAL.red : PAL.orange, 2.6), x, y, -6.42, root); e.castShadow = false; });
  const wallHalo = halo(PAL.orange, 22, 0.16); wallHalo.position.set(0, 4.2, -6); root.add(wallHalo);

  /* ---------- growth steps 1x → 10x ---------- */
  const steps = [];
  for (let i = 0; i < 10; i++) {
    const h = 0.35 + Math.pow(i / 9, 1.5) * 2.9;
    const g = new THREE.Group(); g.position.set(-5.1 + i * 1.13, 0.3, -3.6); root.add(g);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1, 0.98).translate(0, 0.5, 0), i < 3 ? white(0.35) : i < 7 ? gloss(0x1d1d20) : glow(i === 9 ? PAL.red : PAL.orange, 1.5));
    body.castShadow = body.receiveShadow = true;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 1).translate(0, 0.5, 0), glow(i > 5 ? PAL.soft : PAL.orange, 2));
    g.add(body); g.add(cap);
    steps.push({ g, body, cap, h });
  }
  const tenX = canvasTexture(512, 256, (g, w, h) => {
    g.font = "900 190px Inter, Arial"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillStyle = brandGradient(g, 0, 0, w, h); g.shadowColor = "#e51f31"; g.shadowBlur = 40; g.fillText("10X", w / 2, h / 2);
  });
  const tenSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tenX, transparent: true, depthWrite: false }));
  tenSprite.scale.set(2.8, 1.4, 1); root.add(tenSprite);
  const tenHalo = halo(PAL.red, 6, 0.5); root.add(tenHalo);

  /* ---------- lectern ---------- */
  const lec = new THREE.Group(); lec.position.set(-6.6, 0.3, -1.8); lec.rotation.y = 0.35; root.add(lec);
  mesh(new THREE.BoxGeometry(0.9, 1.2, 0.6), matte(0x151517, 0.4, 0.5), 0, 0.6, 0, lec);
  const top = mesh(new THREE.BoxGeometry(1.0, 0.05, 0.7), white(0.4), 0, 1.22, 0, lec); top.rotation.x = -0.18;
  const bar = mesh(new THREE.BoxGeometry(0.7, 0.04, 0.02), glow(PAL.orange, 2.2), 0, 0.95, 0.31, lec); bar.castShadow = false;
  const neck = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 8), matte(0x222226, 0.3, 0.8), 0.2, 1.55, 0.05, lec);
  mesh(new THREE.SphereGeometry(0.055, 16, 12), matte(0x0b0b0c, 0.3, 0.8), 0.2, 1.93, 0.05, lec);

  /* ---------- broadcast camera + ring light ---------- */
  const cam = new THREE.Group(); cam.position.set(5.6, 0, 6.2); cam.rotation.y = -0.45; root.add(cam);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2, leg = mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.5, 8), matte(0x1d1d20, 0.4, 0.7), Math.cos(a) * 0.32, 0.72, Math.sin(a) * 0.32, cam);
    leg.rotation.set(Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22);
  }
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), matte(0x1d1d20, 0.4, 0.7), 0, 1.7, 0, cam);
  const body = mesh(new THREE.BoxGeometry(0.55, 0.38, 0.9), matte(0x0b0b0c, 0.35, 0.6), 0, 2.15, 0, cam);
  mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.4, 28), matte(0x0b0b0c, 0.3, 0.7), 0, 2.15, -0.62, cam).rotation.x = Math.PI / 2;
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.13, 28), glow(PAL.soft, 0.6)); lens.position.set(0, 2.15, -0.83); lens.rotation.y = Math.PI; cam.add(lens);
  const tally = mesh(new THREE.SphereGeometry(0.045, 12, 10), glow(PAL.red, 4), 0.2, 2.38, -0.3, cam); tally.castShadow = false;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 14, 48), glow(PAL.white, 2.6)); ring.position.set(0, 2.15, -1.05); ring.rotation.y = Math.PI; cam.add(ring);
  const ringHalo = halo(PAL.white, 2.4, 0.3); ringHalo.position.set(0, 2.15, -1.1); cam.add(ringHalo);

  /* ---------- audience ---------- */
  const rows = 7, cols = 13, N = rows * cols;
  const bodyI = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.2, 0.34, 6, 12), matte(0x1f1f22, 0.7, 0.2), N);
  const headI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 14, 12), matte(0x2a2a2e, 0.6, 0.2), N);
  const lapI = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.02, 0.24), new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), c = new THREE.Color();
  let n = 0;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const x = (k - (cols - 1) / 2) * 1.25 + (R() - 0.5) * 0.15, z = 1.8 + r * 1.35, y = 0.45 + r * 0.04;
    m.compose(new THREE.Vector3(x, y + 0.34, z), q, sc); bodyI.setMatrixAt(n, m);
    m.compose(new THREE.Vector3(x, y + 0.9, z), q, sc); headI.setMatrixAt(n, m);
    m.compose(new THREE.Vector3(x, y + 0.62, z - 0.34), q.setFromEuler(new THREE.Euler(-0.3, 0, 0)), sc); lapI.setMatrixAt(n, m);
    const hot = R() < 0.1; c.setHex(hot ? PAL.orange : 0xffffff).multiplyScalar(hot ? 1 : 0.45 + R() * 0.4); lapI.setColorAt(n, c);
    if (hot) bodyI.setColorAt(n, new THREE.Color(PAL.orange).multiplyScalar(0.55)); else bodyI.setColorAt(n, new THREE.Color(0xffffff).multiplyScalar(0.7 + R() * 0.3));
    n++;
  }
  bodyI.castShadow = headI.castShadow = true; root.add(bodyI, headI, lapI);

  /* ---------- floating participant tiles ---------- */
  const names = ["Aarav", "Meera", "Rohan", "Sana", "Kabir", "Isha"];
  const tiles = names.map((nm, i) => {
    const tex = canvasTexture(256, 160, (g, w, h) => {
      g.fillStyle = "#121214"; roundRect(g, 0, 0, w, h, 22); g.fill();
      g.strokeStyle = i % 2 ? "#e51f31" : "#ee5125"; g.lineWidth = 4; roundRect(g, 2, 2, w - 4, h - 4, 20); g.stroke();
      g.fillStyle = "#f6f5f4"; g.beginPath(); g.arc(w / 2, 62, 26, 0, 7); g.fill();
      g.beginPath(); g.ellipse(w / 2, 128, 46, 34, 0, Math.PI, 0); g.fill();
      g.fillStyle = "rgba(255,255,255,.12)"; roundRect(g, 14, h - 34, 86, 22, 11); g.fill();
      g.fillStyle = "#fff"; g.font = "600 15px Inter, Arial"; g.textBaseline = "middle"; g.fillText(nm, 24, h - 23);
    });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
    const side = i % 2 ? 1 : -1, col = Math.floor(i / 2);
    p.position.set(side * (8.9 + col * 0.3), 2.3 + col * 1.5, -4.2 + col * 0.6); p.rotation.y = -side * 0.5;
    p.userData.base = p.position.clone(); p.userData.ph = i * 1.3;
    root.add(p); return p;
  });

  /* ---------- lighting truss + beams ---------- */
  mesh(new THREE.BoxGeometry(16, 0.14, 0.14), matte(0x1a1a1c, 0.4, 0.8), 0, 9.2, -2.6, root);
  mesh(new THREE.BoxGeometry(16, 0.14, 0.14), matte(0x1a1a1c, 0.4, 0.8), 0, 9.2, 0.4, root);
  const beams = [];
  for (let i = 0; i < 7; i++) {
    const x = -7.2 + i * 2.4, col = i % 3 === 1 ? PAL.red : i % 2 ? PAL.white : PAL.orange;
    mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 16), matte(0x0b0b0c, 0.4, 0.7), x, 9.0, -2.6, root);
    const b = lightCone(col, 1.5, 9, i % 2 ? 0.05 : 0.08); b.position.set(x, 8.9, -2.6); root.add(b); beams.push(b);
  }
  const motes = dust(280, [34, 14, 30], 9); root.add(motes);

  /* ---------- animation ---------- */
  let lastDraw = 0;
  stage.onUpdate((t, dt, s) => {
    motes.userData.tick(t);
    if (t - lastDraw > 0.07) { drawScreen(t, s.smooth); lastDraw = t; }
    const rise = Math.min(1, 0.35 + s.smooth * 1.2);
    steps.forEach((st, i) => {
      const k = THREE.MathUtils.smoothstep(rise * 1.6 - i * 0.08, 0, 1);
      const h = st.h * (0.15 + 0.85 * k) * (1 + Math.sin(t * 1.2 + i) * 0.015);
      st.body.scale.y = h; st.cap.position.y = h;
    });
    const last = steps[9]; tenSprite.position.set(last.g.position.x - 0.3, 0.3 + last.body.scale.y + 1.2 + Math.sin(t * 1.5) * 0.08, -3.6);
    tenHalo.position.copy(tenSprite.position);
    tiles.forEach(p => { p.position.y = p.userData.base.y + Math.sin(t * 0.9 + p.userData.ph) * 0.14; });
    beams.forEach((b, i) => { b.rotation.z = Math.sin(t * 0.5 + i) * 0.16; b.rotation.x = Math.cos(t * 0.4 + i * 0.7) * 0.1; });
    tally.material.emissiveIntensity = Math.sin(t * 4) > 0 ? 4 : 0.4;
    edge.material.emissiveIntensity = 2.2 + Math.sin(t * 2) * 0.4;
  });
  stage.start();
}
