/**
 * SCÈNES 3D DES VISUELS (réalisations, études de cas, à propos)
 *
 * Chaque fabrique renvoie { scene, camera, radius, update(t, dt, pointer) }.
 * Les écrans (site, app, code) sont dessinés une seule fois dans un canvas 2D,
 * puis animés en faisant glisser la texture : aucun redessin à chaque image.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const FONT = '"DM Sans Variable", "Inter Variable", system-ui, sans-serif';
const PURPLE = "#8b5cf6";

/* ------------------------------------------------------------------ */
/* Outils de dessin 2D                                                 */
/* ------------------------------------------------------------------ */

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function box(ctx, x, y, w, h, r, fill) {
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function text(ctx, str, x, y, size, color, weight = 700, align = "left") {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(str, x, y);
}

/** Ligne de « texte » schématique (barre arrondie). */
function bar(ctx, x, y, w, h, color) {
  box(ctx, x, y, w, h, h / 2, color);
}

function star(ctx, cx, cy, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r * 0.45 : r;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function mix(hex, toward, amount) {
  const a = new THREE.Color(hex);
  return "#" + a.lerp(new THREE.Color(toward), amount).getHexString();
}

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Texture « fenêtre » : n'affiche que la moitié haute, puis on la fait défiler. */
function scrollingTexture(w, h, draw) {
  const tex = canvasTexture(w, h, draw);
  tex.repeat.set(1, 0.5);
  tex.offset.set(0, 0.5);
  return tex;
}

/** Va-et-vient doux entre 0 et 1, avec des pauses aux extrémités. */
function pingPong(t, period) {
  const p = (t % period) / period;
  const s = Math.min(Math.max((Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2 * 1.3 - 0.15, 0), 1);
  return s * s * (3 - 2 * s);
}

/* ------------------------------------------------------------------ */
/* Base commune : éclairage, caméra, inclinaison au survol              */
/* ------------------------------------------------------------------ */

function baseScene(accent) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 6);
  const tint = new THREE.PointLight(new THREE.Color(accent), 25, 20);
  tint.position.set(-4, 1, 3);
  const rim = new THREE.PointLight(0xa78bfa, 20, 20);
  rim.position.set(3, -2, -3);
  scene.add(key, tint, rim);
  const rig = new THREE.Group();
  scene.add(rig);
  return { scene, camera, rig };
}

function tilt(rig, pointer, baseX = 0, baseY = 0, amount = 0.25) {
  rig.rotation.y += (baseY + pointer.x * amount - rig.rotation.y) * 0.06;
  rig.rotation.x += (baseX + pointer.y * amount * 0.6 - rig.rotation.x) * 0.06;
}

/** Petites formes brillantes qui flottent autour de l'objet principal. */
function floaters(rig, colors, spots) {
  const geos = [
    new THREE.IcosahedronGeometry(0.22, 0),
    new THREE.TorusGeometry(0.18, 0.07, 12, 32),
    new THREE.OctahedronGeometry(0.2, 0),
    new RoundedBoxGeometry(0.3, 0.3, 0.3, 3, 0.07),
    new THREE.SphereGeometry(0.16, 24, 16),
  ];
  return spots.map(([x, y, z], i) => {
    const m = new THREE.Mesh(
      geos[i % geos.length],
      new THREE.MeshStandardMaterial({ color: colors[i % colors.length], metalness: 0.3, roughness: 0.25, emissive: colors[i % colors.length], emissiveIntensity: 0.15 })
    );
    m.position.set(x, y, z);
    m.userData = { y, speed: 0.6 + (i % 3) * 0.25, phase: i * 1.7 };
    rig.add(m);
    return m;
  });
}

function animateFloaters(list, t) {
  for (const m of list) {
    m.position.y = m.userData.y + Math.sin(t * m.userData.speed + m.userData.phase) * 0.12;
    m.rotation.x += 0.008;
    m.rotation.y += 0.012;
  }
}

/* ------------------------------------------------------------------ */
/* 1. NAVIGATEUR — site vitrine d'un client                             */
/* ------------------------------------------------------------------ */

function drawWebsite(ctx, W, H, { label, tag, accent }) {
  const dark = "#0f172a";
  const grey = "#cbd5e1";
  const light = mix(accent, "#ffffff", 0.85);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, W, H);

  // Barre de navigation
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, 70);
  box(ctx, 32, 18, 34, 34, 9, accent);
  text(ctx, label, 80, 46, 26, dark, 800);
  [0, 1, 2].forEach((i) => bar(ctx, 430 + i * 82, 30, 60, 10, grey));
  box(ctx, 680, 20, 108, 32, 16, accent);
  bar(ctx, 702, 32, 64, 8, "#ffffff");

  // Hero
  const heroH = 436;
  const g = ctx.createLinearGradient(0, 70, W, heroH);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, light);
  ctx.fillStyle = g;
  ctx.fillRect(0, 70, W, heroH - 70);
  text(ctx, (tag || "").toUpperCase(), 40, 140, 18, accent, 800);
  text(ctx, label, 38, 205, label.length > 9 ? 54 : 64, dark, 800);
  bar(ctx, 40, 238, 330, 14, grey);
  bar(ctx, 40, 264, 270, 14, grey);
  bar(ctx, 40, 290, 300, 14, grey);
  box(ctx, 40, 330, 170, 52, 26, accent);
  bar(ctx, 72, 352, 106, 10, "#ffffff");
  box(ctx, 226, 330, 150, 52, 26, "#ffffff");
  rr(ctx, 226, 330, 150, 52, 26);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Illustration du hero
  const ix = 430, iy = 100, iw = 360, ih = 300;
  const ig = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
  ig.addColorStop(0, accent);
  ig.addColorStop(1, mix(accent, "#000000", 0.45));
  box(ctx, ix, iy, iw, ih, 22, ig);
  ctx.save();
  rr(ctx, ix, iy, iw, ih, 22);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(ix + 270, iy + 80, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(ix - 20, iy + ih);
  ctx.lineTo(ix + 120, iy + 130);
  ctx.lineTo(ix + 250, iy + ih);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.moveTo(ix + 140, iy + ih);
  ctx.lineTo(ix + 270, iy + 170);
  ctx.lineTo(ix + iw + 40, iy + ih);
  ctx.fill();
  ctx.restore();

  // Section services : 3 cartes
  const sy = heroH + 50;
  text(ctx, "Nos services", W / 2, sy + 20, 30, dark, 800, "center");
  bar(ctx, W / 2 - 120, sy + 40, 240, 10, grey);
  [0, 1, 2].forEach((i) => {
    const x = 40 + i * 250;
    box(ctx, x, sy + 80, 230, 200, 18, "#ffffff");
    box(ctx, x + 24, sy + 104, 52, 52, 26, light);
    box(ctx, x + 38, sy + 118, 24, 24, 6, accent);
    bar(ctx, x + 24, sy + 180, 140, 14, dark);
    bar(ctx, x + 24, sy + 208, 180, 9, grey);
    bar(ctx, x + 24, sy + 228, 160, 9, grey);
    bar(ctx, x + 24, sy + 248, 120, 9, grey);
  });

  // Bandeau + pied de page
  box(ctx, 40, sy + 310, W - 80, 90, 18, accent);
  [0, 1, 2].forEach((i) => bar(ctx, 90 + i * 240, sy + 348, 140, 14, "rgba(255,255,255,0.85)"));
  ctx.fillStyle = dark;
  ctx.fillRect(0, H - 76, W, 76);
  bar(ctx, 40, H - 44, 160, 10, "#475569");
  bar(ctx, W - 240, H - 44, 200, 10, "#475569");
}

