/**
 * GESTIONNAIRE DES VISUELS 3D
 *
 * Un seul moteur WebGL (hors écran) dessine toutes les scènes visibles de la page,
 * puis copie chaque image dans le <canvas> 2D de son cadre. Cela évite d'ouvrir un
 * contexte WebGL par cadre (le navigateur en limite le nombre, surtout sur mobile).
 *
 * - Seules les scènes visibles sont calculées ; tout s'arrête quand l'onglet est caché.
 * - En mode statique (animations réduites), chaque scène est dessinée une seule fois.
 */
import * as THREE from "three";
import { createScene, disposeScene } from "./scenes.js";

export async function initScenes(canvases, { staticMode = false } = {}) {
  // Les écrans dessinés utilisent les polices du site : on attend qu'elles soient prêtes
  try {
    await document.fonts.ready;
  } catch {}

  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.autoClear = false;
  let bufW = 1;
  let bufH = 1;

  const slots = [];
  const clock = new THREE.Clock();

  for (const canvas of canvases) {
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    const host = canvas.parentElement;
    let built;
    try {
      built = createScene(canvas.dataset.scene, {
        label: canvas.dataset.label || undefined,
        tag: canvas.dataset.tag || undefined,
        accent: canvas.dataset.accent || undefined,
      });
    } catch (err) {
      console.warn(err);
      continue;
    }
    const slot = { canvas, ctx, host, ...built, w: 0, h: 0, visible: false, shown: false, dirty: true, pointer: { x: 0, y: 0 }, offset: Math.random() * 10 };

    // Inclinaison au survol : on écoute le cadre (les calques par-dessus laissent remonter l'événement)
    const target = canvas.closest("a, .scene3d-host") || host;
    target.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      slot.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      slot.pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    }, { passive: true });
    target.addEventListener("pointerleave", () => {
      slot.pointer.x = 0;
      slot.pointer.y = 0;
    });
    slots.push(slot);
  }

  function measure(slot) {
    const w = Math.round(slot.canvas.clientWidth * dpr);
    const h = Math.round(slot.canvas.clientHeight * dpr);
    if (!w || !h || (w === slot.w && h === slot.h)) return;
    slot.w = slot.canvas.width = w;
    slot.h = slot.canvas.height = h;
    const aspect = w / h;
    const cam = slot.camera;
    cam.aspect = aspect;
    // Recule la caméra pour que l'objet tienne en largeur comme en hauteur
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const dist = Math.max(slot.radius / tanHalf, slot.radius / (tanHalf * aspect));
    cam.position.set(0, 0, dist * 1.05);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    slot.dirty = true;
  }

  function draw(slot, t, dt) {
    if (!slot.w || !slot.h) return;
    if (slot.w > bufW || slot.h > bufH) {
      bufW = Math.max(bufW, slot.w);
      bufH = Math.max(bufH, slot.h);
      renderer.setSize(bufW, bufH, false);
    }
    slot.update(t + slot.offset, dt, slot.pointer);
    renderer.setViewport(0, 0, slot.w, slot.h);
    renderer.setScissor(0, 0, slot.w, slot.h);
    renderer.setScissorTest(true);
    renderer.clear();
    renderer.render(slot.scene, slot.camera);
    // WebGL dessine depuis le bas : la zone utile est en bas du tampon
    slot.ctx.clearRect(0, 0, slot.w, slot.h);
    slot.ctx.drawImage(renderer.domElement, 0, bufH - slot.h, slot.w, slot.h, 0, 0, slot.w, slot.h);
    slot.dirty = false;
    if (!slot.shown) {
      slot.shown = true;
      slot.host.classList.add("is-3d");
    }
  }

  // Taille et visibilité
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const slot = slots.find((s) => s.canvas === e.target);
      if (slot) measure(slot);
    }
    if (staticMode) renderStatic();
  });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const slot = slots.find((s) => s.canvas === e.target);
      if (slot) slot.visible = e.isIntersecting;
    }
    if (staticMode) renderStatic();
  }, { rootMargin: "100px" });
  for (const s of slots) {
    measure(s);
    ro.observe(s.canvas);
    io.observe(s.canvas);
  }

  // Mode statique : une image par scène, redessinée seulement si sa taille change
  function renderStatic() {
    for (const s of slots) if (s.visible && s.dirty) draw(s, 2.5, 0);
  }
  if (staticMode) return;

  // Animation
  let raf = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    for (const s of slots) if (s.visible) draw(s, t, dt);
  }
  function start() {
    if (!raf) {
      clock.getDelta();
      loop();
    }
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  renderer.domElement.addEventListener("webglcontextlost", () => {
    stop();
    for (const s of slots) {
      s.host.classList.remove("is-3d");
      disposeScene(s.scene);
    }
  });
  start();
}
