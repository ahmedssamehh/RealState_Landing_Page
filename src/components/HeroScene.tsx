'use client';

/**
 * ---------------------------------------------------------------------------
 * HERO SCENE - reusable React Three Fiber architectural experience.
 * ---------------------------------------------------------------------------
 * The building is authored as an abstract architectural massing so the hero
 * works with zero external assets. To swap in a real model, pass a `modelUrl`
 * (.glb / .gltf) - the loader path is already wired below and the generated
 * massing is skipped entirely.
 *
 *   <HeroScene modelUrl="/models/residence.glb" />
 * ---------------------------------------------------------------------------
 */

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Edges, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '@/lib/animations';

const IVORY = '#EEEBDD';
const CHAMPAGNE = '#D8B6A4';
const BURGUNDY = '#630000';

type SceneProps = {
  /** Optional .glb/.gltf model. When provided it replaces the generated massing. */
  modelUrl?: string;
  /** 0 = top of page, 1 = hero fully scrolled past. Drives the camera pull-back. */
  scrollRef?: React.MutableRefObject<number>;
  /** Reduces geometry, lights and pixel ratio for small / low-power devices. */
  lowPower?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Materials                                                                  */
/* -------------------------------------------------------------------------- */

function useArchMaterials() {
  return useMemo(() => {
    const concrete = new THREE.MeshStandardMaterial({
      color: '#1b1a1a',
      roughness: 0.85,
      metalness: 0.05,
    });
    const stone = new THREE.MeshStandardMaterial({
      color: '#2a2726',
      roughness: 0.7,
      metalness: 0.08,
    });
    // A transmissive material forces a second render pass every frame — the
    // most expensive thing in this scene, and indistinguishable at this scale
    // against a dark ground. Standard material, same read, a fraction of the cost.
    const glass = new THREE.MeshStandardMaterial({
      color: '#0b0f13',
      roughness: 0.08,
      metalness: 0.35,
      transparent: true,
      opacity: 0.95,
    });
    const interior = new THREE.MeshBasicMaterial({ color: '#ffdcb4' });
    const accent = new THREE.MeshStandardMaterial({
      color: BURGUNDY,
      emissive: BURGUNDY,
      emissiveIntensity: 0.35,
      roughness: 0.6,
    });
    return { concrete, stone, glass, interior, accent };
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Generated architectural massing (default hero subject)                     */
/* -------------------------------------------------------------------------- */

function Massing({ lowPower }: { lowPower: boolean }) {
  const m = useArchMaterials();

  /** Four stacked levels - one per residence. */
  const levels = useMemo(
    () => [
      { y: 0.0, w: 4.6, d: 3.4, h: 1.05, x: 0, z: 0 },
      { y: 1.15, w: 4.2, d: 3.1, h: 1.05, x: 0.22, z: 0.1 },
      { y: 2.3, w: 3.7, d: 3.4, h: 1.05, x: -0.2, z: -0.05 },
      { y: 3.45, w: 2.9, d: 2.6, h: 1.0, x: 0.35, z: 0.2 },
    ],
    []
  );

  return (
    <group position={[1.35, -1.9, 0]} scale={0.94}>
      {/* Podium */}
      <mesh receiveShadow castShadow position={[0, -0.28, 0]} material={m.stone}>
        <boxGeometry args={[7.4, 0.45, 5.6]} />
      </mesh>

      {levels.map((l, i) => (
        <group key={i} position={[l.x, l.y + l.h / 2, l.z]}>
          {/* Glazed core - the champagne edge reads as the window frame */}
          <mesh castShadow receiveShadow material={m.glass}>
            <boxGeometry args={[l.w * 0.97, l.h * 0.82, l.d * 0.97]} />
            <Edges threshold={15}>
              <lineBasicMaterial color={CHAMPAGNE} transparent opacity={0.3} />
            </Edges>
          </mesh>

          {/* Warm interior light block, read through the glass */}
          <mesh material={m.interior} position={[0, -l.h * 0.12, 0]}>
            <boxGeometry args={[l.w * 0.78, l.h * 0.055, l.d * 0.78]} />
          </mesh>

          {/* Lit interior bands on the two visible faces - the building reads
              as occupied rather than as a massing study. */}
          <mesh position={[l.w * 0.06, -l.h * 0.02, l.d * 0.487]}>
            <planeGeometry args={[l.w * 0.66, l.h * 0.14]} />
            <meshBasicMaterial color="#ffcb92" transparent opacity={0.92} fog={false} />
          </mesh>
          <mesh
            rotation={[0, Math.PI / 2, 0]}
            position={[l.w * 0.487, -l.h * 0.05, l.d * 0.05]}
          >
            <planeGeometry args={[l.d * 0.58, l.h * 0.1]} />
            <meshBasicMaterial color="#f0b985" transparent opacity={0.6} fog={false} />
          </mesh>

          {/* Floor slab / cantilever */}
          <mesh castShadow receiveShadow material={m.concrete} position={[0, l.h * 0.5, 0]}>
            <boxGeometry args={[l.w + 0.55, l.h * 0.15, l.d + 0.55]} />
            <Edges threshold={15}>
              <lineBasicMaterial color={IVORY} transparent opacity={0.22} />
            </Edges>
          </mesh>

          {/* Solid service wall */}
          <mesh
            castShadow
            receiveShadow
            material={m.concrete}
            position={[-l.w / 2 + 0.16, 0, -l.d / 2 + 0.3]}
          >
            <boxGeometry args={[0.3, l.h * 0.86, l.d * 0.55]} />
          </mesh>

          {/* Brise-soleil fins on the western face */}
          {!lowPower &&
            Array.from({ length: 5 }).map((_, f) => (
              <mesh
                key={f}
                castShadow
                material={m.stone}
                position={[l.w / 2 + 0.16, 0, -l.d / 2 + 0.28 + (f * (l.d - 0.4)) / 4]}
              >
                <boxGeometry args={[0.08, l.h * 0.8, 0.05]} />
              </mesh>
            ))}
        </group>
      ))}

      {/* Vertical circulation core */}
      <mesh castShadow receiveShadow material={m.concrete} position={[-2.35, 2.1, -1.5]}>
        <boxGeometry args={[0.75, 4.6, 0.9]} />
      </mesh>

      {/* Burgundy accent - the entrance reveal */}
      <mesh material={m.accent} position={[0, 0.08, 2.86]}>
        <boxGeometry args={[0.85, 0.5, 0.04]} />
      </mesh>

      {/* Roof garden on the upper residence */}
      <mesh receiveShadow material={m.stone} position={[0.35, 4.5, 0.2]}>
        <boxGeometry args={[3.2, 0.06, 2.9]} />
      </mesh>
      <mesh material={m.interior} position={[1.15, 4.55, 0.2]}>
        <boxGeometry args={[1.2, 0.02, 1.4]} />
      </mesh>

      {/* Ground plane catching the light */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#050505" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Optional external model                                                    */
/* -------------------------------------------------------------------------- */

function ArchitecturalModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} />;
}

/* -------------------------------------------------------------------------- */
/* Motion rig - pointer parallax + scroll response + slow drift               */
/* -------------------------------------------------------------------------- */

function Rig({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef?: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { pointer, size } = useThree();
  const state = useRef({ rx: 0, ry: 0, cz: 11.5, cy: 1.6, framed: false });

  /* Portrait viewports need the camera further back, and the massing centred,
     so the building is never cropped by the narrow frame. */
  const portrait = size.height > size.width;
  const baseZ = portrait ? 18 : 11.5;
  const offsetX = portrait ? -0.85 : 0;

  useEffect(() => {
    state.current.framed = false;
  }, [portrait]);

  useFrame((_, delta) => {
    const t = Math.min(delta * 3.2, 0.12);

    // Snap to the correct framing on the first frame (and whenever the
    // viewport flips orientation) rather than easing in from the wrong one.
    if (!state.current.framed) {
      state.current.cz = baseZ;
      state.current.framed = true;
    }
    const progress = scrollRef?.current ?? 0;

    // Slow cinematic drift, gently steered by the pointer.
    const targetY = pointer.x * 0.28 + Math.sin(performance.now() * 0.00007) * 0.16;
    const targetX = -pointer.y * 0.1 + 0.03;

    state.current.ry = lerp(state.current.ry, targetY, t);
    state.current.rx = lerp(state.current.rx, targetX, t);

    if (group.current) {
      group.current.rotation.y = state.current.ry;
      group.current.rotation.x = state.current.rx;
      // On portrait the massing sits high in the frame, above the headline.
      group.current.position.y = (portrait ? 2.1 : 0) - progress * 1.4;
      group.current.position.x = offsetX;
    }

    if (camera.current) {
      state.current.cz = lerp(state.current.cz, baseZ + progress * 4.5, t);
      state.current.cy = lerp(state.current.cy, 1.6 + progress * 1.1, t);
      camera.current.position.z = state.current.cz;
      camera.current.position.y = state.current.cy;
      camera.current.lookAt(0, 0.2, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault fov={portrait ? 36 : 32} position={[0, 1.6, baseZ]} />
      <group ref={group} scale={portrait ? 0.62 : 1} position-x={offsetX}>
        {children}
      </group>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Lighting - cinematic, deep and dark                                        */
/* -------------------------------------------------------------------------- */

function Lighting({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} color={IVORY} />
      {/* Key: low western sun */}
      <directionalLight
        castShadow={!lowPower}
        position={[7, 6.5, 4]}
        intensity={2.7}
        color={CHAMPAGNE}
        shadow-mapSize={lowPower ? 512 : 1024}
        shadow-bias={-0.0006}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 40]} />
      </directionalLight>
      {/* Fill: cool sky bounce */}
      <directionalLight position={[-6, 4, -5]} intensity={0.5} color="#8fa4c8" />
      {/* Accent: burgundy rim from below */}
      <pointLight position={[-3.5, -1.2, 3.5]} intensity={9} distance={14} color={BURGUNDY} />
      {/* Warm interior glow */}
      <pointLight position={[0.4, 0.6, 1.2]} intensity={5} distance={9} color={CHAMPAGNE} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

export default function HeroScene({ modelUrl, scrollRef, lowPower = false }: SceneProps) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
        scene.fog = new THREE.FogExp2('#000000', 0.018);
      }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Lighting lowPower={lowPower} />
        <Rig scrollRef={scrollRef}>
          {modelUrl ? <ArchitecturalModel url={modelUrl} /> : <Massing lowPower={lowPower} />}
          {!lowPower && (
            <ContactShadows
              position={[0, -2.42, 0]}
              opacity={0.7}
              scale={22}
              blur={2.8}
              far={9}
              frames={1}
              resolution={256}
              color="#000000"
            />
          )}
        </Rig>
      </Suspense>
    </Canvas>
  );
}