function websiteScene({ label = "Client", tag = "Site vitrine", accent = PURPLE }) {
  const { scene, camera, rig } = baseScene(accent);
  const W = 820, H = 1012;
  const tex = scrollingTexture(W, H, (ctx) => drawWebsite(ctx, W, H, { label, tag, accent }));

  const frame = new THREE.Mesh(
    new RoundedBoxGeometry(3.3, 2.32, 0.1, 4, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.5, roughness: 0.35 })
  );
  const topBar = new THREE.Mesh(new THREE.PlaneGeometry(3.16, 0.2), new THREE.MeshBasicMaterial({ color: 0x334155 }));
  topBar.position.set(0, 1.03, 0.052);
  ["#f87171", "#fbbf24", "#34d399"].forEach((c, i) => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), new THREE.MeshBasicMaterial({ color: c }));
    dot.position.set(-1.46 + i * 0.1, 1.03, 0.054);
    frame.add(dot);
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.16, 1.95), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.set(0, -0.1, 0.053);
  frame.add(topBar, screen);
  rig.add(frame);

  // Version mobile du site, posée devant (rappel « responsive »)
  const mini = new THREE.Group();
  const miniBody = new THREE.Mesh(new RoundedBoxGeometry(0.62, 1.2, 0.07, 4, 0.08), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.6, roughness: 0.3 }));
  const miniTex = tex.clone();
  miniTex.repeat.set(0.5, 0.48);
  miniTex.offset.set(0.02, 0.52);
  miniTex.needsUpdate = true;
  const miniScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 1.1), new THREE.MeshBasicMaterial({ map: miniTex, toneMapped: false }));
  miniScreen.position.z = 0.037;
  mini.add(miniBody, miniScreen);
  mini.position.set(1.55, -0.65, 0.45);
  mini.rotation.y = -0.35;
  rig.add(mini);

  const shapes = floaters(rig, [accent, PURPLE, "#f0abfc"], [[-1.85, 1.0, 0.4], [-1.7, -1.05, 0.6], [1.9, 1.1, -0.2]]);

  return {
    scene,
    camera,
    radius: 2.15,
    update(t, dt, pointer) {
      const p = pingPong(t, 9);
      tex.offset.y = 0.5 * (1 - p);
      miniTex.offset.y = 0.52 * (1 - p);
      rig.position.y = Math.sin(t * 0.8) * 0.05;
      mini.position.y = -0.65 + Math.sin(t * 1.1 + 1) * 0.06;
      tilt(rig, pointer, 0.05, -0.18 + Math.sin(t * 0.35) * 0.12);
      animateFloaters(shapes, t);
    },
  };
}

