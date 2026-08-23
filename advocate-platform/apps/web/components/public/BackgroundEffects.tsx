'use client';
import { useEffect, useRef, useState } from 'react';

export function BackgroundEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Perspective Courtroom Engine with Ornate Scales of Justice from Reference
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.0006;
      targetMouseY = (e.clientY - height / 2) * 0.0006;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    interface Model3D {
      vertices: Point3D[];
      edges: [number, number][];
    }

    // ─── 1. Classic Ornate Scales of Justice (Matching User's Reference Image) ─
    const createOrnateScalesOfJustice = (): Model3D => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];

      // Stepped Pedestal Base (2 circular tiers)
      const baseSegs = 16;
      for (let tier = 0; tier < 2; tier++) {
        const r = tier === 0 ? 58 : 44;
        const y = 85 - tier * 12;
        for (let i = 0; i < baseSegs; i++) {
          const a = (i / baseSegs) * Math.PI * 2;
          vertices.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
        }
      }
      for (let i = 0; i < baseSegs; i++) {
        edges.push([i, (i + 1) % baseSegs]);
        edges.push([baseSegs + i, baseSegs + ((i + 1) % baseSegs)]);
        if (i % 4 === 0) edges.push([i, baseSegs + i]);
      }

      // Central Pillar Column with Decorative Finial
      const pillarIdx = vertices.length;
      vertices.push({ x: 0, y: 70, z: 0 });   // base connection
      vertices.push({ x: 0, y: -65, z: 0 });  // upper fulcrum joint
      vertices.push({ x: 0, y: -78, z: 0 });  // finial sphere
      edges.push([pillarIdx, pillarIdx + 1]);
      edges.push([pillarIdx + 1, pillarIdx + 2]);

      // Ornate Curved Swan-Neck Balance Arm
      // Left arm curve (from center (0,-65) curving up then down to (-110,-55))
      const armIdx = vertices.length;
      vertices.push({ x: 0, y: -65, z: 0 });          // 0: center joint
      vertices.push({ x: -40, y: -78, z: 0 });        // 1: left arch peak
      vertices.push({ x: -80, y: -74, z: 0 });        // 2: left dip
      vertices.push({ x: -115, y: -58, z: 0 });       // 3: left hook end
      vertices.push({ x: 40, y: -78, z: 0 });         // 4: right arch peak
      vertices.push({ x: 80, y: -74, z: 0 });         // 5: right dip
      vertices.push({ x: 115, y: -58, z: 0 });        // 6: right hook end

      edges.push([armIdx, armIdx + 1]);
      edges.push([armIdx + 1, armIdx + 2]);
      edges.push([armIdx + 2, armIdx + 3]);

      edges.push([armIdx, armIdx + 4]);
      edges.push([armIdx + 4, armIdx + 5]);
      edges.push([armIdx + 5, armIdx + 6]);

      // Function to add a classic 3D hanging pan bowl
      const addHangingPan = (hookX: number, hookY: number, panRadius: number) => {
        const panRimY = hookY + 68;
        const panRimIdx = vertices.length;
        const panSegs = 14;

        for (let i = 0; i < panSegs; i++) {
          const a = (i / panSegs) * Math.PI * 2;
          vertices.push({
            x: hookX + Math.cos(a) * panRadius,
            y: panRimY,
            z: Math.sin(a) * panRadius,
          });
        }

        for (let i = 0; i < panSegs; i++) {
          edges.push([panRimIdx + i, panRimIdx + ((i + 1) % panSegs)]);
        }

        // Hemispherical Pan Bottom Apex
        const apexIdx = vertices.length;
        vertices.push({ x: hookX, y: panRimY + 16, z: 0 });
        for (let i = 0; i < panSegs; i += 3) {
          edges.push([panRimIdx + i, apexIdx]);
        }

        // 3 Suspension Cords from hook to pan rim
        const hookVertex = hookX < 0 ? armIdx + 3 : armIdx + 6;
        edges.push([hookVertex, panRimIdx]);
        edges.push([hookVertex, panRimIdx + 5]);
        edges.push([hookVertex, panRimIdx + 10]);
      };

      addHangingPan(-115, -58, 34); // Left hanging bowl
      addHangingPan(115, -58, 34);  // Right hanging bowl

      return { vertices, edges };
    };

    // ─── 2. 3D Model: Judicial Gavel & Sound Block ────────────────────────────
    const create3DGavel = (): Model3D => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];

      const headSegs = 10;
      const headRadius = 26;
      const headLength = 70;

      const xPositions = [-headLength / 2, 0, headLength / 2];
      for (let s = 0; s < xPositions.length; s++) {
        const hx = xPositions[s];
        const r = s === 1 ? headRadius * 0.9 : headRadius;
        for (let i = 0; i < headSegs; i++) {
          const a = (i / headSegs) * Math.PI * 2;
          vertices.push({ x: hx, y: Math.cos(a) * r, z: Math.sin(a) * r });
        }
      }

      for (let s = 0; s < 3; s++) {
        const offset = s * headSegs;
        for (let i = 0; i < headSegs; i++) {
          edges.push([offset + i, offset + ((i + 1) % headSegs)]);
        }
      }
      for (let i = 0; i < headSegs; i += 2) {
        edges.push([i, headSegs + i]);
        edges.push([headSegs + i, headSegs * 2 + i]);
      }

      const handleStartIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: 0 });
      vertices.push({ x: 0, y: 110, z: 0 });
      vertices.push({ x: -4, y: 110, z: -4 });
      vertices.push({ x: 4, y: 110, z: 4 });
      vertices.push({ x: 0, y: 125, z: 0 });

      edges.push([handleStartIdx, handleStartIdx + 1]);
      edges.push([handleStartIdx + 1, handleStartIdx + 4]);
      edges.push([handleStartIdx + 2, handleStartIdx + 3]);

      const blockStartIdx = vertices.length;
      const blockRadius = 55;
      const blockHeight = 16;
      const blockSegs = 12;
      const blockY = 75;

      for (let i = 0; i < blockSegs; i++) {
        const a = (i / blockSegs) * Math.PI * 2;
        vertices.push({ x: Math.cos(a) * blockRadius, y: blockY, z: Math.sin(a) * blockRadius });
        vertices.push({ x: Math.cos(a) * (blockRadius + 8), y: blockY + blockHeight, z: Math.sin(a) * (blockRadius + 8) });
      }

      for (let i = 0; i < blockSegs; i++) {
        const top1 = blockStartIdx + i * 2;
        const bot1 = blockStartIdx + i * 2 + 1;
        const top2 = blockStartIdx + ((i + 1) % blockSegs) * 2;
        const bot2 = blockStartIdx + ((i + 1) % blockSegs) * 2 + 1;

        edges.push([top1, top2]);
        edges.push([bot1, bot2]);
        if (i % 3 === 0) edges.push([top1, bot1]);
      }

      return { vertices, edges };
    };

    // ─── 3. 3D Model: Classical Courthouse Portico (Pediment & Pillars) ───────
    const create3DCourthouse = (): Model3D => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];

      const w = 110;
      const d = 40;

      const pedIdx = vertices.length;
      vertices.push({ x: 0, y: -75, z: -d });
      vertices.push({ x: -w, y: -40, z: -d });
      vertices.push({ x: w, y: -40, z: -d });
      vertices.push({ x: 0, y: -75, z: d });
      vertices.push({ x: -w, y: -40, z: d });
      vertices.push({ x: w, y: -40, z: d });

      edges.push([pedIdx, pedIdx + 1]);
      edges.push([pedIdx, pedIdx + 2]);
      edges.push([pedIdx + 1, pedIdx + 2]);
      edges.push([pedIdx + 3, pedIdx + 4]);
      edges.push([pedIdx + 3, pedIdx + 5]);
      edges.push([pedIdx + 4, pedIdx + 5]);
      edges.push([pedIdx, pedIdx + 3]);
      edges.push([pedIdx + 1, pedIdx + 4]);
      edges.push([pedIdx + 2, pedIdx + 5]);

      const beamIdx = vertices.length;
      vertices.push({ x: -w, y: -30, z: -d });
      vertices.push({ x: w, y: -30, z: -d });
      vertices.push({ x: -w, y: -30, z: d });
      vertices.push({ x: w, y: -30, z: d });
      edges.push([beamIdx, beamIdx + 1]);
      edges.push([beamIdx + 2, beamIdx + 3]);
      edges.push([beamIdx, beamIdx + 2]);
      edges.push([beamIdx + 1, beamIdx + 3]);

      const colX = [-75, -25, 25, 75];
      for (let i = 0; i < colX.length; i++) {
        const cx = colX[i];
        const pIdx = vertices.length;
        vertices.push({ x: cx, y: -30, z: -d * 0.5 });
        vertices.push({ x: cx, y: 55, z: -d * 0.5 });
        vertices.push({ x: cx, y: -30, z: d * 0.5 });
        vertices.push({ x: cx, y: 55, z: d * 0.5 });

        edges.push([pIdx, pIdx + 1]);
        edges.push([pIdx + 2, pIdx + 3]);
      }

      const baseIdx = vertices.length;
      vertices.push({ x: -w - 15, y: 55, z: -d - 15 });
      vertices.push({ x: w + 15, y: 55, z: -d - 15 });
      vertices.push({ x: w + 15, y: 55, z: d + 15 });
      vertices.push({ x: -w - 15, y: 55, z: d + 15 });

      vertices.push({ x: -w - 25, y: 70, z: -d - 25 });
      vertices.push({ x: w + 25, y: 70, z: -d - 25 });
      vertices.push({ x: w + 25, y: 70, z: d + 25 });
      vertices.push({ x: -w - 25, y: 70, z: d + 25 });

      for (let i = 0; i < 4; i++) {
        edges.push([baseIdx + i, baseIdx + ((i + 1) % 4)]);
        edges.push([baseIdx + 4 + i, baseIdx + 4 + ((i + 1) % 4)]);
        edges.push([baseIdx + i, baseIdx + 4 + i]);
      }

      return { vertices, edges };
    };

    // ─── 4. 3D Model: Open Law Codebook ──────────────────────────────────────
    const create3DLawBook = (): Model3D => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];

      const bw = 75;
      const bh = 95;

      vertices.push({ x: 0, y: -bh / 2, z: 0 });
      vertices.push({ x: 0, y: bh / 2, z: 0 });
      edges.push([0, 1]);

      vertices.push({ x: -bw, y: -bh / 2, z: 25 });
      vertices.push({ x: -bw, y: bh / 2, z: 25 });
      vertices.push({ x: -bw * 0.5, y: -bh / 2 - 4, z: 15 });
      vertices.push({ x: -bw * 0.5, y: -bh / 2 - 4, z: 15 });

      edges.push([0, 4]); edges.push([4, 2]);
      edges.push([1, 5]); edges.push([5, 3]);
      edges.push([2, 3]);

      vertices.push({ x: bw, y: -bh / 2, z: 25 });
      vertices.push({ x: bw, y: bh / 2, z: 25 });
      vertices.push({ x: bw * 0.5, y: -bh / 2 - 4, z: 15 });
      vertices.push({ x: bw * 0.5, y: -bh / 2 - 4, z: 15 });

      edges.push([0, 8]); edges.push([8, 6]);
      edges.push([1, 9]); edges.push([9, 7]);
      edges.push([6, 7]);

      for (let l = 1; l <= 3; l++) {
        const ly = -bh / 2 + l * 22;
        const lineIdx = vertices.length;
        vertices.push({ x: -bw * 0.8, y: ly, z: 20 });
        vertices.push({ x: -bw * 0.2, y: ly, z: 8 });
        edges.push([lineIdx, lineIdx + 1]);

        const rLineIdx = vertices.length;
        vertices.push({ x: bw * 0.2, y: ly, z: 8 });
        vertices.push({ x: bw * 0.8, y: ly, z: 20 });
        edges.push([rLineIdx, rLineIdx + 1]);
      }

      return { vertices, edges };
    };

    // ─── 5. 3D Model: Rotating 3D Polyhedron ─────────────────────────────────
    const createIcosahedron = (radius: number): Model3D => {
      const t = (1.0 + Math.sqrt(5.0)) / 2.0;
      const vertices: Point3D[] = [
        { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
        { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
        { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 },
      ].map(v => {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return { x: (v.x / len) * radius, y: (v.y / len) * radius, z: (v.z / len) * radius };
      });

      const edges: [number, number][] = [
        [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
        [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
        [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
        [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
        [4, 5], [5, 9], [8, 1], [1, 9], [7, 8], [6, 7], [10, 6], [2, 10], [11, 2], [4, 11],
      ];

      return { vertices, edges };
    };

    const create3DRing = (radius: number, segments: number): Point3D[] => {
      const points: Point3D[] = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 });
      }
      return points;
    };

    const scalesModel = createOrnateScalesOfJustice();
    const gavelModel = create3DGavel();
    const courthouseModel = create3DCourthouse();
    const lawBookModel = create3DLawBook();
    const icosahedronModel = createIcosahedron(110);
    const outerRing = create3DRing(240, 36);
    const innerRing = create3DRing(175, 28);

    const particleCount = 50;
    const particles3D: Array<Point3D & { vx: number; vy: number; vz: number; size: number }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles3D.push({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 1400,
        z: (Math.random() - 0.5) * 800,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1.2,
      });
    }

    const gridCols = 16;
    const gridRows = 16;
    const gridSpacing = 85;

    const project = (p: Point3D, cx: number, cy: number, fov = 520): { x: number; y: number; scale: number; visible: boolean } => {
      const z = p.z + fov;
      if (z <= 10) return { x: cx, y: cy, scale: 0, visible: false };
      const scale = fov / z;
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        scale,
        visible: true,
      };
    };

    const rotatePoint = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      const y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
      const z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);
      const x1 = p.x;

      const x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
      const y2 = y1;

      const x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      const z3 = z2;

      return { x: x3, y: y3, z: z3 };
    };

    const drawModel = (model: Model3D, cx: number, cy: number, rx: number, ry: number, rz: number, baseAlpha = 0.22, scaleMul = 1.0) => {
      const rotatedVerts = model.vertices.map(v => {
        const scaled = { x: v.x * scaleMul, y: v.y * scaleMul, z: v.z * scaleMul };
        return rotatePoint(scaled, rx, ry, rz);
      });

      const projectedVerts = rotatedVerts.map(v => project(v, cx, cy, 520));

      ctx.lineWidth = 1.4;
      for (let i = 0; i < model.edges.length; i++) {
        const [v1, v2] = model.edges[i];
        const p1 = projectedVerts[v1];
        const p2 = projectedVerts[v2];

        if (p1.visible && p2.visible) {
          const edgeAlpha = Math.min(baseAlpha, (p1.scale + p2.scale) * (baseAlpha * 0.6));
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${edgeAlpha})`;
          ctx.stroke();
        }
      }
    };

    const drawRing = (ringPoints: Point3D[], rx: number, ry: number, rz: number, cx: number, cy: number, alpha: number) => {
      const rotated = ringPoints.map(v => rotatePoint(v, rx, ry, rz));
      const projected = rotated.map(v => project(v, cx, cy, 500));

      ctx.beginPath();
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        if (!pt.visible) continue;
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.01;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const scrollOffset = window.scrollY;
      const scrollRot = scrollOffset * 0.0015;

      // ─── 1. Draw 3D Perspective Wave Grid Floor ───
      ctx.lineWidth = 1;
      const gridPoints: Array<Array<{ x: number; y: number; visible: boolean; alpha: number }>> = [];

      for (let r = 0; r < gridRows; r++) {
        gridPoints[r] = [];
        for (let c = 0; c < gridCols; c++) {
          const rawX = (c - gridCols / 2) * gridSpacing;
          const rawZ = (r * gridSpacing) - 100;
          const rawY = 280 + Math.sin(c * 0.4 + time + scrollOffset * 0.005) * 22 + Math.cos(r * 0.4 + time) * 18;

          const p = rotatePoint({ x: rawX, y: rawY, z: rawZ }, 0.45 + mouseY * 0.5, mouseX * 0.5, 0);
          const pr = project(p, width * 0.5, height * 0.55, 600);

          const depthAlpha = Math.max(0, Math.min(0.20, (pr.scale - 0.3) * 0.32));
          gridPoints[r][c] = { x: pr.x, y: pr.y, visible: pr.visible, alpha: depthAlpha };
        }
      }

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const pt = gridPoints[r][c];
          if (!pt.visible || pt.alpha <= 0) continue;

          if (c < gridCols - 1) {
            const next = gridPoints[r][c + 1];
            if (next.visible) {
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(next.x, next.y);
              ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(pt.alpha, next.alpha)})`;
              ctx.stroke();
            }
          }

          if (r < gridRows - 1) {
            const down = gridPoints[r + 1][c];
            if (down.visible) {
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(down.x, down.y);
              ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(pt.alpha, down.alpha)})`;
              ctx.stroke();
            }
          }
        }
      }

      // ─── 2. Draw 3D Precedent Particles & Connecting Web ───
      for (let i = 0; i < particles3D.length; i++) {
        const p = particles3D[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -700) p.x = 700;
        if (p.x > 700) p.x = -700;
        if (p.y < -700) p.y = 700;
        if (p.y > 700) p.y = -700;
        if (p.z < -400) p.z = 400;
        if (p.z > 400) p.z = -400;

        const rotated = rotatePoint(p, mouseY * 0.4, time * 0.2 + mouseX * 0.4, 0);
        const pr = project(rotated, width * 0.5, height * 0.5, 550);

        if (pr.visible) {
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, p.size * pr.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.28, pr.scale * 0.25)})`;
          ctx.fill();
        }
      }

      // ─── 3. Classic Ornate Scales of Justice (Hero Top Right) ───
      const scalesCX = width * 0.82;
      const scalesCY = height * 0.35;
      const scalesRotX = 0.15 + mouseY * 0.6;
      const scalesRotY = time * 0.3 + mouseX + scrollRot;
      const balanceTilt = Math.sin(time * 0.9) * 0.09; // realistic balance scale tilt
      drawModel(scalesModel, scalesCX, scalesCY, scalesRotX, scalesRotY, balanceTilt, 0.26, 1.15);
      drawRing(outerRing, scalesRotX * 1.1, scalesRotY * 0.9, balanceTilt, scalesCX, scalesCY, 0.14);

      // ─── 4. 3D Model: Judicial Gavel & Sound Block (Middle Left) ───
      const gavelCX = width * 0.15;
      const gavelCY = height * 0.65;
      const gavelRotX = 0.45 + mouseY * 0.6;
      const gavelRotY = -time * 0.4 + mouseX * 0.8 + scrollRot;
      const gavelRotZ = -0.3 + Math.cos(time * 0.5) * 0.1;
      drawModel(gavelModel, gavelCX, gavelCY, gavelRotX, gavelRotY, gavelRotZ, 0.20, 1.0);

      // ─── 5. 3D Model: Courthouse Portico & Pillars (Center Bottom) ───
      const courtCX = width * 0.5;
      const courtCY = height * 0.85;
      const courtRotX = 0.25 + mouseY * 0.5;
      const courtRotY = Math.sin(time * 0.25) * 0.3 + mouseX * 0.5 + scrollRot * 0.8;
      drawModel(courthouseModel, courtCX, courtCY, courtRotX, courtRotY, 0, 0.18, 0.95);

      // ─── 6. 3D Model: Open Law Book (Top Left) ───
      const bookCX = width * 0.18;
      const bookCY = height * 0.22;
      const bookRotX = 0.5 + mouseY * 0.6;
      const bookRotY = time * 0.3 + mouseX * 0.5 + scrollRot;
      drawModel(lawBookModel, bookCX, bookCY, bookRotX, bookRotY, 0, 0.18, 1.0);

      // ─── 7. 3D Model: Polyhedron / Icosahedron (Lower Right) ───
      const icoCX = width * 0.82;
      const icoCY = height * 0.76;
      const icoRotX = time * 0.5 + mouseY;
      const icoRotY = time * 0.4 + mouseX + scrollRot;
      drawModel(icosahedronModel, icoCX, icoCY, icoRotX, icoRotY, time * 0.2, 0.18, 1.0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top High-Contrast Scroll Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] bg-neutral-200 z-50">
        <div
          className="h-full bg-black transition-all duration-75 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Pure White Background */}
      <div className="absolute inset-0 bg-[#ffffff]" />

      {/* 3D Court & Law Models Canvas + 3D Wave Perspective Grid */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Architectural Column Guide Lines */}
      <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-black/[0.06] hidden xl:block" />
      <div className="absolute top-0 bottom-0 right-6 w-[1px] bg-black/[0.06] hidden xl:block" />
    </div>
  );
}
