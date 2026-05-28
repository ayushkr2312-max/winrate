import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion, isMobileViewport, isCoarsePointer } from "@/lib/device";

/** Maps signal index → node id to pop out */
export const SIGNAL_HOT = {
  experience: [1, 0, 1],
  technical: [1, 2, 3],
  network: [0, 1, 4],
  custom: [0, 1, 2],
};

const ACCENT_HEX = {
  lime: 0xb6ff1e,
  ion: 0x66e8ff,
  amber: 0xffb547,
};

const SCENE_DEFS = {
  experience: {
    caption: "Org structure — mapped, not templated",
    nodes: [
      { id: 0, x: 0, y: 1.05, z: 0, shape: "octa" },
      { id: 1, x: -1.15, y: -0.15, z: 0, shape: "box" },
      { id: 2, x: 1.15, y: -0.15, z: 0, shape: "box" },
      { id: 3, x: 0, y: -1.05, z: 0, shape: "dodeca" },
    ],
    links: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  technical: {
    caption: "Manual ops → working systems",
    nodes: [
      { id: 0, x: -1.65, y: 0, z: 0, shape: "box" },
      { id: 1, x: -0.55, y: 0, z: 0, shape: "box" },
      { id: 2, x: 0.55, y: 0, z: 0, shape: "box" },
      { id: 3, x: 1.65, y: 0, z: 0, shape: "box" },
    ],
    links: [[0, 1], [1, 2], [2, 3]],
  },
  network: {
    caption: "Trusted routes — not trial-and-error",
    hub: true,
    nodes: [
      { id: 0, angle: -90, r: 1.35, shape: "octa" },
      { id: 1, angle: -18, r: 1.35, shape: "octa" },
      { id: 2, angle: 54, r: 1.35, shape: "octa" },
      { id: 3, angle: 126, r: 1.35, shape: "octa" },
      { id: 4, angle: 198, r: 1.35, shape: "octa" },
    ],
  },
  custom: {
    caption: "Modular engagement — scaled to your stage",
    nodes: [
      { id: 0, x: -1.05, y: 0, z: 0, shape: "box" },
      { id: 1, x: 0, y: 0, z: 0, shape: "box" },
      { id: 2, x: 1.05, y: 0, z: 0, shape: "box" },
    ],
    links: [[0, 1], [1, 2]],
  },
};

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function nodeGeometry(shape) {
  switch (shape) {
    case "box":
      return new THREE.BoxGeometry(0.42, 0.42, 0.42, 2, 2, 2);
    case "dodeca":
      return new THREE.DodecahedronGeometry(0.32, 0);
    case "octa":
    default:
      return new THREE.OctahedronGeometry(0.34, 1);
  }
}

function createSculptField(accent) {
  const geo = new THREE.IcosahedronGeometry(2.6, 5);
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({
    color: accent,
    metalness: 0.2,
    roughness: 0.55,
    transparent: true,
    opacity: 0.07,
    side: THREE.DoubleSide,
    wireframe: false,
  });
  const wire = new THREE.MeshBasicMaterial({
    color: accent,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const wireMesh = new THREE.Mesh(geo.clone(), wire);
  mesh.position.z = -0.65;
  wireMesh.position.z = -0.65;
  const orig = new Float32Array(geo.getAttribute("position").array);
  const velocity = new Float32Array(orig.length);
  return { geo, mesh, wireMesh, orig, velocity };
}

function buildGraph(scene, def, accent, secondary) {
  const group = new THREE.Group();
  const nodeRecords = [];
  const linkMeshes = [];

  if (def.hub) {
    const hubGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const hubMat = new THREE.MeshPhysicalMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.15,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    const hubWire = new THREE.Mesh(
      hubGeo.clone(),
      new THREE.MeshBasicMaterial({ color: secondary, wireframe: true, transparent: true, opacity: 0.35 }),
    );
    group.add(hub, hubWire);
    nodeRecords.push({ id: "hub", mesh: hub, wire: hubWire, baseX: 0, baseY: 0, baseZ: 0, pop: 0, scale: 1 });

    def.nodes.forEach((n) => {
      const rad = (n.angle * Math.PI) / 180;
      const x = Math.cos(rad) * n.r;
      const y = Math.sin(rad) * n.r;
      const { solid, wire } = makeNode(n.shape, secondary, x, y, 0);
      group.add(solid, wire);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, 0),
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: secondary, transparent: true, opacity: 0.2 }),
      );
      group.add(line);
      linkMeshes.push(line);

      nodeRecords.push({
        id: n.id,
        mesh: solid,
        wire,
        baseX: x,
        baseY: y,
        baseZ: 0,
        pop: 0,
        scale: 1,
        line,
      });
    });
  } else {
    def.links?.forEach(([a, b]) => {
      const na = def.nodes.find((n) => n.id === a);
      const nb = def.nodes.find((n) => n.id === b);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(na.x, na.y, na.z),
        new THREE.Vector3(nb.x, nb.y, nb.z),
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18 }),
      );
      group.add(line);
      linkMeshes.push(line);
    });

    def.nodes.forEach((n) => {
      const { solid, wire } = makeNode(n.shape, accent, n.x, n.y, n.z);
      group.add(solid, wire);
      nodeRecords.push({
        id: n.id,
        mesh: solid,
        wire,
        baseX: n.x,
        baseY: n.y,
        baseZ: n.z,
        pop: 0,
        scale: 1,
      });
    });
  }

  scene.add(group);
  return { group, nodeRecords, linkMeshes };
}