/* ------------------------------------------------------------------ */
/* 2. TÉLÉPHONE — application mobile (plomberie)                        */
/* ------------------------------------------------------------------ */

function drawPhoneApp(ctx, W, H, { label, accent }) {
  const dark = "#0f172a";
  const grey = "#cbd5e1";
  const light = mix(accent, "#ffffff", 0.86);
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, W, H);

  // Barre d'état + en-tête
  text(ctx, "9:41", 34, 44, 22, dark, 700);
  bar(ctx, W - 110, 30, 26, 12, dark);
  bar(ctx, W - 76, 30, 44, 12, dark);
  text(ctx, label, 32, 110, 22, accent, 800);
  text(ctx, "Besoin d'un", 32, 158, 38, dark, 800);
  text(ctx, "plombier ?", 32, 202, 38, dark, 800);
  box(ctx, W - 92, 80, 60, 60, 30, light);
  box(ctx, W - 76, 96, 28, 28, 14, accent);

  // Recherche
  box(ctx, 32, 232, W - 64, 62, 31, "#ffffff");
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(70, 263, 11, 0, Math.PI * 2);
  ctx.stroke();
  bar(ctx, 98, 257, 180, 12, grey);

  // Carte
  const my = 320, mh = 330;
  box(ctx, 32, my, W - 64, mh, 24, "#e2e8f0");
  ctx.save();
  rr(ctx, 32, my, W - 64, mh, 24);
  ctx.clip();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 14;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, my + 40 + i * 70);
    ctx.lineTo(W, my + 10 + i * 70 + 40);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(60 + i * 110, my);
    ctx.lineTo(40 + i * 110, my + mh);
    ctx.stroke();
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(90, my + 270);
  ctx.bezierCurveTo(160, my + 200, 230, my + 230, 300, my + 110);
  ctx.stroke();
  ctx.setLineDash([]);
  [[90, my + 270, dark], [300, my + 110, accent]].forEach(([x, y, c]) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Catégories
  const chips = ["Fuite", "WC", "Chauffe-eau", "Évier"];
  let cx = 32;
  chips.forEach((c, i) => {
    ctx.font = `700 20px ${FONT}`;
    const w = ctx.measureText(c).width + 40;
    box(ctx, cx, 680, w, 48, 24, i === 0 ? accent : "#ffffff");
    text(ctx, c, cx + 20, 711, 20, i === 0 ? "#ffffff" : dark, 700);
    cx += w + 12;
  });

  // Liste de plombiers
  text(ctx, "Plombiers disponibles", 32, 790, 26, dark, 800);
  for (let i = 0; i < 5; i++) {
    const y = 820 + i * 150;
    box(ctx, 32, y, W - 64, 130, 22, "#ffffff");
    box(ctx, 54, y + 25, 80, 80, 40, i % 2 ? light : mix(accent, "#ffffff", 0.7));
    box(ctx, 78, y + 45, 32, 32, 16, accent);
    bar(ctx, 154, y + 36, 150, 16, dark);
    for (let s = 0; s < 5; s++) star(ctx, 162 + s * 24, y + 78, 9, s < 4 ? "#f59e0b" : grey);
    bar(ctx, 154, y + 98, 90, 10, grey);
    box(ctx, W - 132, y + 44, 78, 42, 21, light);
    bar(ctx, W - 116, y + 61, 46, 8, accent);
  }

  // Bouton d'action
  box(ctx, 32, H - 110, W - 64, 76, 38, accent);
  text(ctx, "Réserver une intervention", W / 2, H - 62, 24, "#ffffff", 800, "center");
}

