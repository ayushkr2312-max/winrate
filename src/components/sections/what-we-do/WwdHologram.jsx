import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion, isMobileViewport } from "@/lib/device";

/* ─── accent colours ─────────────────────────────────────────────── */
export const PILLAR_ACCENTS = [0xb6ff1e, 0xb6ff1e, 0x66e8ff, 0xffb547];
const PILLAR_IDS = ["experience", "technical", "network", "custom"];

/* ─── per-pillar schematic definitions ───────────────────────────────
   Every node has:
     x, y      — 2-D flat position
     z3d       — how far it pops toward the camera on hover
     label     — shown as a CSS overlay label
     sub       — smaller sub-label (role / type)
     isHub     — uses icosahedron, slightly larger
     shape     — "icosa" | "octa" | "box" | "dodeca"
   Links reference node ids.                                        */
const DEFS = {
  experience: {
    schemaLabel: "CTX.GRAPH",
    nodes: [
      { id: 0, label: "CONTEXT",    sub: "Core layer",  isHub: true,  shape: "icosa",  x:  0.00, y:  0.00, z3d: 0.85 },
      { id: 1, label: "ORG REALITY", sub: "Signal 01",  isHub: false, shape: "octa",   x: -1.10, y:  0.90, z3d: 1.25 },
      { id: 2, label: "BUDGET",      sub: "Signal 02",  isHub: false, shape: "octa",   x:  1.10, y:  0.90, z3d: 0.95 },
      { id: 3, label: "HANDS-ON",    sub: "Signal 03",  isHub: false, shape: "dodeca", x:  0.00, y: -1.15, z3d: 0.50 },
    ],
    links: [[0,1],[0,2],[0,3]],
  },
  technical: {
    schemaLabel: "BLD.PIPELINE",
    nodes: [
      { id: 0, label: "INPUT",      sub: "Manual ops",  isHub: false, shape: "box",    x: -1.80, y:  0.00, z3d: 0.00 },
      { id: 1, label: "AUTOMATE",   sub: "Signal 01",   isHub: false, shape: "box",    x: -0.60, y:  0.00, z3d: 0.72 },
      { id: 2, label: "DASHBOARD",  sub: "Signal 02",   isHub: false, shape: "box",    x:  0.60, y:  0.00, z3d: 1.28 },
      { id: 3, label: "TOOLING",    sub: "Output",      isHub: false, shape: "box",    x:  1.80, y:  0.00, z3d: 0.58 },
    ],
    links: [[0,1],[1,2],[2,3]],
  },
  network: {
    schemaLabel: "NET.HUB",
    nodes: [
      { id: 0, label: "ACCESS",    sub: "Core layer",  isHub: true,  shape: "icosa",  x:  0.00, y:  0.00, z3d: 0.90 },
      { id: 1, label: "TALENT",    sub: "Signal 01",   isHub: false, shape: "octa",   x:  0.00, y:  1.40, z3d: 0.45 },
      { id: 2, label: "VENDORS",   sub: "Signal 02",   isHub: false, shape: "octa",   x:  1.33, y:  0.43, z3d: 0.88 },
      { id: 3, label: "VALUE",     sub: "Signal 03",   isHub: false, shape: "octa",   x:  0.82, y: -1.15, z3d: 0.38 },
      { id: 4, label: "ROUTING",   sub: "Output",      isHub: false, shape: "octa",   x: -0.82, y: -1.15, z3d: 0.65 },
      { id: 5, label: "SOURCING",  sub: "Output",      isHub: false, shape: "octa",   x: -1.33, y:  0.43, z3d: 0.28 },
    ],
    links: [[0,1],[0,2],[0,3],[0,4],[0,5]],
  },
  custom: {
    schemaLabel: "SCP.MODULES",
    nodes: [
      { id: 0, label: "FLEXIBLE",  sub: "Signal 01",   isHub: false, shape: "box",    x: -1.20, y:  0.50, z3d: 0.40 },
      { id: 1, label: "DELIVERY",  sub: "Signal 02",   isHub: true,  shape: "box",    x:  0.00, y: -0.55, z3d: 1.10 },
      { id: 2, label: "ITERATE",   sub: "Signal 03",   isHub: false, shape: "box",    x:  1.20, y:  0.50, z3d: 0.40 },
    ],
    links: [[0,1],[1,2],[0,2]],
  },
};

