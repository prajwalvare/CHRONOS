import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGearShape, createDialTexture } from './proceduralClock';

/**
 * MechanicalClock — Procedural 3D Horological Model
 * Divided into strictly isolated axial layer groups matching the engineering blueprint:
 * 1. Crystal Glass Cover
 * 2. Outer Bezel & Winding Crown
 * 3. Clock Hands (Hour, Minute, Second)
 * 4. Roman Numeral Dial with Center Aperture
 * 5. Gear Train (Motion Works, Center Wheel, Escape Wheel, Balance Wheel)
 * 6. Movement Plates & Bridges (with Jewels & Screws)
 * 7. Cuvette Caseback
 */
export default function MechanicalClock({ explosionProgress = 0 }) {
  // Layer Group Refs for axial translation & differential rotation
  const glassRef = useRef();
  const bezelRef = useRef();
  const handsRef = useRef();
  const dialRef = useRef();
  const gearsRef = useRef();
  const platesRef = useRef();
  const casebackRef = useRef();

  // Individual gear refs for continuous mechanical rotation
  const centerGearRef = useRef();
  const escapeGearRef = useRef();
  const thirdGearRef = useRef();
  const balanceWheelRef = useRef();
  const hourHandRef = useRef();
  const minuteHandRef = useRef();
  const secondHandRef = useRef();

  // Materials
  const materials = useMemo(() => {
    return {
      brass: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#C9A45C'),
        metalness: 0.88,
        roughness: 0.28,
      }),
      darkBrass: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#A98143'),
        metalness: 0.85,
        roughness: 0.35,
      }),
      highlightGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E5C78A'),
        metalness: 0.92,
        roughness: 0.2,
      }),
      steelBlue: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2C4251'), // Heat-blued watchmaker steel
        metalness: 0.75,
        roughness: 0.25,
      }),
      rubyJewel: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C70039'),
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.2,
      }),
      crystalGlass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFFFFF'),
        transmission: 0.92,
        opacity: 0.28,
        transparent: true,
        roughness: 0.05,
        ior: 1.52,
        reflectivity: 0.5,
        depthWrite: false,
      }),
    };
  }, []);

  // Procedural Geometries
  const gearGeometries = useMemo(() => {
    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.008 };
    return {
      largeGear: new THREE.ExtrudeGeometry(createGearShape(1.4, 1.25, 36, 0.2, 5), extrudeSettings),
      centerGear: new THREE.ExtrudeGeometry(createGearShape(0.9, 0.78, 24, 0.15, 4), extrudeSettings),
      mediumGear: new THREE.ExtrudeGeometry(createGearShape(0.65, 0.55, 18, 0.1, 4), extrudeSettings),
      escapeGear: new THREE.ExtrudeGeometry(createGearShape(0.45, 0.38, 15, 0.08, 3), extrudeSettings),
      balanceWheel: new THREE.TorusGeometry(0.5, 0.035, 16, 48),
    };
  }, []);

  // Dial Texture
  const dialTexture = useMemo(() => createDialTexture(), []);

  // Real-time ticking & mechanical motion in R3F frame loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Hands rotation (smooth live ticking)
    if (secondHandRef.current) secondHandRef.current.rotation.z = -time * 1.0;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z = -time * (1.0 / 60);
    if (hourHandRef.current) hourHandRef.current.rotation.z = -time * (1.0 / 720);

    // 2. Interlocking gear train rotations
    if (centerGearRef.current) centerGearRef.current.rotation.z = -time * 0.4;
    if (thirdGearRef.current) thirdGearRef.current.rotation.z = time * 0.8;
    if (escapeGearRef.current) escapeGearRef.current.rotation.z = -time * 2.4;

    // 3. Balance wheel oscillation (harmonic hairspring movement)
    if (balanceWheelRef.current) {
      balanceWheelRef.current.rotation.z = Math.sin(time * 12) * 1.2;
    }

    // 4. GSAP Scroll-driven axial explosion interpolation
    // Target offsets along Z-axis according to blueprint layering:
    // Glass pushes forward (+Z), Bezel follows, Dial separates, Gears expand outward, Caseback pushes back (-Z)
    const p = explosionProgress; // 0 (assembled) -> 1 (fully exploded)

    if (glassRef.current) {
      glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 0.35 + p * 4.2, 0.1);
      glassRef.current.position.y = THREE.MathUtils.lerp(glassRef.current.position.y, p * 0.8, 0.1);
      glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, p * 0.3, 0.1);
    }

    if (bezelRef.current) {
      bezelRef.current.position.z = THREE.MathUtils.lerp(bezelRef.current.position.z, 0.2 + p * 3.2, 0.1);
      bezelRef.current.rotation.z = THREE.MathUtils.lerp(bezelRef.current.rotation.z, p * 0.6, 0.1);
    }

    if (handsRef.current) {
      handsRef.current.position.z = THREE.MathUtils.lerp(handsRef.current.position.z, 0.15 + p * 2.4, 0.1);
    }

    if (dialRef.current) {
      dialRef.current.position.z = THREE.MathUtils.lerp(dialRef.current.position.z, 0.08 + p * 1.6, 0.1);
      dialRef.current.rotation.y = THREE.MathUtils.lerp(dialRef.current.rotation.y, p * 0.2, 0.1);
    }

    if (gearsRef.current) {
      gearsRef.current.position.z = THREE.MathUtils.lerp(gearsRef.current.position.z, 0.0 + p * 0.4, 0.1);
      // Explode gears laterally as well to reveal individual wheels
      gearsRef.current.rotation.z = THREE.MathUtils.lerp(gearsRef.current.rotation.z, p * 0.9, 0.1);
    }

    if (platesRef.current) {
      platesRef.current.position.z = THREE.MathUtils.lerp(platesRef.current.position.z, -0.15 - p * 1.2, 0.1);
      platesRef.current.rotation.x = THREE.MathUtils.lerp(platesRef.current.rotation.x, -p * 0.2, 0.1);
    }

    if (casebackRef.current) {
      casebackRef.current.position.z = THREE.MathUtils.lerp(casebackRef.current.position.z, -0.3 - p * 2.8, 0.1);
      casebackRef.current.position.y = THREE.MathUtils.lerp(casebackRef.current.position.y, -p * 0.6, 0.1);
    }
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.15, -0.1, 0]}>
      {/* 1. CRYSTAL GLASS COVER */}
      <group ref={glassRef} position={[0, 0, 0.35]}>
        <mesh material={materials.crystalGlass}>
          <cylinderGeometry args={[2.55, 2.55, 0.05, 64]} />
        </mesh>
        {/* Subtle glass rim highlight */}
        <mesh position={[0, 0, 0.025]}>
          <ringGeometry args={[2.52, 2.55, 64]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* 2. OUTER BEZEL & WINDING CROWN */}
      <group ref={bezelRef} position={[0, 0, 0.2]}>
        {/* Outer Stepped Bezel Ring */}
        <mesh material={materials.darkBrass}>
          <torusGeometry args={[2.62, 0.14, 20, 64]} />
        </mesh>
        <mesh material={materials.highlightGold} position={[0, 0, -0.05]}>
          <torusGeometry args={[2.72, 0.08, 16, 64]} />
        </mesh>
        {/* Pocket Watch Top Winding Crown & Bow Loop (At 12 o'clock / Y=2.85) */}
        <group position={[0, 2.85, 0]}>
          {/* Winding Crown Stem */}
          <mesh material={materials.brass} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.35, 24]} />
          </mesh>
          {/* Fluted Crown */}
          <mesh material={materials.highlightGold} position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 32]} />
          </mesh>
          {/* Oval Suspension Bow Ring */}
          <mesh material={materials.brass} position={[0, 0.55, 0]}>
            <torusGeometry args={[0.45, 0.07, 16, 32]} />
          </mesh>
        </group>
      </group>

      {/* 3. CLOCK HANDS */}
      <group ref={handsRef} position={[0, 0, 0.15]}>
        {/* Hour Hand (Breguet Moon/Pomme shape) */}
        <group ref={hourHandRef} position={[0, 0, 0.01]}>
          <mesh material={materials.steelBlue} position={[0, 0.65, 0]}>
            <boxGeometry args={[0.07, 1.3, 0.015]} />
          </mesh>
          <mesh material={materials.steelBlue} position={[0, 0.95, 0]}>
            <torusGeometry args={[0.16, 0.04, 16, 24]} />
          </mesh>
        </group>

        {/* Minute Hand (Longer, slender) */}
        <group ref={minuteHandRef} position={[0, 0, 0.025]}>
          <mesh material={materials.steelBlue} position={[0, 0.95, 0]}>
            <boxGeometry args={[0.05, 1.9, 0.015]} />
          </mesh>
          <mesh material={materials.steelBlue} position={[0, 1.45, 0]}>
            <torusGeometry args={[0.13, 0.035, 16, 24]} />
          </mesh>
        </group>

        {/* Second Hand (Fine antique gold counterweighted needle) */}
        <group ref={secondHandRef} position={[0, 0, 0.04]}>
          <mesh material={materials.highlightGold} position={[0, 0.75, 0]}>
            <boxGeometry args={[0.02, 2.1, 0.01]} />
          </mesh>
          <mesh material={materials.highlightGold} position={[0, -0.35, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          {/* Center Cap Arbor Nut */}
          <mesh material={materials.highlightGold} position={[0, 0, 0.01]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
          </mesh>
        </group>
      </group>

      {/* 4. ROMAN NUMERAL DIAL FACE (With Center Open-Heart Hole) */}
      <group ref={dialRef} position={[0, 0, 0.08]}>
        {/* Dial Face with Canvas Texture */}
        <mesh>
          <ringGeometry args={[0.85, 2.5, 64]} />
          <meshStandardMaterial map={dialTexture} roughness={0.4} metalness={0.65} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Gold Rim around Open-Heart Aperture */}
        <mesh material={materials.highlightGold}>
          <torusGeometry args={[0.85, 0.03, 16, 48]} />
        </mesh>
      </group>

      {/* 5. GEAR TRAIN (Interlocking Mechanical Movement) */}
      <group ref={gearsRef} position={[0, 0, 0.0]}>
        {/* Center Main Gear (Arbor Wheel) */}
        <mesh ref={centerGearRef} geometry={gearGeometries.centerGear} material={materials.brass} position={[0, 0, 0.02]} />

        {/* Third Gear (Meshed with Center) */}
        <mesh
          ref={thirdGearRef}
          geometry={gearGeometries.mediumGear}
          material={materials.highlightGold}
          position={[-0.95, -0.4, -0.02]}
        />

        {/* Escape Gear & Pinion */}
        <mesh
          ref={escapeGearRef}
          geometry={gearGeometries.escapeGear}
          material={materials.brass}
          position={[-0.75, 0.55, -0.04]}
        />

        {/* Large Decorative Peripheral Gear */}
        <mesh
          geometry={gearGeometries.largeGear}
          material={materials.darkBrass}
          position={[0.85, 0.35, -0.06]}
          rotation={[0, 0, 0.4]}
        />

        {/* Balance Wheel with Oscillating Rim & Ruby Endstone */}
        <group position={[0.7, -0.65, -0.03]}>
          <mesh ref={balanceWheelRef} geometry={gearGeometries.balanceWheel} material={materials.highlightGold} />
          {/* 3 Crossed Spokes for Balance Wheel */}
          <mesh material={materials.highlightGold}>
            <cylinderGeometry args={[0.02, 0.02, 0.96, 12]} />
          </mesh>
          <mesh material={materials.highlightGold} rotation={[0, 0, Math.PI / 3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.96, 12]} />
          </mesh>
          <mesh material={materials.highlightGold} rotation={[0, 0, -Math.PI / 3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.96, 12]} />
          </mesh>
          {/* Central Ruby Pivot Jewel */}
          <mesh material={materials.rubyJewel} position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* 6. MOVEMENT BRIDGES, PLATES & JEWELS */}
      <group ref={platesRef} position={[0, 0, -0.15]}>
        {/* Curving Escapement Bridge */}
        <mesh material={materials.darkBrass} position={[-0.45, 0.1, 0]}>
          <boxGeometry args={[1.5, 0.55, 0.06]} />
        </mesh>
        {/* Balance Bridge (Balance Cock with Fine Regulation Arm) */}
        <mesh material={materials.brass} position={[0.6, -0.5, 0.02]}>
          <boxGeometry args={[0.9, 0.45, 0.06]} />
        </mesh>

        {/* Ruby Pivot Jewels on Movement Plate */}
        {[
          [0, 0, 0.04],
          [-0.95, -0.4, 0.04],
          [-0.75, 0.55, 0.04],
          [0.85, 0.35, 0.04],
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            {/* Brass chaton ring */}
            <mesh material={materials.highlightGold}>
              <ringGeometry args={[0.07, 0.12, 16]} />
            </mesh>
            {/* Synthetic ruby bearing */}
            <mesh material={materials.rubyJewel} position={[0, 0, -0.01]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            </mesh>
          </group>
        ))}

        {/* Engine-Turned Mainplate (Perlage base plate) */}
        <mesh material={materials.darkBrass} position={[0, 0, -0.06]}>
          <cylinderGeometry args={[2.5, 2.5, 0.08, 64]} />
        </mesh>
      </group>

      {/* 7. CUVETTE CASEBACK (Heavy Ribbed Antique Pocket Watch Case) */}
      <group ref={casebackRef} position={[0, 0, -0.3]}>
        <mesh material={materials.darkBrass}>
          <cylinderGeometry args={[2.65, 2.7, 0.18, 64]} />
        </mesh>
        {/* Ribbed Coin-Edge Pattern on Case Perimeter */}
        <mesh material={materials.brass} position={[0, 0, 0.02]}>
          <torusGeometry args={[2.68, 0.06, 16, 64]} />
        </mesh>
      </group>
    </group>
  );
}