function phoneScene({ label = "Plomberie", accent = "#2563eb" }) {
  const { scene, camera, rig } = baseScene(accent);
  const W = 420, H = 1750;
  const tex = scrollingTexture(W, H, (ctx) => drawPhoneApp(ctx, W, H, { label, accent }));

  const phone = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(1.32, 2.7, 0.14, 6, 0.2),
    new THREE.MeshPhysicalMaterial({ color: 0x111827, metalness: 0.7, roughness: 0.25, clearcoat: 1 })
  );
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.56), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.z = 0.072;
  const notch = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.08, 0.02, 2, 0.04), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  notch.position.set(0, 1.2, 0.08);
  phone.add(body, screen, notch);
  rig.add(phone);

  // Repère de carte en 3D qui rebondit
  const pin = new THREE.Group();
  const pinMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(accent), metalness: 0.2, roughness: 0.3, emissive: new THREE.Color(accent), emissiveIntensity: 0.25 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), pinMat);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.36, 32), pinMat);
  tip.rotation.x = Math.PI;
  tip.position.y = -0.22;
  const hole = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  hole.position.z = 0.15;
  head.add(hole);
  pin.add(head, tip);
  pin.position.set(1.05, 0.55, 0.45);
  rig.add(pin);

  // Bulle de notification
  const bubbleTex = canvasTexture(512, 150, (ctx) => {
    box(ctx, 0, 0, 512, 150, 40, "#ffffff");
    box(ctx, 26, 30, 90, 90, 45, accent);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(50, 76);
    ctx.lineTo(66, 92);
    ctx.lineTo(94, 60);
    ctx.stroke();
    text(ctx, "Intervention confirmée", 140, 68, 30, "#0f172a", 800);
    bar(ctx, 140, 92, 220, 14, "#cbd5e1");
  });
  const bubble = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.43), new THREE.MeshBasicMaterial({ map: bubbleTex, transparent: true, toneMapped: false }));
  bubble.position.set(-0.9, -0.75, 0.55);
  rig.add(bubble);

  const shapes = floaters(rig, [accent, PURPLE, "#f0abfc"], [[-1.15, 1.05, -0.2], [1.2, -0.95, 0.1]]);

  return {
    scene,
    camera,
    radius: 1.75,
    update(t, dt, pointer) {
      tex.offset.y = 0.5 * (1 - pingPong(t, 8));
      phone.position.y = Math.sin(t * 0.9) * 0.06;
      pin.position.y = 0.55 + Math.abs(Math.sin(t * 2.2)) * 0.25;
      pin.rotation.y += dt * 1.2;
      bubble.position.y = -0.75 + Math.sin(t * 1.3 + 2) * 0.06;
      bubble.material.opacity = 0.6 + 0.4 * Math.max(0, Math.sin(t * 0.8));
      tilt(rig, pointer, 0.04, Math.sin(t * 0.45) * 0.3, 0.35);
      animateFloaters(shapes, t);
    },
  };
}

