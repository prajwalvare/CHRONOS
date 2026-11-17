import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGearShape, createDialTexture } from './proceduralClock';

/**
 * MechanicalClock — Clean, Centered Antique Timepiece
 * - Circular front-facing view with subtle horological depth.
 * - NO horizontal blocking visor / lid over the gears.
 * - When scrolling, the components separate smoothly along the axis so every part is visible.
 */
export default function MechanicalClock({ explosionProgress = 0 }) {
  // Layer Group Refs
  const bezelRef = useRef();
  const handsRef = useRef();
  const dialRef = useRef();
  const gearsRef = useRef();
  const platesRef = useRef();
  const casebackRef = useRef();

  // Mechanical rotation refs
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
        color: new THREE.Color('#1F3B54'),
        metalness: 0.8,
        roughness: 0.25,
      }),
      rubyJewel: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C70039'),
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.2,
      }),
    };
  }, []);

  // Procedural Geometries
  const gearGeometries = useMemo(() => {
    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.008 };
    return {
      largeGear: new THREE.ExtrudeGeometry(createGearShape(1.35, 1.2, 36, 0.2, 5), extrudeSettings),
      centerGear: new THREE.ExtrudeGeometry(createGearShape(0.85, 0.74, 24, 0.15, 4), extrudeSettings),
      mediumGear: new THREE.ExtrudeGeometry(createGearShape(0.62, 0.52, 18, 0.1, 4), extrudeSettings),
      escapeGear: new THREE.ExtrudeGeometry(createGearShape(0.42, 0.35, 15, 0.08, 3), extrudeSettings),
      balanceWheel: new THREE.TorusGeometry(0.48, 0.035, 16, 48),
    };
  }, []);

  const dialTexture = useMemo(() => createDialTexture(), []);

  // Real-time ticking & smooth scroll separation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Live ticking
    if (secondHandRef.current) secondHandRef.current.rotation.z = -time * 1.0;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z = -time * (1.0 / 60);
    if (hourHandRef.current) hourHandRef.current.rotation.z = -time * (1.0 / 720);

    // 2. Interlocking gear train rotations
    if (centerGearRef.current) centerGearRef.current.rotation.z = -time * 0.4;
    if (thirdGearRef.current) thirdGearRef.current.rotation.z = time * 0.8;
    if (escapeGearRef.current) escapeGearRef.current.rotation.z = -time * 2.4;

    // 3. Balance wheel oscillation
    if (balanceWheelRef.current) {
      balanceWheelRef.current.rotation.z = Math.sin(time * 12) * 1.2;
    }

    // 4. Smooth, centered axial separation on scroll
    const p = explosionProgress; // 0 (assembled) -> 1 (separated)

    if (bezelRef.current) {
      bezelRef.current.position.z = THREE.MathUtils.lerp(bezelRef.current.position.z, 0.2 + p * 1.8, 0.1);
      bezelRef.current.position.y = THREE.MathUtils.lerp(bezelRef.current.position.y, p * 0.9, 0.1);
    }

    if (handsRef.current) {
      handsRef.current.position.z = THREE.MathUtils.lerp(handsRef.current.position.z, 0.15 + p * 1.4, 0.1);
      handsRef.current.position.y = THREE.MathUtils.lerp(handsRef.current.position.y, p * 0.6, 0.1);
    }

    if (dialRef.current) {
      dialRef.current.position.z = THREE.MathUtils.lerp(dialRef.current.position.z, 0.08 + p * 1.0, 0.1);
      dialRef.current.position.y = THREE.MathUtils.lerp(dialRef.current.position.y, p * 0.4, 0.1);
    }

    if (gearsRef.current) {
      gearsRef.current.position.z = THREE.MathUtils.lerp(gearsRef.current.position.z, 0.0 + p * 0.2, 0.1);
      gearsRef.current.rotation.z = THREE.MathUtils.lerp(gearsRef.current.rotation.z, p * 0.5, 0.1);
    }

    if (platesRef.current) {
      platesRef.current.position.z = THREE.MathUtils.lerp(platesRef.current.position.z, -0.15 - p * 0.8, 0.1);
      platesRef.current.position.y = THREE.MathUtils.lerp(platesRef.current.position.y, -p * 0.5, 0.1);
    }

    if (casebackRef.current) {
      casebackRef.current.position.z = THREE.MathUtils.lerp(casebackRef.current.position.z, -0.3 - p * 1.5, 0.1);
      casebackRef.current.position.y = THREE.MathUtils.lerp(casebackRef.current.position.y, -p * 0.9, 0.1);
    }
  });

  return (
    <group position={[0, -0.15, 0]} rotation={[0.08, -0.05, 0]}>
      {/* 1. OUTER BEZEL & CROWN */}
      <group ref={bezelRef} position={[0, 0, 0.2]}>
        <mesh material={materials.darkBrass}>
          <torusGeometry args={[2.55, 0.12, 20, 64]} />
        </mesh>
        <mesh material={materials.highlightGold} position={[0, 0, -0.04]}>
          <torusGeometry args={[2.64, 0.07, 16, 64]} />
        </mesh>

        {/* Pocket Watch Winding Crown & Bow Loop at 12 o'clock */}
        <group position={[0, 2.78, 0]}>
          <mesh material={materials.brass} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.3, 24]} />
          </mesh>
          <mesh material={materials.highlightGold} position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          </mesh>
          <mesh material={materials.brass} position={[0, 0.52, 0]}>
            <torusGeometry args={[0.42, 0.07, 16, 32]} />
          </mesh>
        </group>
      </group>

      {/* 2. CLOCK HANDS */}
      <group ref={handsRef} position={[0, 0, 0.15]}>
        {/* Hour Hand */}
        <group ref={hourHandRef} position={[0, 0, 0.01]}>
          <mesh material={materials.steelBlue} position={[0, 0.65, 0]}>
            <boxGeometry args={[0.07, 1.3, 0.015]} />
          </mesh>
          <mesh material={materials.steelBlue} position={[0, 0.95, 0]}>
            <torusGeometry args={[0.16, 0.04, 16, 24]} />
          </mesh>
        </group>

        {/* Minute Hand */}
        <group ref={minuteHandRef} position={[0, 0, 0.025]}>
          <mesh material={materials.steelBlue} position={[0, 0.95, 0]}>
            <boxGeometry args={[0.05, 1.9, 0.015]} />
          </mesh>
          <mesh material={materials.steelBlue} position={[0, 1.45, 0]}>
            <torusGeometry args={[0.13, 0.035, 16, 24]} />
          </mesh>
        </group>

        {/* Second Hand */}
        <group ref={secondHandRef} position={[0, 0, 0.04]}>
          <mesh material={materials.highlightGold} position={[0, 0.75, 0]}>
            <boxGeometry args={[0.02, 2.1, 0.01]} />
          </mesh>
          <mesh material={materials.highlightGold} position={[0, -0.35, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh material={materials.highlightGold} position={[0, 0, 0.01]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
          </mesh>
        </group>
      </group>

      {/* 3. ROMAN NUMERAL DIAL FACE (With Wide Open Heart to see all gears) */}
      <group ref={dialRef} position={[0, 0, 0.08]}>
        <mesh>
          <ringGeometry args={[0.9, 2.45, 64]} />
          <meshStandardMaterial map={dialTexture} roughness={0.4} metalness={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh material={materials.highlightGold}>
          <torusGeometry args={[0.9, 0.03, 16, 48]} />
        </mesh>
      </group>

      {/* 4. GEAR TRAIN (Fully visible, interlocking mechanical movement) */}
      <group ref={gearsRef} position={[0, 0, 0.0]}>
        {/* Center Main Gear */}
        <mesh ref={centerGearRef} geometry={gearGeometries.centerGear} material={materials.brass} position={[0, 0, 0.02]} />

        {/* Third Gear */}
        <mesh
          ref={thirdGearRef}
          geometry={gearGeometries.mediumGear}
          material={materials.highlightGold}
          position={[-0.88, -0.35, -0.01]}
        />

        {/* Escape Gear */}
        <mesh
          ref={escapeGearRef}
          geometry={gearGeometries.escapeGear}
          material={materials.brass}
          position={[-0.68, 0.48, -0.03]}
        />

        {/* Large Decorative Peripheral Gear */}
        <mesh
          geometry={gearGeometries.largeGear}
          material={materials.darkBrass}
          position={[0.78, 0.32, -0.05]}
          rotation={[0, 0, 0.4]}
        />

        {/* Oscillating Balance Wheel with Ruby Pivot */}
        <group position={[0.62, -0.58, -0.02]}>
          <mesh ref={balanceWheelRef} geometry={gearGeometries.balanceWheel} material={materials.highlightGold} />
          <mesh material={materials.highlightGold}>
            <cylinderGeometry args={[0.02, 0.02, 0.94, 12]} />
          </mesh>
          <mesh material={materials.highlightGold} rotation={[0, 0, Math.PI / 3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.94, 12]} />
          </mesh>
          <mesh material={materials.highlightGold} rotation={[0, 0, -Math.PI / 3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.94, 12]} />
          </mesh>
          <mesh material={materials.rubyJewel} position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* 5. MOVEMENT BRIDGES & JEWELS */}
      <group ref={platesRef} position={[0, 0, -0.1]}>
        <mesh material={materials.darkBrass} position={[-0.42, 0.1, 0.01]}>
          <boxGeometry args={[1.35, 0.48, 0.05]} />
        </mesh>
        <mesh material={materials.brass} position={[0.52, -0.42, 0.02]}>
          <boxGeometry args={[0.82, 0.38, 0.05]} />
        </mesh>

        {/* Ruby Pivot Jewels */}
        {[
          [0, 0, 0.04],
          [-0.88, -0.35, 0.04],
          [-0.68, 0.48, 0.04],
          [0.78, 0.32, 0.04],
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            <mesh material={materials.highlightGold}>
              <ringGeometry args={[0.06, 0.11, 16]} />
            </mesh>
            <mesh material={materials.rubyJewel} position={[0, 0, -0.01]}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 16]} />
            </mesh>
          </group>
        ))}

        {/* Engine-Turned Mainplate */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.darkBrass} position={[0, 0, -0.05]}>
          <cylinderGeometry args={[2.4, 2.4, 0.06, 64]} />
        </mesh>
      </group>

      {/* 6. CUVETTE CASEBACK */}
      <group ref={casebackRef} position={[0, 0, -0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.darkBrass}>
          <cylinderGeometry args={[2.5, 2.54, 0.12, 64]} />
        </mesh>
        <mesh material={materials.highlightGold} position={[0, 0, 0.02]}>
          <torusGeometry args={[2.52, 0.05, 16, 64]} />
        </mesh>
      </group>
    </group>
  );
}