/* ─── helpers ────────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const ss   = t => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };

function makeNodeGeo(shape, sz) {
  switch (shape) {
    case "box":    return new THREE.BoxGeometry(sz, sz, sz, 2, 2, 2);
    case "icosa":  return new THREE.IcosahedronGeometry(sz * 0.88, 1);
    case "dodeca": return new THREE.DodecahedronGeometry(sz * 0.82, 0);
    case "octa":
    default:       return new THREE.OctahedronGeometry(sz * 0.88, 1);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function WwdHologram({ activePillar = 0 }) {
  const hostRef    = useRef(null);
  const canvasRef  = useRef(null);
  const overlayRef = useRef(null);
  const activeRef  = useRef(activePillar);

  useEffect(() => { activeRef.current = activePillar; }, [activePillar]);

  useEffect(() => {
    const host    = hostRef.current;
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    if (!host || !canvas || !overlay) return;

    if (prefersReducedMotion() || isMobileViewport()) {
      host.dataset.mode = "fallback";
      return;
    }
    host.dataset.mode = "webgl";

    /* ── renderer ────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true, powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    /* ── scene & camera ──────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60);
    camera.position.set(0, 0, 9);

    /* ── lights ──────────────────────────────────────────────── */
    const ambient  = new THREE.AmbientLight(0x08101e, 5);
    const keyLight = new THREE.PointLight(0xb6ff1e, 0, 28);
    keyLight.position.set(2.5, 2.2, 5);
    const fill     = new THREE.PointLight(0x66e8ff, 0, 22);
    fill.position.set(-2.5, -1.5, 3);
    scene.add(ambient, keyLight, fill);

    /* ── floor grid (3D mode only) ───────────────────────────── */
    const grid = new THREE.GridHelper(10, 18, 0x66e8ff, 0x66e8ff);
    grid.material.transparent = true;
    grid.material.opacity = 0;
    grid.position.y = -2.1;
    scene.add(grid);

    /* ── scan ring (3D mode only) ────────────────────────────── */
    const scanGeo = new THREE.TorusGeometry(2.08, 0.009, 8, 72);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0xb6ff1e, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const scanRing = new THREE.Mesh(scanGeo, scanMat);
    scanRing.rotation.x = Math.PI * 0.5;
    scene.add(scanRing);

    /* ── mutable scene state ─────────────────────────────────── */
    let schemaGroup = null;
    let nodeRecs    = [];  // { wireMesh, solidMesh, wireMat, solidMat, x, y, z3d, curZ, isHub }
    let linkRecs    = [];  // { line, geo, mat, aIdx, bIdx }
    let labelEls    = [];  // DOM elements
    let lastPillar  = -1;
    let groupScale  = 0.001;

    /* ── hover / tilt state ──────────────────────────────────── */
    let hoverProg   = 0;
    let hoverTarget = 0;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    /* ── cached canvas dimensions ────────────────────────────── */
    let cw = 1, ch = 1;

    /* ── events ──────────────────────────────────────────────── */
    const onEnter = () => { hoverTarget = 1; host.dataset.hovered = "1"; };
    const onLeave = () => { hoverTarget = 0; tilt.tx = 0; tilt.ty = 0; host.dataset.hovered = "0"; };
    const onMove  = (e) => {
      const r = host.getBoundingClientRect();
      tilt.tx = ((e.clientX - r.left) / r.width)  * 2 - 1;
      tilt.ty = -((e.clientY - r.top)  / r.height) * 2 + 1;
    };
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);
    host.addEventListener("mousemove",  onMove, { passive: true });

    /* ── resize ──────────────────────────────────────────────── */
    const resize = () => {
      const r = host.getBoundingClientRect();
      cw = Math.max(1, r.width);
      ch = Math.max(1, r.height);
      renderer.setSize(cw, ch, false);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ── visibility ──────────────────────────────────────────── */
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 },
    );
    io.observe(host);

    /* ── reusable vector for projection ──────────────────────── */
    const tempV = new THREE.Vector3();

    /* ─────────────────────────────────────────────────────────
       buildScene — dispose old, construct new schematic
    ───────────────────────────────────────────────────────── */
    function buildScene(pillarIdx) {
      /* dispose */
      if (schemaGroup) {
        scene.remove(schemaGroup);
        nodeRecs.forEach(n => {
          n.wireMesh.geometry.dispose(); n.wireMat.dispose();
          n.solidMesh.geometry.dispose(); n.solidMat.dispose();
        });
        linkRecs.forEach(l => { l.geo.dispose(); l.mat.dispose(); });
      }
      nodeRecs = []; linkRecs = [];

      /* clear label DOM */
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      labelEls = [];

      const accent = PILLAR_ACCENTS[pillarIdx];
      const pid    = PILLAR_IDS[pillarIdx];
      const def    = DEFS[pid];
      keyLight.color.setHex(accent);
      scanMat.color.setHex(accent);

      schemaGroup = new THREE.Group();
      groupScale  = 0.001; // pop-in

      /* nodes */
      def.nodes.forEach(n => {
        const sz      = n.isHub ? 0.35 : 0.25;
        const geo     = makeNodeGeo(n.shape, sz);

        /* wireframe — visible in 2D mode */
        const wireMat  = new THREE.MeshBasicMaterial({
          color: 0xb8b8b2, wireframe: true, transparent: true,
          opacity: n.isHub ? 0.52 : 0.40,
        });
        const wireMesh = new THREE.Mesh(geo.clone(), wireMat);
        wireMesh.position.set(n.x, n.y, 0);

        /* solid fill — fades in on hover */
        const solidMat  = new THREE.MeshPhysicalMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0,
          metalness: 0.90, roughness: 0.08, transparent: true, opacity: 0,
        });
        const solidMesh = new THREE.Mesh(geo, solidMat);
        solidMesh.position.set(n.x, n.y, 0);

        schemaGroup.add(wireMesh, solidMesh);
        nodeRecs.push({
          wireMesh, solidMesh, wireMat, solidMat,
          x: n.x, y: n.y, z3d: n.z3d, curZ: 0, isHub: n.isHub,
        });

        /* label DOM element */
        const el  = document.createElement("div");
        el.className = "wwd-holo-node-label" + (n.isHub ? " is-hub" : "");
        const nameEl = document.createElement("span");
        nameEl.className = "wwd-holo-node-name";
        nameEl.textContent = n.label;
        const subEl  = document.createElement("span");
        subEl.className = "wwd-holo-node-sub";
        subEl.textContent = n.sub;
        el.appendChild(nameEl);
        el.appendChild(subEl);
        overlay.appendChild(el);
        labelEls.push(el);
      });

      /* links */
      def.links.forEach(([a, b]) => {
        const na = def.nodes[a];
        const nb = def.nodes[b];
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(na.x, na.y, 0),
          new THREE.Vector3(nb.x, nb.y, 0),
        ]);
        const mat  = new THREE.LineBasicMaterial({
          color: 0x505048, transparent: true, opacity: 0.32,
        });
        const line = new THREE.Line(geo, mat);
        schemaGroup.add(line);
        linkRecs.push({ line, geo, mat, aIdx: a, bIdx: b });
      });

      scene.add(schemaGroup);
      lastPillar = pillarIdx;
    }

    buildScene(activeRef.current);

    /* ─────────────────────────────────────────────────────────
       tick — animation loop
    ───────────────────────────────────────────────────────── */
    let rafId = 0;
    let last  = performance.now();
    let t     = 0;

    function tick(now) {
      rafId = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      const dt = Math.min(0.032, (now - last) * 0.001);
      last = now;
      t   += dt;

      /* rebuild if pillar changed */
      const pillar = activeRef.current;
      if (pillar !== lastPillar) buildScene(pillar);

      const accent = PILLAR_ACCENTS[pillar];
      const aR = ((accent >> 16) & 0xff) / 255;
      const aG = ((accent >>  8) & 0xff) / 255;
      const aB = ( accent        & 0xff) / 255;
      // link idle colour
      const iR = 0x50 / 255, iG = 0x50 / 255, iB = 0x48 / 255;

      /* hover progress */
      hoverProg += (hoverTarget - hoverProg) * (hoverTarget > hoverProg ? 2.2 : 2.8) * dt;
      hoverProg  = Math.max(0, Math.min(1, hoverProg));
      const hp   = ss(hoverProg); // smooth-stepped

      /* tilt */
      tilt.x += (tilt.tx - tilt.x) * 0.065;
      tilt.y += (tilt.ty - tilt.y) * 0.065;

      /* ── camera ── flat orthographic feel → perspective dive */
      camera.fov = lerp(camera.fov, lerp(28, 46, hp), 0.04);
      camera.position.z = lerp(camera.position.z, lerp(9.0, 5.4, hp), 0.04);
      camera.position.y = lerp(camera.position.y, lerp(0,   0.45, hp), 0.04);
      camera.updateProjectionMatrix();
      camera.lookAt(0, lerp(0, -0.2, hp), 0);

      /* ── scene group ── */
      if (schemaGroup) {
        groupScale = Math.min(1, groupScale + dt * 3.5);
        const introS = ss(groupScale);

        /* breathe in 2D, rotate in 3D */
        const breathe = hp < 0.05 ? 1 + Math.sin(t * 1.1) * 0.02 : 1;
        schemaGroup.scale.setScalar(introS * breathe);

        const autoY = hp > 0.02 ? t * 0.20 : 0;
        schemaGroup.rotation.y = lerp(schemaGroup.rotation.y, autoY + tilt.x * lerp(0, 0.35, hp), 0.04);
        schemaGroup.rotation.x = lerp(schemaGroup.rotation.x, tilt.y * lerp(0, 0.22, hp) - lerp(0, 0.08, hp), 0.04);
      }

      /* ── grid & scan ring ── */
      grid.material.opacity     = lerp(0, 0.09, hp);
      scanRing.material.opacity = lerp(0, 0.36, hp);
      scanRing.rotation.z = t * 0.70;
      scanMat.color.setHex(accent);

      /* ── lights ── */
      keyLight.intensity = lerp(0, 3.5, hp);
      fill.intensity     = lerp(0, 1.5, hp);
      keyLight.color.setHex(accent);

      /* ── nodes ── */
      nodeRecs.forEach((n, idx) => {
        /* Z pop */
        n.curZ = lerp(n.curZ, lerp(0, n.z3d, hp), 0.06);
        n.wireMesh.position.z  = n.curZ;
        n.solidMesh.position.z = n.curZ;

        /* self-rotation (3D mode only) */
        if (hp > 0.04) {
          const rs = (n.isHub ? 0.65 : 1.1) * hp;
          n.wireMesh.rotation.y += dt * rs * 0.55;
          n.wireMesh.rotation.x += dt * rs * 0.32;
          n.solidMesh.rotation.copy(n.wireMesh.rotation);
        }

        /* materials */
        n.wireMat.opacity  = lerp(n.isHub ? 0.52 : 0.40, 0.10, hp);
        n.solidMat.opacity = lerp(0, 0.85, hp);
        n.solidMat.emissiveIntensity = hp * (0.40 + Math.sin(t * 2.5 + idx * 0.85) * 0.12);

        /* ── label world→screen projection ── */
        n.wireMesh.getWorldPosition(tempV);
        tempV.project(camera);
        const sx = (tempV.x *  0.5 + 0.5) * cw;
        const sy = (tempV.y * -0.5 + 0.5) * ch;
        const yOff = n.isHub ? -36 : 22;

        const el = labelEls[idx];
        if (el) {
          el.style.left    = sx + "px";
          el.style.top     = (sy + yOff) + "px";
          el.style.opacity = String(lerp(1, 0.28, hp));
        }
      });

      /* ── links: stretch endpoints to current node Z ── */
      linkRecs.forEach(l => {
        const na = nodeRecs[l.aIdx];
        const nb = nodeRecs[l.bIdx];
        const arr = l.geo.attributes.position.array;
        arr[0] = na.x; arr[1] = na.y; arr[2] = na.curZ;
        arr[3] = nb.x; arr[4] = nb.y; arr[5] = nb.curZ;
        l.geo.attributes.position.needsUpdate = true;

        l.mat.opacity = lerp(0.30, 0.42, hp);
        l.mat.color.r = lerp(iR, aR, hp);
        l.mat.color.g = lerp(iG, aG, hp);
        l.mat.color.b = lerp(iB, aB, hp);
      });

      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("mousemove",  onMove);
      ro.disconnect();
      io.disconnect();
      if (schemaGroup) scene.remove(schemaGroup);
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const def = DEFS[PILLAR_IDS[activePillar]] ?? DEFS.experience;

  return (
    <div ref={hostRef} className="wwd-holo-host" data-hovered="0">
      <canvas ref={canvasRef} className="wwd-holo-canvas" aria-hidden="true" />

      {/* Label overlay — children managed by vanilla JS in tick loop */}
      <div ref={overlayRef} className="wwd-holo-node-overlay" aria-hidden="true" />

      {/* Static HUD chrome */}
      <div className="wwd-holo-hud" aria-hidden="true">
        <div className="wwd-holo-hud-tl">
          <span className="wwd-holo-hud-label">SCHEMA</span>
          <span className="wwd-holo-hud-val">{def.schemaLabel}</span>
        </div>
        <div className="wwd-holo-hud-tr">
          <span className="wwd-holo-hud-live">
            <span className="wwd-holo-hud-dot" />
            LIVE
          </span>
        </div>
        <div className="wwd-holo-hud-bl">
          <span className="wwd-holo-hud-nodes">
            {def.nodes.length}&nbsp;NODES&nbsp;/&nbsp;{def.links.length}&nbsp;LINKS
          </span>
        </div>
      </div>

      <div className="wwd-holo-hint" aria-hidden="true">HOVER TO ACTIVATE 3D</div>
    </div>
  );
}