/* ------------------------------------------------------------------ */
/* 3. TABLEAU DE BORD — CRM / outil métier                              */
/* ------------------------------------------------------------------ */

function drawDashboard(ctx, W, H, { label, accent }) {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  // Barre latérale
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, 190, H);
  box(ctx, 28, 30, 40, 40, 12, accent);
  text(ctx, label, 80, 60, 24, "#ffffff", 800);
  ["Accueil", "Clients", "Ventes", "Relances", "Rapports"].forEach((m, i) => {
    if (i === 1) box(ctx, 16, 108 + i * 58, 158, 44, 12, "rgba(139,92,246,0.25)");
    box(ctx, 30, 120 + i * 58, 20, 20, 6, i === 1 ? accent : "#475569");
    text(ctx, m, 62, 137 + i * 58, 20, i === 1 ? "#ffffff" : "#94a3b8", 600);
  });
  // En-tête
  text(ctx, "Tableau de bord", 225, 66, 30, "#ffffff", 800);
  box(ctx, W - 250, 34, 210, 44, 22, "#1e293b");
  bar(ctx, W - 225, 52, 120, 9, "#475569");
  // Cartes indicateurs
  ["Prospects", "Clients", "Relances"].forEach((k, i) => {
    const x = 225 + i * 262;
    box(ctx, x, 104, 240, 110, 18, "#1e293b");
    text(ctx, k, x + 22, 142, 20, "#94a3b8", 600);
    bar(ctx, x + 22, 162, 110 + i * 20, 26, i === 0 ? accent : i === 1 ? "#34d399" : "#f472b6");
  });
  // Zones des graphiques (les éléments 3D viennent se poser dessus)
  box(ctx, 225, 236, 500, 400, 18, "#1e293b");
  box(ctx, 745, 236, 240, 400, 18, "#1e293b");
  for (let i = 0; i < 5; i++) bar(ctx, 250, 290 + i * 70, 450, 2, "#334155");
  bar(ctx, 770, 270, 120, 12, "#94a3b8");
}

