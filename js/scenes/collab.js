/* ==========================================================
   1to10X — COLLAB hero: the partner constellation
   Interlocked brand rings at the centre, partner plates (real
   logos, in white) orbiting on two rails, light beams + pulses
   travelling from every partner into the community core.
   ========================================================== */
import { THREE, PAL, brand, matte, gloss, glow, flat, additive, mesh, halo, dust, rng, roundRect, canvasTexture, rail, createStage } from "./common.js";

const canvas = document.querySelector("[data-scene-canvas]");
if (canvas) boot();

function boot() {
  const stage = createStage({
    canvas, fog: 0.022, exposure: 1.12, fov: 44, shift: 0.1,
    path: rail([
      { pos: [0, 9, 23], look: [0, 1.5, 0] },
      { pos: [9, 5, 16], look: [0, 1.5, 0] },
      { pos: [-5, 3.2, 10], look: [0, 1.8, 0] },
      { pos: [0, 2.4, 6.4], look: [0, 1.9, 0] }
    ])
  });
  if (!stage) return;
  const { scene, camera } = stage;
  const root = new THREE.Group(); scene.add(root);

  /* floor */
  mesh(new THREE.CircleGeometry(40, 80).rotateX(-Math.PI / 2), matte(0x0b0b0c, 0.35, 0.55), 0, 0, 0, root).castShadow = false;
  [[5.4, 5.44, PAL.orange], [8.4, 8.43, PAL.white], [11, 11.04, PAL.red]].forEach(([a, b, c], i) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(a, b, 140).rotateX(-Math.PI / 2), glow(c, i === 1 ? 0.5 : 1.4)); r.position.y = 0.012; root.add(r);
  });
  const pool = halo(PAL.orange, 22, 0.22); pool.position.y = 0.06; root.add(pool);

  /* centre: interlocked rings + core */
  const hub = new THREE.Group(); hub.position.y = 2.2; root.add(hub);
  const rA = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.11, 24, 120), glow(PAL.orange, 2));
  const rB = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.11, 24, 120), new THREE.MeshStandardMaterial({ color: PAL.white, roughness: 0.3, metalness: 0.5, emissive: PAL.white, emissiveIntensity: 0.35 }));
  const rC = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.09, 24, 120), glow(PAL.red, 2));
  rA.position.x = -0.85; rB.position.x = 0.85; rB.rotation.y = Math.PI / 2; rC.position.set(0, 0, 0); rC.rotation.x = Math.PI / 2; rC.scale.setScalar(0.72);
  hub.add(rA, rB, rC);
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 20), glow(PAL.white, 3)); hub.add(spark);
  const hubHalo = halo(PAL.orange, 9, 0.6); hubHalo.position.y = 2.2; root.add(hubHalo);
  const hubLight = new THREE.PointLight(PAL.orange, 70, 22, 1.6); hubLight.position.y = 2.4; root.add(hubLight);

  /* partner plates */
  const plates = [], loader = new THREE.TextureLoader();
  const PW = 2.0, PH = 1.2;
  const frame = new THREE.BoxGeometry(PW, PH, 0.08);
  for (let i = 0; i < 12; i++) {
    const ring = i < 6 ? 0 : 1, k = ring ? i - 6 : i;
    const g = new THREE.Group(); root.add(g);
    mesh(frame, matte(0x0d0d0e, 0.4, 0.5), 0, 0, 0, g);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(frame), new THREE.LineBasicMaterial({ color: i % 2 ? PAL.red : PAL.orange })); g.add(edge);
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })); logo.position.z = 0.05; g.add(logo);
    loader.load(`../Assests/${i + 1}.png`, t => {
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const ar = t.image.width / t.image.height, mw = PW * 0.74, mh = PH * 0.62;
      const w = Math.min(mw, mh * ar), h = w / ar; logo.scale.set(w, h, 1); logo.material.map = t; logo.material.opacity = 1; logo.material.needsUpdate = true;
    });
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const beam = new THREE.Line(beamGeo, new THREE.LineBasicMaterial({ color: i % 2 ? PAL.red : PAL.orange, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })); root.add(beam);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), flat(PAL.white)); root.add(pulse);
    plates.push({ g, ring, k, beam, pulse, off: i / 12 });
  }

  const motes = dust(320, [34, 14, 34], 17); root.add(motes);
  const center = new THREE.Vector3(0, 2.2, 0), tmp = new THREE.Vector3();

  stage.onUpdate((t, dt, s) => {
    motes.userData.tick(t);
    hub.rotation.y = t * 0.5 + s.smooth * 2; hub.rotation.z = Math.sin(t * 0.4) * 0.2; rC.rotation.z = t * 0.9;
    spark.scale.setScalar(1 + Math.sin(t * 3) * 0.12); hubHalo.material.opacity = 0.52 + Math.sin(t * 2.4) * 0.08;
    hub.position.y = 2.2 + Math.sin(t * 0.9) * 0.1;
    plates.forEach((p, i) => {
      const r = p.ring ? 8.6 : 5.6, dir = p.ring ? -1 : 1, a = (p.k / 6) * Math.PI * 2 + t * 0.07 * dir + s.smooth * 1.4 * dir;
      p.g.position.set(Math.cos(a) * r, (p.ring ? 4.4 : 2.4) + Math.sin(t * 0.8 + i) * 0.18, Math.sin(a) * r);
      p.g.quaternion.copy(camera.quaternion);                    // plates always face the viewer → logos stay readable
      const pos = p.beam.geometry.attributes.position;
      pos.setXYZ(0, p.g.position.x, p.g.position.y, p.g.position.z); pos.setXYZ(1, center.x, hub.position.y, center.z); pos.needsUpdate = true;
      tmp.copy(p.g.position).lerp(center, (t * 0.18 + p.off) % 1); p.pulse.position.copy(tmp);
    });
  });
  stage.start();
}
