import React, { useEffect, useRef } from 'react';

/**
 * Custom Scientific Orbital Visualization for Q-SHIELD Hero
 * Fully responsive canvas with dynamic scaling across mobile, tablet, and desktop.
 */
export default function HeroVisual() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const baseNodes = [
      { id: 'sig', label: 'SIGNATURE', angle: -Math.PI / 2, baseR: 124, color: '#0284C7', state: '|ψ⟩' },
      { id: 'ver', label: 'VERIFICATION', angle: 0, baseR: 124, color: '#7C3AED', state: '|Φ+⟩' },
      { id: 'qber', label: 'QBER', angle: Math.PI / 2, baseR: 124, color: '#10B981', state: 'δ < 5%' },
      { id: 'threat', label: 'THREAT ANALYSIS', angle: Math.PI, baseR: 124, color: '#EF4444', state: 'η-Sweep' },
    ];

    const particles = [
      { progress: 0.1, speed: 0.004, from: 0, to: 1 },
      { progress: 0.6, speed: 0.003, from: 1, to: 2 },
      { progress: 0.3, speed: 0.005, from: 2, to: 3 },
      { progress: 0.8, speed: 0.004, from: 3, to: 0 },
      { progress: 0.4, speed: 0.003, from: 0, to: 2 },
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      t += prefersReducedMotion ? 0 : 0.004;

      // Responsive scale factor based on container width & height
      const scale = Math.min(1, Math.min(w / 380, h / 320));

      // Outer faint aura
      const grad = ctx.createRadialGradient(cx, cy, 10 * scale, cx, cy, 180 * scale);
      grad.addColorStop(0, 'rgba(2, 132, 199, 0.08)');
      grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Orbital Rings
      // Ring 1 (outer dashed)
      ctx.beginPath();
      ctx.arc(cx, cy, 124 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ring 2 (mid subtle)
      ctx.beginPath();
      ctx.arc(cx, cy, 76 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ring 3 (inner faint)
      ctx.beginPath();
      ctx.arc(cx, cy, 42 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating subtle radar ray
      const radarAngle = t * 0.8;
      const rx = cx + Math.cos(radarAngle) * (135 * scale);
      const ry = cy + Math.sin(radarAngle) * (135 * scale);
      const rayGrad = ctx.createLinearGradient(cx, cy, rx, ry);
      rayGrad.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
      rayGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Calculate node positions
      const currentNodes = baseNodes.map((node) => {
        const r = node.baseR * scale;
        const angle = node.angle + t * 0.15;
        const nx = cx + Math.cos(angle) * r;
        const ny = cy + Math.sin(angle) * r;
        return { ...node, nx, ny, r, angle };
      });

      // Connecting lines from center to nodes
      currentNodes.forEach((node) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.nx, node.ny);
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Connecting polygon
      ctx.beginPath();
      ctx.moveTo(currentNodes[0].nx, currentNodes[0].ny);
      for (let i = 1; i < currentNodes.length; i++) {
        ctx.lineTo(currentNodes[i].nx, currentNodes[i].ny);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Traveling particles
      particles.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const fromNode = currentNodes[p.from];
        const toNode = currentNodes[p.to];
        const px = fromNode.nx + (toNode.nx - fromNode.nx) * p.progress;
        const py = fromNode.ny + (toNode.ny - fromNode.ny) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = fromNode.color;
        ctx.shadowColor = fromNode.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Center Node (Q-SHIELD)
      const pulse = Math.sin(t * 2) * (3 * scale);
      ctx.beginPath();
      ctx.arc(cx, cy, (30 * scale) + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.04)';
      ctx.fill();

      // Core border
      ctx.beginPath();
      ctx.arc(cx, cy, 24 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#0284C7';
      ctx.fill();

      // Center Text
      const centerFontSize = Math.max(8, Math.round(9.5 * scale));
      ctx.fillStyle = '#0F172A';
      ctx.font = `800 ${centerFontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Q-SHIELD', cx, cy + (13 * scale));

      // Render Satellite Nodes
      currentNodes.forEach((node) => {
        // Node outer halo
        ctx.beginPath();
        ctx.arc(node.nx, node.ny, 11 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}15`;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(node.nx, node.ny, 5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label pill
        const labelDist = 22 * scale;
        const lx = cx + Math.cos(node.angle) * (node.r + labelDist);
        const ly = cy + Math.sin(node.angle) * (node.r + labelDist);

        const labelFontSize = Math.max(8, Math.round(9.5 * scale));
        ctx.fillStyle = '#0F172A';
        ctx.font = `700 ${labelFontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, lx, ly - (4 * scale));

        // State indicator
        const stateFontSize = Math.max(7.5, Math.round(8.5 * scale));
        ctx.fillStyle = node.color;
        ctx.font = `500 ${stateFontSize}px "JetBrains Mono", monospace`;
        ctx.fillText(node.state, lx, ly + (6 * scale));
      });

      if (!prefersReducedMotion) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    draw(); // first frame always; rAF only continues if motion is allowed

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: 520,
      minHeight: 280,
      aspectRatio: '16/10',
      position: 'relative',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(246,246,243,0.4) 70%, transparent 100%)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(15, 23, 42, 0.05)',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