function dashboardScene({ label = "CRM", accent = PURPLE }) {
  const { scene, camera, rig } = baseScene(accent);
  const W = 1024, H = 660;
  const tex = canvasTexture(W, H, (ctx) => drawDashboard(ctx, W, H, { label, accent }));

  // Plateau incliné vers l'arrière
  const board = new THREE.Group();
  board.rotation.x = -0.95;
  rig.add(board);
  const pw = 3.6, ph = pw * (H / W);
  const panel = new THREE.Mesh(new RoundedBoxGeometry(pw + 0.12, ph + 0.12, 0.08, 4, 0.06), new THREE.MeshStandardMaterial({ color: 0x0b0e14, metalness: 0.5, roughness: 0.4 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  face.position.z = 0.041;
  panel.add(face);
  board.add(panel);

  // Coordonnées texture -> plateau
  const u = (px) => (px / W - 0.5) * pw;
  const v = (py) => (0.5 - py / H) * ph;

  // Histogramme 3D
  const bars = [];
  const colors = [accent, "#a78bfa", "#34d399", accent, "#f472b6", "#a78bfa"];
  for (let i = 0; i < 6; i++) {
    const geo = new RoundedBoxGeometry(0.17, 1, 0.17, 2, 0.03);
    geo.translate(0, 0.5, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.25, roughness: 0.3, emissive: colors[i], emissiveIntensity: 0.2 }));
    m.rotation.x = Math.PI / 2; // « debout » par rapport au plateau
    m.position.set(u(270 + i * 75), v(600), 0.05);
    m.userData.phase = i * 0.8;
    board.add(m);
    bars.push(m);
  }

  // Courbe de tendance qui se dessine
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const x = 260 + i * 36;
    const y = 520 - i * 18 - Math.sin(i * 0.9) * 40;
    pts.push(new THREE.Vector3(u(x), v(y), 0.75 + Math.sin(i * 0.6) * 0.05));
  }
  const tubeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.025, 8, false);
  const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xf0abfc, toneMapped: false }));
  board.add(tube);
  const tubeCount = tubeGeo.index.count;

  // Anneau (répartition)
  const donut = new THREE.Group();
  const parts = [[0.45, accent], [0.3, "#34d399"], [0.25, "#f472b6"]];
  let start = 0;
  for (const [share, color] of parts) {
    const arc = share * Math.PI * 2 - 0.06;
    const seg = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.1, 16, 64, arc),
      new THREE.MeshStandardMaterial({ color, metalness: 0.25, roughness: 0.3, emissive: color, emissiveIntensity: 0.2 })
    );
    seg.rotation.z = start;
    donut.add(seg);
    start += share * Math.PI * 2;
  }
  donut.position.set(u(865), v(455), 0.16);
  board.add(donut);

  // Fiches « contact » qui flottent au-dessus
  const cardTex = canvasTexture(400, 140, (ctx) => {
    box(ctx, 0, 0, 400, 140, 30, "#1e293b");
    box(ctx, 24, 30, 80, 80, 40, accent);
    box(ctx, 46, 46, 36, 36, 18, "rgba(255,255,255,0.85)");
    bar(ctx, 124, 42, 190, 18, "#ffffff");
    bar(ctx, 124, 78, 140, 12, "#94a3b8");
    box(ctx, 330, 50, 46, 40, 14, "#34d399");
  });
  const cards = [[-1.55, 0.95, 0.5], [1.5, 1.05, 0.2]].map(([x, y, z], i) => {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.385), new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, toneMapped: false }));
    c.position.set(x, y, z);
    c.userData = { y, phase: i * 2 };
    rig.add(c);
    return c;
  });

  return {
    scene,
    camera,
    radius: 2.1,
    update(t, dt, pointer) {
      bars.forEach((b) => {
        const h = 0.35 + 0.85 * (0.5 + 0.5 * Math.sin(t * 1.1 + b.userData.phase));
        b.scale.y = h;
      });
      const grow = Math.min(1, (t % 6) / 3);
      tubeGeo.setDrawRange(0, Math.floor((grow * tubeCount) / 3) * 3);
      donut.rotation.z = t * 0.4;
      cards.forEach((c) => (c.position.y = c.userData.y + Math.sin(t * 1.2 + c.userData.phase) * 0.07));
      tilt(rig, pointer, 0.1, Math.sin(t * 0.3) * 0.2, 0.3);
    },
  };
}

/* ------------------------------------------------------------------ */
/* 4. ORDINATEUR — l'agence (page À propos)                             */
/* ------------------------------------------------------------------ */

