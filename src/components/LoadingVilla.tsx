'use client';

/**
 * The hero's villa, turning slowly on the loading screen.
 *
 * Same geometry as the hero — imported, not duplicated — but deliberately the
 * cheapest possible presentation: low pixel ratio, no antialiasing, no
 * shadows, no contact shadows, low-power GPU hint. It shares the page with the
 * hero's canvas for only a few seconds, so it must not compete for budget
 * while the real scene is warming up.
 */

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Villa } from './HeroScene';

const IVORY = '#EEEBDD';

/** One unhurried turn — roughly 14 seconds per revolution. */
const SPIN_SPEED = (Math.PI * 2) / 14;

function Turntable({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (group.current) group.current.rotation.y += SPIN_SPEED * dt;
    camera.lookAt(0, 0.15, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function LoadingVilla() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        scene.fog = new THREE.FogExp2(IVORY, 0.01);
      }}
      className="h-full w-full"
      aria-hidden
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} color={IVORY} />
        <directionalLight position={[9, 8.5, 7]} intensity={1.8} color={IVORY} />
        <directionalLight position={[-8, 6, -7]} intensity={0.5} color={IVORY} />
        <directionalLight position={[-4, 5, -10]} intensity={0.4} color={IVORY} />
        <PerspectiveCamera makeDefault fov={28} position={[0, 3.4, 27]} />
        <Turntable>
          <Villa lowPower />
        </Turntable>
      </Suspense>
    </Canvas>
  );
}
