import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import MechanicalClock from './MechanicalClock';

/**
 * ClockScene — 3D Canvas Host with Horological Lighting & Perspective Camera
 */
export default function ClockScene({ explosionProgress = 0, opacity = 1 }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity, zIndex: 10 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient Studio Lighting (Warm Horological Glow) */}
          <ambientLight intensity={0.65} color="#382E1E" />

          {/* Key Light: High-angle golden spotlight creating rich specular reflections on brass */}
          <directionalLight
            position={[4, 6, 6]}
            intensity={2.8}
            color="#FFF4D4"
          />

          {/* Rim Light: Accentuates the beveled glass crystal and coin-edge bezel */}
          <directionalLight
            position={[-5, -4, 4]}
            intensity={1.2}
            color="#C9A45C"
          />

          {/* Jewel Point Light: Highlights ruby endstones and motion work depth */}
          <pointLight
            position={[0.5, -0.4, 1.2]}
            intensity={1.8}
            distance={4}
            color="#E5C78A"
          />

          {/* The Clock Assembly */}
          <MechanicalClock explosionProgress={explosionProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