function makeNode(shape, color, x, y, z) {
  const geo = nodeGeometry(shape);
  const wireGeo = geo.clone();
  const solid = new THREE.Mesh(
    geo,
    new THREE.MeshPhysicalMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.08,
      metalness: 0.45,
      roughness: 0.35,
      transparent: true,
      opacity: 0.72,
    }),
  );
  const wire = new THREE.Mesh(
    wireGeo,
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.45 }),
  );
  solid.position.set(x, y, z);
  wire.position.set(x, y, z);
  return { solid, wire };
}

export default function WwdSystemMap({ laneId = "experience", accent = "lime", hotSignal = null }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const laneRef = useRef(laneId);
  const hotRef = useRef(hotSignal);
  const captionRef = useRef(null);

  useEffect(() => { laneRef.current = laneId; }, [laneId]);
  useEffect(() => { hotRef.current = hotSignal; }, [hotSignal]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const captionEl = captionRef.current;
    if (!host || !canvas) return;

    const useFallback = prefersReducedMotion() || isMobileViewport() || isCoarsePointer();
    host.dataset.mode = useFallback ? "fallback" : "webgl";

    if (useFallback) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0, 4.8);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x08080a, 1.2);
    const key = new THREE.PointLight(0xb6ff1e, 1.4, 20);
    key.position.set(2, 1.5, 4);
    const fill = new THREE.PointLight(0x66e8ff, 0.6, 16);
    fill.position.set(-2, -1, 3);
    scene.add(hemi, key, fill);

    let graph = null;
    let sculpt = null;
    let lastLane = "";
    let visible = true;
    let intro = 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    let pointerInside = false;
    let sculptStrength = 0;
    let hasHit = false;
    const hitPoint = new THREE.Vector3();

    function accentHex() {
      return ACCENT_HEX[accent] ?? ACCENT_HEX.lime;
    }

    function secondaryHex() {
      if (laneRef.current === "network") return ACCENT_HEX.ion;
      if (laneRef.current === "custom") return ACCENT_HEX.amber;
      return ACCENT_HEX.ion;
    }

    function disposeGraph() {
      if (!graph) return;
      scene.remove(graph.group);
      graph.nodeRecords.forEach((n) => {
        n.mesh.geometry.dispose();
        n.mesh.material.dispose();
        n.wire.geometry.dispose();
        n.wire.material.dispose();
        n.line?.geometry?.dispose();
        n.line?.material?.dispose();
      });
      graph.linkMeshes.forEach((l) => {
        l.geometry.dispose();
        l.material.dispose();
      });
      graph = null;
    }

    function disposeSculpt() {
      if (!sculpt) return;
      scene.remove(sculpt.mesh, sculpt.wireMesh);
      sculpt.geo.dispose();
      sculpt.wireMesh.geometry.dispose();
      sculpt.mesh.material.dispose();
      sculpt.wireMesh.material.dispose();
      sculpt = null;
    }

    function rebuildScene() {
      const lane = laneRef.current;
      const def = SCENE_DEFS[lane] || SCENE_DEFS.experience;
      if (captionEl) captionEl.textContent = def.caption;

      disposeGraph();
      disposeSculpt();

      const a = accentHex();
      const s = secondaryHex();
      key.color.setHex(a);
      fill.color.setHex(s);

      sculpt = createSculptField(a);
      scene.add(sculpt.mesh, sculpt.wireMesh);

      graph = buildGraph(scene, def, a, s);
      graph.group.scale.set(0.001, 0.001, 0.001);
      intro = 0;

      lastLane = lane;
    }

    rebuildScene();

    function resize() {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.06 });
    io.observe(host);

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      pointerInside = true;
    };
    const onLeave = () => {
      pointerInside = false;
      hasHit = false;
      pointer.set(2, 2);
      sculptStrength = 0;
    };

    host.addEventListener("mousemove", onMove, { passive: true });
    host.addEventListener("mouseleave", onLeave);

    let rafId = 0;
    let last = performance.now();

    function sculptField(dt) {
      if (!sculpt) return;
      const pos = sculpt.geo.getAttribute("position");

      if (pointerInside) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObject(sculpt.mesh);
        if (hits.length) {
          hasHit = true;
          hitPoint.copy(hits[0].point);
          sculptStrength = Math.min(1, sculptStrength + dt * 3.5);
        } else {
          sculptStrength = Math.max(0, sculptStrength - dt * 2.2);
        }
      } else {
        sculptStrength = Math.max(0, sculptStrength - dt * 2.8);
      }

      const local = hitPoint.clone();
      sculpt.mesh.worldToLocal(local);
      const radius = 0.72;
      const depth = 0.28;

      for (let i = 0; i < pos.count; i += 1) {
        const ix = i * 3;
        const ox = sculpt.orig[ix];
        const oy = sculpt.orig[ix + 1];
        const oz = sculpt.orig[ix + 2];
        let tx = ox;
        let ty = oy;
        let tz = oz;

        if (hasHit && sculptStrength > 0.01) {
          const dx = ox - local.x;
          const dy = oy - local.y;
          const dz = oz - local.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const f = smoothstep(radius, 0, dist) * sculptStrength;
          const len = Math.hypot(ox, oy, oz) || 1;
          const push = f * depth;
          tx += (ox / len) * push;
          ty += (oy / len) * push;
          tz += (oz / len) * push;
        }

        sculpt.velocity[ix] += (tx - pos.array[ix]) * 0.13;
        sculpt.velocity[ix + 1] += (ty - pos.array[ix + 1]) * 0.13;
        sculpt.velocity[ix + 2] += (tz - pos.array[ix + 2]) * 0.13;
        sculpt.velocity[ix] *= 0.8;
        sculpt.velocity[ix + 1] *= 0.8;
        sculpt.velocity[ix + 2] *= 0.8;
        pos.array[ix] += sculpt.velocity[ix];
        pos.array[ix + 1] += sculpt.velocity[ix + 1];
        pos.array[ix + 2] += sculpt.velocity[ix + 2];
      }
      pos.needsUpdate = true;
      sculpt.geo.computeVertexNormals();
    }

    function updateNodes(dt) {
      if (!graph) return;
      const hotIdx = hotRef.current;
      const hotId = hotIdx != null ? SIGNAL_HOT[laneRef.current]?.[hotIdx] : null;
      const a = accentHex();
      const s = secondaryHex();

      graph.nodeRecords.forEach((n) => {
        if (n.id === "hub") return;
        const isHot = hotId === n.id;
        const targetPop = isHot ? 0.72 : 0;
        const targetScale = isHot ? 1.42 : 1;
        n.pop += (targetPop - n.pop) * 0.11;
        n.scale += (targetScale - n.scale) * 0.11;

        const px = pointerInside ? pointer.x * 0.08 : 0;
        const py = pointerInside ? pointer.y * 0.06 : 0;

        n.mesh.position.set(
          n.baseX + px,
          n.baseY + py,
          n.baseZ + n.pop,
        );
        n.wire.position.copy(n.mesh.position);
        n.mesh.scale.setScalar(n.scale);
        n.wire.scale.setScalar(n.scale * 1.02);

        const col = isHot ? (laneRef.current === "network" ? s : a) : 0x888880;
        if (isHot) {
          n.mesh.material.emissiveIntensity = 0.35 + Math.sin(performance.now() * 0.004) * 0.08;
          n.mesh.material.opacity = 0.92;
          n.wire.material.opacity = 0.75;
        } else {
          n.mesh.material.emissiveIntensity = 0.08;
          n.mesh.material.opacity = 0.62;
          n.wire.material.opacity = 0.28;
        }
        n.mesh.material.emissive.setHex(isHot ? col : a);
        n.wire.material.color.setHex(isHot ? col : a);

        if (n.line) {
          n.line.material.opacity = isHot ? 0.55 : 0.16;
          n.line.material.color.setHex(isHot ? s : a);
        }
      });

      graph.linkMeshes.forEach((line) => {
        line.material.opacity = 0.12 + (hotId != null ? 0.08 : 0);
      });
    }

    function tick(now) {
      rafId = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      const dt = Math.min(0.032, (now - last) * 0.001);
      last = now;

      if (laneRef.current !== lastLane) rebuildScene();

      if (graph && intro < 1) {
        intro = Math.min(1, intro + dt * 2.2);
        const s = smoothstep(0, 1, intro);
        graph.group.scale.setScalar(s);
      }

      if (graph) {
        graph.group.rotation.y += dt * 0.08;
        graph.group.rotation.x = Math.sin(now * 0.00035) * 0.06;
        if (pointerInside) {
          graph.group.rotation.y += pointer.x * 0.015;
          graph.group.rotation.x += pointer.y * 0.01;
        }
      }

      sculptField(dt);
      updateNodes(dt);
      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      io.disconnect();
      disposeGraph();
      disposeSculpt();
      renderer.dispose();
    };
  }, [accent]);

  const def = SCENE_DEFS[laneId] || SCENE_DEFS.experience;
  const hotId = hotSignal != null ? SIGNAL_HOT[laneId]?.[hotSignal] : null;

  return (
    <div ref={hostRef} className="wwd-map-host" data-lane={laneId} data-accent={accent}>
      <canvas ref={canvasRef} className="wwd-map-canvas" aria-hidden="true" />
      <div className="wwd-map-fallback" aria-hidden="true">
        <span className="wwd-map-fallback-label">{def.caption}</span>
      </div>
      <p ref={captionRef} className="wwd-map-caption">{def.caption}</p>
      <span className="wwd-map-hint">Hover to sculpt</span>
      {hotId != null && (
        <span className="wwd-map-hot" aria-live="polite">
          Node {String(hotId + 1).padStart(2, "0")} active
        </span>
      )}
    </div>
  );
}
