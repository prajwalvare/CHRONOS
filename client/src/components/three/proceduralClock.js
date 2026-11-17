import * as THREE from 'three';

/**
 * Generates a 2D Shape for a mechanical gear with teeth and circular cutouts (spokes).
 * @param {number} outerRadius - Distance to tip of teeth
 * @param {number} innerRadius - Base radius of gear body
 * @param {number} teethCount - Number of gear teeth
 * @param {number} holeRadius - Center arbor hole radius
 * @param {number} spokeCutouts - Number of decorative cutouts in the gear body
 */
export function createGearShape(
  outerRadius = 1.0,
  innerRadius = 0.85,
  teethCount = 24,
  holeRadius = 0.15,
  spokeCutouts = 4
) {
  const shape = new THREE.Shape();
  const toothDepth = outerRadius - innerRadius;
  const anglePerTooth = (Math.PI * 2) / teethCount;
  const halfTooth = anglePerTooth * 0.25;

  // Outer perimeter with teeth
  for (let i = 0; i < teethCount; i++) {
    const angle = i * anglePerTooth;
    const a0 = angle;
    const a1 = angle + halfTooth;
    const a2 = angle + halfTooth * 2;
    const a3 = angle + halfTooth * 3;

    // Root to tip, tip width, tip to root
    const x0 = Math.cos(a0) * innerRadius;
    const y0 = Math.sin(a0) * innerRadius;
    const x1 = Math.cos(a1) * outerRadius;
    const y1 = Math.sin(a1) * outerRadius;
    const x2 = Math.cos(a2) * outerRadius;
    const y2 = Math.sin(a2) * outerRadius;
    const x3 = Math.cos(a3) * innerRadius;
    const y3 = Math.sin(a3) * innerRadius;

    if (i === 0) {
      shape.moveTo(x0, y0);
    } else {
      shape.lineTo(x0, y0);
    }
    shape.lineTo(x1, y1);
    shape.lineTo(x2, y2);
    shape.lineTo(x3, y3);
  }
  shape.closePath();

  // Center arbor hole
  const centerHole = new THREE.Path();
  centerHole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(centerHole);

  // Decorative spoke cutouts (antique watch wheel weight reduction)
  if (spokeCutouts > 0) {
    const cutoutRadius = innerRadius * 0.58;
    const cutoutDist = innerRadius * 0.5;
    const angleStep = (Math.PI * 2) / spokeCutouts;

    for (let j = 0; j < spokeCutouts; j++) {
      const cutoutAngle = j * angleStep;
      const cx = Math.cos(cutoutAngle) * cutoutDist;
      const cy = Math.sin(cutoutAngle) * cutoutDist;
      const cutoutHole = new THREE.Path();
      cutoutHole.absarc(cx, cy, cutoutRadius * 0.35, 0, Math.PI * 2, true);
      shape.holes.push(cutoutHole);
    }
  }

  return shape;
}

/**
 * Creates a canvas texture for the antique Roman numeral dial face.
 */
export function createDialTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background: Deep dark vintage brass/parchment with subtle vignette
  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, size * 0.1, center, center, size * 0.48);
  gradient.addColorStop(0, '#1c1813');
  gradient.addColorStop(0.7, '#12100d');
  gradient.addColorStop(1, '#090807');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Outer Chapter Rings
  ctx.strokeStyle = '#C9A45C';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(center, center, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center, center, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center, center, size * 0.33, 0, Math.PI * 2);
  ctx.stroke();

  // Minute / Second Railroad Track Tick Marks
  ctx.fillStyle = '#C9A45C';
  for (let m = 0; m < 60; m++) {
    const angle = (m * Math.PI) / 30 - Math.PI / 2;
    const isHour = m % 5 === 0;
    const tickLen = isHour ? 18 : 8;
    const rOuter = size * 0.45;
    const rInner = rOuter - tickLen;

    ctx.lineWidth = isHour ? 3 : 1.5;
    ctx.strokeStyle = isHour ? '#E5C78A' : '#A98143';
    ctx.beginPath();
    ctx.moveTo(center + Math.cos(angle) * rOuter, center + Math.sin(angle) * rOuter);
    ctx.lineTo(center + Math.cos(angle) * rInner, center + Math.sin(angle) * rInner);
    ctx.stroke();
  }

  // Roman Numerals
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.font = 'bold 52px "Cinzel", "Times New Roman", serif';
  ctx.fillStyle = '#E5C78A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const numRadius = size * 0.39;
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const x = center + Math.cos(angle) * numRadius;
    const y = center + Math.sin(angle) * numRadius;
    ctx.fillText(romanNumerals[i], x, y);
  }

  // Center Open Heart Cutout Indicator (engraved mechanical circle)
  ctx.strokeStyle = '#A98143';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(center, center, size * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Antique Typography Inscription: "CHRONOS"
  ctx.font = '600 24px "Cinzel", serif';
  ctx.fillStyle = '#C9A45C';
  ctx.letterSpacing = '8px';
  ctx.fillText('C H R O N O S', center, center - size * 0.16);

  ctx.font = 'italic 16px serif';
  ctx.fillStyle = '#9A907E';
  ctx.fillText('TEMPUS FUGIT', center, center + size * 0.16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}
