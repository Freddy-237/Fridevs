/**
 * HERO 3D — « réseau digital »
 *
 * Un « F » violet en relief au centre, entouré d'une constellation de points
 * reliés entre eux, parcourue par des impulsions lumineuses (les « données »).
 * Le tout suit doucement la souris.
 *
 * Three.js est copié localement dans src/lib/three (alias "three" dans astro.config.mjs).
 * GSAP (public/lib/gsap) est optionnel : sans lui, la scène apparaît sans intro animée.
 */
import * as THREE from "three";

const PURPLE = 0x8b5cf6;
const PURPLE_DARK = 0x5b21b6;
const LILAC = 0xc4b5fd;
const PINK = 0xf0abfc;

/** Petite texture ronde et floue, utilisée pour les lueurs (sprites et points). */
function makeGlowTexture(stops = [[0, 1], [0.25, 0.55], [1, 0]]) {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [offset, alpha] of stops) g.addColorStop(offset, `rgba(255,255,255,${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Rectangle aux coins arrondis (forme 2D à extruder). */
function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Le « F » du logo FRIDEVS : trois barres arrondies extrudées. */
function makeLogoF() {
  const group = new THREE.Group();
  const extrude = { depth: 0.42, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4, curveSegments: 16 };
  const material = new THREE.MeshPhysicalMaterial({
    color: PURPLE,
    emissive: PURPLE_DARK,
    emissiveIntensity: 0.55,
    metalness: 0.35,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  });

  const bars = [
    // [largeur, hauteur, x, y]
    [0.62, 2.9, -0.62, 0],
    [1.95, 0.62, 0.05, 1.14],
    [1.25, 0.56, -0.25, 0.05],
  ];
  for (const [w, h, x, y] of bars) {
    const geo = new THREE.ExtrudeGeometry(roundedRect(w, h, Math.min(w, h) / 2), extrude);
    geo.translate(x, y, -extrude.depth / 2);
    group.add(new THREE.Mesh(geo, material));
  }
  return group;
}

/** Constellation : points + liens entre voisins proches. */
function makeNetwork(count, glowTex) {
  const nodes = [];
  while (nodes.length < count) {
    // Répartition dans une coquille sphérique aplatie, en évitant le centre (le « F »)
    const v = new THREE.Vector3().randomDirection().multiplyScalar(2.4 + Math.random() * 1.9);
    v.y *= 0.8;
    nodes.push(v);
  }

  const edges = [];
  const neighbors = nodes.map(() => []);
  const maxDist = 1.35;
  for (let i = 0; i < count; i++) {
    const near = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < maxDist) near.push([d, j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const [, j] of near.slice(0, 3)) {
      if (neighbors[i].includes(j)) continue;
      edges.push([i, j]);
      neighbors[i].push(j);
      neighbors[j].push(i);
    }
  }

  const pointGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const pointMat = new THREE.PointsMaterial({
    color: LILAC,
    size: 0.16,
    map: glowTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pointGeo, pointMat);

  const linePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    nodes[a].toArray(linePos, k * 6);
    nodes[b].toArray(linePos, k * 6 + 3);
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: PURPLE,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  return { nodes, edges, neighbors, points, lines };
}

/** Impulsions lumineuses qui voyagent de point en point le long des liens. */
function makePulses(network, count, glowTex) {
  const { nodes, neighbors } = network;
  const pulses = [];
  for (let k = 0; k < count; k++) {
    let from = Math.floor(Math.random() * nodes.length);
    while (!neighbors[from].length) from = Math.floor(Math.random() * nodes.length);
    const to = neighbors[from][Math.floor(Math.random() * neighbors[from].length)];
    pulses.push({ from, to, t: Math.random(), speed: 0.35 + Math.random() * 0.5 });
  }
  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: PINK,
    size: 0.32,
    map: glowTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Points(geo, mat);
  const tmp = new THREE.Vector3();

  function update(dt) {
    pulses.forEach((p, k) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        // Continue sa route vers un voisin du point d'arrivée
        p.t -= 1;
        const options = neighbors[p.to].filter((n) => n !== p.from);
        p.from = p.to;
        p.to = (options.length ? options : neighbors[p.to])[Math.floor(Math.random() * (options.length || neighbors[p.to].length))];
      }
      tmp.lerpVectors(nodes[p.from], nodes[p.to], p.t).toArray(positions, k * 3);
    });
    geo.attributes.position.needsUpdate = true;
  }
  return { mesh, update };
}

/**
 * Crée la scène dans le canvas donné.
 * @param {HTMLCanvasElement} canvas
 * @param {{ mobile?: boolean, onFirstFrame?: () => void }} [options]
 */
export function initHeroScene(canvas, { mobile = false, onFirstFrame } = {}) {
  const gsap = window.gsap;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  // Lumières : ambiance + deux sources colorées + contre-jour
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.PointLight(0xa78bfa, 60, 30);
  key.position.set(4, 4, 6);
  const fill = new THREE.PointLight(PINK, 30, 30);
  fill.position.set(-5, -2, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(-2, 3, -5);
  scene.add(key, fill, rim);

  const glowTex = makeGlowTexture();
  // Halo très progressif, en mélange normal : sur un canvas transparent, l'additif marquerait un disque
  const haloTex = makeGlowTexture([[0, 0.9], [0.2, 0.5], [0.45, 0.16], [0.7, 0.04], [1, 0]]);
  const root = new THREE.Group();
  scene.add(root);

  // Le « F » et sa lueur
  const logo = makeLogoF();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloTex,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  }));
  halo.scale.setScalar(7);
  halo.position.z = -1;
  root.add(halo, logo);

  // Anneaux en orbite (rappel des cercles du design actuel)
  const ringMat = new THREE.MeshBasicMaterial({ color: PURPLE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.012, 8, 160), ringMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.008, 8, 160), ringMat);
  ring1.rotation.x = 1.15;
  ring2.rotation.set(1.35, 0.5, 0);
  root.add(ring1, ring2);

  // Réseau + impulsions
  const network = makeNetwork(mobile ? 55 : 95, glowTex);
  const pulses = makePulses(network, mobile ? 8 : 16, glowTex);
  const networkGroup = new THREE.Group();
  networkGroup.add(network.lines, network.points, pulses.mesh);
  root.add(networkGroup);

  // ---- Taille ----
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Recule la caméra sur les cadres étroits pour que tout reste visible
    camera.position.z = w / h < 1 ? 10.5 / Math.max(w / h, 0.6) : 10.5;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---- Souris ----
  const pointer = { x: 0, y: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // ---- Intro ----
  const intro = { logo: 0, net: 0 };
  const applyIntro = () => {
    const s = 0.001 + intro.logo;
    logo.scale.setScalar(s);
    logo.rotation.y = (1 - intro.logo) * -Math.PI;
    halo.material.opacity = 0.55 * intro.logo;
    ringMat.opacity = 0.35 * intro.net;
    network.points.material.opacity = 0.9 * intro.net;
    network.lines.material.opacity = 0.28 * intro.net;
    pulses.mesh.material.opacity = intro.net;
    networkGroup.scale.setScalar(0.65 + 0.35 * intro.net);
  };
  if (gsap) {
    gsap.timeline({ onUpdate: applyIntro })
      .to(intro, { logo: 1, duration: 1.6, ease: "back.out(1.4)" }, 0.1)
      .to(intro, { net: 1, duration: 2.2, ease: "power3.out" }, 0.35);
  } else {
    intro.logo = intro.net = 1;
  }
  applyIntro();

  // ---- Boucle d'animation (en pause quand le hero n'est pas visible) ----
  const clock = new THREE.Clock();
  let running = false;
  let first = true;
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!gsap) applyIntro();
    // Flottement du « F » et légère oscillation
    logo.position.y = Math.sin(t * 1.1) * 0.12;
    logo.rotation.x = Math.sin(t * 0.7) * 0.08;
    if (intro.logo >= 1) logo.rotation.y = Math.sin(t * 0.5) * 0.35;

    networkGroup.rotation.y += dt * 0.06;
    ring1.rotation.z += dt * 0.25;
    ring2.rotation.z -= dt * 0.18;
    pulses.update(dt);

    // Le tout s'oriente doucement vers la souris
    root.rotation.y += (pointer.x * 0.35 - root.rotation.y) * 0.05;
    root.rotation.x += (pointer.y * 0.22 - root.rotation.x) * 0.05;

    renderer.render(scene, camera);
    if (first) {
      first = false;
      onFirstFrame?.();
    }
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    frame();
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()));
  io.observe(canvas);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  function dispose() {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    scene.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose?.();
    });
    glowTex.dispose();
    haloTex.dispose();
    renderer.dispose();
  }

  return { start, stop, dispose, renderer };
}
