import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import MechanicalClock from './MechanicalClock';

/**
 * ClockScene — Clean Centered 3D Canvas
 */
export default function ClockScene({ explosionProgress = 0, opacity = 1 }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity, zIndex: 10 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8.0], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} color="#362E20" />

          {/* Key Light */}
          <directionalLight
            position={[4, 6, 6]}
            intensity={3.0}
            color="#FFF4D4"
          />

          {/* Rim Light */}
          <directionalLight
            position={[-5, -4, 4]}
            intensity={1.4}
            color="#C9A45C"
          />

          {/* Center Point Light to make gears sparkle */}
          <pointLight
            position={[0.2, 0.1, 1.8]}
            intensity={2.0}
            distance={5}
            color="#E5C78A"
          />

          {/* Mechanical Clock */}
          <MechanicalClock explosionProgress={explosionProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