function drawCode(ctx, W, H) {
  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(0, 0, W, H);
  const colors = ["#c084fc", "#60a5fa", "#34d399", "#f472b6", "#fbbf24", "#94a3b8"];
  let y = 40;
  let seed = 7;
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  let indent = 0;
  for (let line = 0; y < H - 20; line++) {
    text(ctx, String(line + 1).padStart(2, " "), 18, y + 12, 16, "#334155", 600);
    if (line % 6 === 0) indent = 0;
    let x = 70 + indent * 34;
    const tokens = 2 + Math.floor(rand() * 4);
    for (let k = 0; k < tokens; k++) {
      const w = 30 + rand() * 120;
      bar(ctx, x, y, w, 14, colors[Math.floor(rand() * colors.length)]);
      x += w + 14;
    }
    indent = Math.min(3, indent + (rand() > 0.55 ? 1 : rand() > 0.5 ? -1 : 0));
    indent = Math.max(0, indent);
    y += 34;
  }
}

function laptopScene({ accent = PURPLE }) {
  const { scene, camera, rig } = baseScene(accent);
  const W = 800, H = 1000;
  const tex = scrollingTexture(W, H, (ctx) => drawCode(ctx, W, H));
  const metal = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, metalness: 0.75, roughness: 0.3 });

  const laptop = new THREE.Group();
  const base = new THREE.Mesh(new RoundedBoxGeometry(3.1, 0.12, 2.05, 4, 0.05), metal);
  const keys = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 1.0),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(520, 200, (ctx) => {
        ctx.fillStyle = "#1f2430";
        ctx.fillRect(0, 0, 520, 200);
        for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) box(ctx, 8 + c * 36.6, 8 + r * 38, 31, 32, 5, "#0f131b");
      }),
    })
  );
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, 0.062, -0.3);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ color: 0x1f2430 }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.062, 0.6);
  laptop.add(base, keys, pad);

  // Écran articulé à l'arrière de la base
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -1.0);
  hinge.rotation.x = -0.28;
  const lid = new THREE.Mesh(new RoundedBoxGeometry(3.1, 2.0, 0.08, 4, 0.05), metal);
  lid.position.y = 1.0;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.8), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.set(0, 1.0, 0.042);
  hinge.add(lid, screen);
  laptop.add(hinge);
  laptop.position.y = -0.6;
  rig.add(laptop);

  // Symboles « code » en sprites
  const glyph = (str, color) =>
    new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTexture(256, 160, (ctx) => text(ctx, str, 128, 115, 110, color, 800, "center")),
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      })
    );
  const g1 = glyph("</>", "#c084fc");
  g1.scale.set(0.9, 0.56, 1);
  g1.position.set(-1.75, 1.15, 0.4);
  const g2 = glyph("{ }", "#60a5fa");
  g2.scale.set(0.75, 0.47, 1);
  g2.position.set(1.8, 1.25, 0.2);
  rig.add(g1, g2);

  const shapes = floaters(rig, [accent, "#60a5fa", "#f0abfc", "#34d399"], [[-1.9, -0.2, 0.6], [1.95, 0.1, 0.6], [-1.2, 1.75, -0.3], [1.1, 1.85, -0.4]]);

  return {
    scene,
    camera,
    radius: 2.2,
    update(t, dt, pointer) {
      tex.offset.y = 0.5 * (1 - pingPong(t, 10));
      g1.position.y = 1.15 + Math.sin(t * 1.1) * 0.1;
      g2.position.y = 1.25 + Math.sin(t * 0.9 + 1.5) * 0.1;
      tilt(rig, pointer, 0.32, -0.35 + Math.sin(t * 0.3) * 0.25, 0.3);
      animateFloaters(shapes, t);
    },
  };
}

/* ------------------------------------------------------------------ */

const FACTORIES = { website: websiteScene, phone: phoneScene, dashboard: dashboardScene, laptop: laptopScene };

/** Crée la scène demandée. */
export function createScene(type, options) {
  const factory = FACTORIES[type];
  if (!factory) throw new Error(`Scène 3D inconnue : ${type}`);
  return factory(options);
}

/** Libère la mémoire GPU d'une scène. */
export function disposeScene(scene) {
  scene.traverse((o) => {
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      m.map?.dispose();
      m.dispose();
    }
  });
}
