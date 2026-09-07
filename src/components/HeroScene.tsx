'use client';

/**
 * ---------------------------------------------------------------------------
 * HERO SCENE — interactive 3D residence with a full 360° inspection.
 * ---------------------------------------------------------------------------
 * All Three.js lives in this file. The UI talks to it only through refs, so
 * dragging or auto-rotating never re-renders React.
 *
 *   controls.autoRotate   read  — UI toggle state
 *   controls.angle        write — current Y rotation in radians (drives the
 *                                 360° progress line)
 *   controls.dragging     write — true while the pointer is down
 *   controls.scroll       read  — 0..1 hero scroll progress
 *   controls.pointer      read  — normalised mouse position for parallax
 *
 * To use a real model, drop it at /public/models/villa.glb and pass
 * `modelUrl="/models/villa.glb"`. The generated villa is skipped entirely and
 * every interaction keeps working.
 * ---------------------------------------------------------------------------
 */

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '@/lib/animations';

/* Palette — ivory, burgundy and black are the only colours on the site, and
   the scene's lights and materials are held to the same three. */
const IVORY = '#FFFFFF';
const BURGUNDY = '#630000';

/** One full turn every 26 seconds. */
const AUTO_SPEED = (Math.PI * 2) / 26;

/** Beat between letting go of the building and auto-rotation taking over. */
const RESUME_DELAY_MS = 400;

export type HeroControls = {
  autoRotate: boolean;
  angle: number;
  dragging: boolean;
  scroll: number;
  pointer: { x: number; y: number };
};

type SceneProps = {
  controls: React.MutableRefObject<HeroControls>;
  /** Optional .glb/.gltf — replaces the generated villa. */
  modelUrl?: string;
  /** Fewer lights, no shadows, lower pixel ratio. */
  lowPower?: boolean;
  /** Fired once the first frame has actually been drawn. */
  onReady?: () => void;
  /**
   * When false the render loop stops entirely. The hero is the only WebGL on
   * the page, so once it scrolls away there is nothing to draw and the GPU
   * and main thread are handed back to the rest of the site.
   */
  active?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Materials                                                                  */
/* -------------------------------------------------------------------------- */

function useVillaMaterials() {
  return useMemo(() => {
    /** Dark stone cladding — the primary exterior material. */
    const stone = new THREE.MeshStandardMaterial({
      color: '#DCD8CA',
      roughness: 0.78,
      metalness: 0.08,
    });
    /** Deeper stone for recesses and the service core. */
    const darkStone = new THREE.MeshStandardMaterial({
      color: '#C6C2B4',
      roughness: 0.88,
      metalness: 0.05,
    });
    /* Neutrals below are ivory scaled toward black, so the whole scene is
       built from the three palette colours only. */
    /** Slab edges catch the key light and describe the cantilevers. */
    const slab = new THREE.MeshStandardMaterial({
      color: '#EDEADD',
      roughness: 0.55,
      metalness: 0.18,
    });
    /** Soffits under each overhang, washed by the interior light. */
    const soffit = new THREE.MeshStandardMaterial({
      color: '#D2CEC0',
      roughness: 0.7,
      metalness: 0.05,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: '#33322E',
      roughness: 0.08,
      metalness: 0.55,
      transparent: true,
      opacity: 0.55,
    });
    const mullion = new THREE.MeshStandardMaterial({
      color: '#A9A498',
      roughness: 0.4,
      metalness: 0.5,
    });
    const railing = new THREE.MeshStandardMaterial({
      color: '#6E6B63',
      roughness: 0.12,
      metalness: 0.55,
      transparent: true,
      opacity: 0.16,
    });
    /**
     * Room interiors. Against an ivory ground the building reads as a lit
     * architectural model, so interiors are recessed shadow rather than glow.
     */
    const interior = new THREE.MeshStandardMaterial({
      color: '#3E3C36',
      roughness: 0.9,
      metalness: 0,
    });
    const interiorDim = new THREE.MeshStandardMaterial({
      color: '#57544C',
      roughness: 0.9,
      metalness: 0,
    });
    /** Furniture silhouettes read as dark shapes against the glow. */
    const furniture = new THREE.MeshStandardMaterial({
      color: '#4A4842',
      roughness: 0.85,
      metalness: 0,
    });
    /** Planting reads as a soft grey silhouette on the pale ground. */
    const foliage = new THREE.MeshStandardMaterial({
      color: '#8A867A',
      roughness: 0.95,
      metalness: 0,
    });
    /** The single accent: the entrance reveal. */
    const accent = new THREE.MeshStandardMaterial({
      color: BURGUNDY,
      emissive: BURGUNDY,
      emissiveIntensity: 0.5,
      roughness: 0.6,
    });
    /** Ground plane, faintly polished so the villa sits in a pool of light. */
    const ground = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.8,
      metalness: 0.12,
    });
    return {
      stone,
      darkStone,
      slab,
      soffit,
      glass,
      mullion,
      railing,
      interior,
      interiorDim,
      furniture,
      foliage,
      accent,
      ground,
    };
  }, []);
}

type Mats = ReturnType<typeof useVillaMaterials>;

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

/** A cypress. Several sizes, scattered around the plinth and on terraces. */
function Cypress({ m, position, h = 2.2, r = 0.22 }: { m: Mats; position: [number, number, number]; h?: number; r?: number }) {
  return (
    <group position={position}>
      <mesh castShadow material={m.foliage} position={[0, h / 2, 0]}>
        <coneGeometry args={[r, h, 8]} />
      </mesh>
      <mesh material={m.darkStone} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[r * 0.9, r, 0.12, 8]} />
      </mesh>
    </group>
  );
}

/** Broad-canopy tree, the kind that sits on the reference's terraces. */
function Canopy({ m, position, s = 1 }: { m: Mats; position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh material={m.darkStone} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 6]} />
      </mesh>
      <mesh castShadow material={m.foliage} position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.42, 10, 8]} />
      </mesh>
      <mesh castShadow material={m.foliage} position={[0.22, 0.72, 0.1]}>
        <sphereGeometry args={[0.26, 8, 6]} />
      </mesh>
    </group>
  );
}

/** A lit room: back wall glow, a dimmer plane behind it, and furniture. */
function Room({
  m,
  width,
  height,
  depth,
  position,
  rotation = [0, 0, 0],
}: {
  m: Mats;
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bright back wall */}
      <mesh material={m.interior} position={[0, 0, -depth / 2]}>
        <planeGeometry args={[width, height]} />
      </mesh>
      {/* Ceiling wash */}
      <mesh material={m.interiorDim} rotation={[Math.PI / 2, 0, 0]} position={[0, height / 2, 0]}>
        <planeGeometry args={[width, depth]} />
      </mesh>
      {/* Furniture silhouettes */}
      <mesh material={m.furniture} position={[-width * 0.22, -height * 0.3, depth * 0.05]}>
        <boxGeometry args={[width * 0.34, height * 0.22, depth * 0.4]} />
      </mesh>
      <mesh material={m.furniture} position={[width * 0.26, -height * 0.34, -depth * 0.1]}>
        <boxGeometry args={[width * 0.16, height * 0.16, depth * 0.3]} />
      </mesh>
    </group>
  );
}

/** Vertical mullions across a glazed face. */
function Mullions({
  m,
  count,
  span,
  height,
  z,
  rotation = [0, 0, 0],
}: {
  m: Mats;
  count: number;
  span: number;
  height: number;
  z: number;
  rotation?: [number, number, number];
}) {
  return (
    <group rotation={rotation}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          material={m.mullion}
          position={[-span / 2 + (i * span) / (count - 1), 0, z]}
        >
          <boxGeometry args={[0.045, height, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

/** Small ivory uplight at the base of the building and through the planting. */
function Uplight({ m, position }: { m: Mats; position: [number, number, number] }) {
  return (
    <mesh material={m.interior} position={position}>
      <circleGeometry args={[0.09, 10]} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* The villa                                                                  */
/* -------------------------------------------------------------------------- */

function Villa({ lowPower }: { lowPower: boolean }) {
  const m = useVillaMaterials();

  /**
   * Three stacked levels, each stepping back and shifting so the massing
   * cantilevers. Ground is the widest and deepest; the top is a set-back
   * volume with a roof parapet.
   */
  const levels = useMemo(
    () => [
      { y: 0.95, w: 7.2, d: 5.4, h: 1.75, x: 0, z: 0 },
      { y: 2.85, w: 6.5, d: 4.7, h: 1.65, x: 0.35, z: 0.3 },
      { y: 4.6, w: 5.2, d: 3.9, h: 1.55, x: -0.3, z: -0.15 },
    ],
    []
  );

  return (
    <group position={[0, -2.7, 0]}>
      {/* Ground — a faintly polished disc that pools the light */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[10, 56]} />
        <primitive object={m.ground} attach="material" />
      </mesh>
      {/* Plinth the villa stands on */}
      <mesh receiveShadow castShadow position={[0, 0.1, 0]} material={m.darkStone}>
        <cylinderGeometry args={[7.4, 7.6, 0.24, 56]} />
      </mesh>

      {/* Entrance steps */}
      <mesh receiveShadow castShadow position={[0, 0.26, 3.6]} material={m.stone}>
        <boxGeometry args={[3.6, 0.14, 1.5]} />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.38, 3.05]} material={m.stone}>
        <boxGeometry args={[3.0, 0.14, 0.95]} />
      </mesh>

      {levels.map((l, i) => {
        const front = l.d * 0.5;
        const side = l.w * 0.5;
        return (
          <group key={i} position={[l.x, l.y, l.z]}>
            {/* Solid stone mass, held back to the rear-left corner so the
                glazed corner stays open and the lit rooms read through it. */}
            <mesh
              castShadow
              receiveShadow
              material={i === 2 ? m.darkStone : m.stone}
              position={[-l.w * 0.19, 0, -l.d * 0.2]}
            >
              <boxGeometry args={[l.w * 0.62, l.h, l.d * 0.6]} />
            </mesh>

            {/* Lit rooms behind the front and side glazing */}
            <Room
              m={m}
              width={l.w * 0.66}
              height={l.h * 0.64}
              depth={l.d * 0.3}
              position={[-l.w * 0.06, -l.h * 0.05, front - l.d * 0.17]}
            />
            <Room
              m={m}
              width={l.d * 0.52}
              height={l.h * 0.58}
              depth={l.w * 0.25}
              position={[side - l.w * 0.15, -l.h * 0.05, l.d * 0.08]}
              rotation={[0, Math.PI / 2, 0]}
            />

            {/* Stone pier closing the left of the facade */}
            <mesh castShadow receiveShadow material={m.darkStone} position={[-side + 0.55, 0, front - 0.06]}>
              <boxGeometry args={[1.1, l.h, 0.16]} />
            </mesh>

            {/* Glazing */}
            <mesh castShadow receiveShadow material={m.glass} position={[0, 0, front + 0.02]}>
              <boxGeometry args={[l.w, l.h * 0.94, 0.05]} />
            </mesh>
            <mesh castShadow receiveShadow material={m.glass} position={[side + 0.02, 0, 0]}>
              <boxGeometry args={[0.05, l.h * 0.94, l.d]} />
            </mesh>

            {/* Mullions */}
            {!lowPower && (
              <>
                <Mullions m={m} count={7} span={l.w - 0.3} height={l.h * 0.94} z={front + 0.05} />
                <Mullions
                  m={m}
                  count={5}
                  span={l.d - 0.3}
                  height={l.h * 0.94}
                  z={side + 0.05}
                  rotation={[0, Math.PI / 2, 0]}
                />
              </>
            )}

            {/* Warm soffit under the slab above */}
            <mesh material={m.soffit} rotation={[Math.PI / 2, 0, 0]} position={[0, l.h * 0.5 - 0.02, front + 0.42]}>
              <planeGeometry args={[l.w + 1.5, 0.9]} />
            </mesh>

            {/* Floor slab — the cantilever edge */}
            <mesh castShadow receiveShadow material={m.slab} position={[0, l.h * 0.5 + 0.11, 0]}>
              <boxGeometry args={[l.w + 1.6, 0.22, l.d + 1.6]} />
            </mesh>

            {/* Glass balustrades around the terrace */}
            <mesh material={m.railing} position={[0, l.h * 0.5 + 0.55, (l.d + 1.6) / 2 - 0.05]}>
              <boxGeometry args={[l.w + 1.6, 0.62, 0.03]} />
            </mesh>
            <mesh
              material={m.railing}
              rotation={[0, Math.PI / 2, 0]}
              position={[(l.w + 1.6) / 2 - 0.05, l.h * 0.5 + 0.55, 0]}
            >
              <boxGeometry args={[l.d + 1.6, 0.62, 0.03]} />
            </mesh>

            {/* Planting on the terrace, as in the reference */}
            {!lowPower && (
              <>
                <Canopy m={m} position={[-side - 0.45, l.h * 0.5 + 0.22, front + 0.5]} s={0.5} />
                <Canopy m={m} position={[side + 0.55, l.h * 0.5 + 0.22, front - 0.8]} s={0.45} />
              </>
            )}
          </group>
        );
      })}

      {/* Roof parapet on the top volume */}
      <mesh castShadow receiveShadow material={m.slab} position={[-0.3, 5.55, -0.15]}>
        <boxGeometry args={[5.4, 0.16, 4.1]} />
      </mesh>
      <mesh material={m.railing} position={[-0.3, 5.85, 1.9]}>
        <boxGeometry args={[5.4, 0.5, 0.03]} />
      </mesh>

      {/* Service core running the full height */}
      <mesh castShadow receiveShadow material={m.darkStone} position={[-3.5, 3.0, -1.9]}>
        <boxGeometry args={[1.1, 6.0, 1.5]} />
      </mesh>

      {/* Entrance reveal — the only burgundy in the scene */}
      <mesh material={m.accent} position={[0, 1.0, 2.76]}>
        <boxGeometry args={[1.3, 1.05, 0.06]} />
      </mesh>

      {/* Landscape uplights washing the base */}
      {!lowPower &&
        [
          [-3.2, 0.23, 3.9],
          [-1.4, 0.23, 4.2],
          [1.5, 0.23, 4.2],
          [3.3, 0.23, 3.8],
          [4.6, 0.23, 1.4],
          [-4.7, 0.23, 1.0],
        ].map((p, i) => (
          <Uplight key={i} m={m} position={[p[0], p[1], p[2]]} />
        ))}

      {/* Planting around the plinth */}
      <Cypress m={m} position={[-4.6, 0.22, 3.1]} h={2.9} r={0.26} />
      <Cypress m={m} position={[-3.8, 0.22, 3.9]} h={2.1} r={0.2} />
      <Cypress m={m} position={[4.5, 0.22, 2.9]} h={2.6} r={0.24} />
      <Cypress m={m} position={[5.2, 0.22, -1.4]} h={3.2} r={0.27} />
      <Cypress m={m} position={[-5.3, 0.22, -1.0]} h={2.4} r={0.22} />
      <Cypress m={m} position={[2.0, 0.22, 4.4]} h={1.8} r={0.18} />
      {!lowPower && (
        <>
          <Canopy m={m} position={[-2.6, 0.22, 4.7]} s={0.8} />
          <Canopy m={m} position={[3.8, 0.22, 4.1]} s={0.7} />
          <Canopy m={m} position={[5.6, 0.22, 0.6]} s={0.6} />
        </>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Optional external model                                                    */
/* -------------------------------------------------------------------------- */

function VillaModel({ url }: { url: string }) {
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
/* Rotation rig — drag, inertia, auto-rotate, parallax, scroll                */
/* -------------------------------------------------------------------------- */

function Rig({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: React.MutableRefObject<HeroControls>;
}) {
  const group = useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { gl, size } = useThree();

  const state = useRef({
    angle: 0,
    velocity: 0,
    /** 0 means "never dragged", so rotation starts straight away on load. */
    releasedAt: 0,
    camX: 0,
    camY: 0,
    camZ: 0,
    framed: false,
  });

  /* Pointer drag straight on the canvas: no OrbitControls, no vertical drift. */
  const drag = useRef({ active: false, lastX: 0, pointerId: -1 });

  useEffect(() => {
    const el = gl.domElement;
    if (!el) return;

    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
      drag.current.pointerId = e.pointerId;
      controls.current.dragging = true;
      state.current.velocity = 0;
      el.style.cursor = 'grabbing';
      el.setPointerCapture?.(e.pointerId);
    };

    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      // Full turn across roughly one and a half screen widths.
      state.current.angle += (dx / window.innerWidth) * Math.PI * 2 * 1.4;
      state.current.velocity = (dx / window.innerWidth) * 6;
    };

    const up = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      controls.current.dragging = false;
      state.current.releasedAt = performance.now();
      el.style.cursor = 'grab';
    };

    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y'; // vertical scrolling still works over the canvas
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl, controls]);

  useFrame((_, delta) => {
    const c = controls.current;
    const s = state.current;
    const dt = Math.min(delta, 0.05);
    const ease = Math.min(dt * 3.4, 0.14);

    /* Portrait viewports need the villa smaller and further back. */
    const portrait = size.height > size.width;
    const baseZ = portrait ? 30 : 23;
    const baseY = portrait ? 3.8 : 3.4;
    if (!s.framed) {
      s.camZ = baseZ;
      s.camY = baseY;
      s.framed = true;
    }

    /*
     * While dragging, the pointer owns the angle. On release the building
     * coasts on its remaining inertia, and auto-rotation takes over a short
     * beat later — from exactly where it was left, never from a reset angle.
     * The delay is time-based only: it is not also waiting for the flick to
     * decay, so the pause is always the same length.
     */
    if (drag.current.active) {
      s.velocity *= 0.9;
    } else {
      s.angle += s.velocity * dt * 8;
      s.velocity *= 0.94;
      if (Math.abs(s.velocity) < 0.0015) s.velocity = 0;

      const sinceRelease = performance.now() - s.releasedAt;
      if (c.autoRotate && sinceRelease > RESUME_DELAY_MS) {
        s.angle += AUTO_SPEED * dt;
      }
    }

    // Keep the reported angle inside one turn for the progress indicator.
    const TAU = Math.PI * 2;
    s.angle = ((s.angle % TAU) + TAU) % TAU;
    c.angle = s.angle;

    if (group.current) {
      group.current.rotation.y = s.angle;
      // Sink and drift slightly as the hero scrolls away.
      group.current.position.y = -c.scroll * 1.6;
    }

    if (camera.current) {
      // Very light parallax — the building should breathe, not follow the cursor.
      const targetX = c.pointer.x * 0.55;
      const targetY = baseY - c.pointer.y * 0.3 + c.scroll * 1.1;
      s.camX = lerp(s.camX, targetX, ease);
      s.camY = lerp(s.camY, targetY, ease);
      s.camZ = lerp(s.camZ, baseZ + c.scroll * 3.5, ease);

      camera.current.position.set(s.camX, s.camY, s.camZ);
      camera.current.lookAt(0, 0.15, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={camera} fov={28} position={[0, 3.4, 23]} />
      <group ref={group}>{children}</group>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Lighting                                                                   */
/* -------------------------------------------------------------------------- */

function Lighting({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <ambientLight intensity={0.85} color={IVORY} />

      {/* Key — low, warm, from the front right */}
      <directionalLight
        castShadow={!lowPower}
        position={[9, 8.5, 7]}
        intensity={1.9}
        color={IVORY}
        shadow-mapSize={lowPower ? 512 : 1024}
        shadow-bias={-0.0008}
      >
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 0.1, 45]} />
      </directionalLight>

      {/* Cool sky fill, keeps the shadow side from going flat black */}
      <directionalLight position={[-8, 6, -7]} intensity={0.5} color={IVORY} />

      {/* Rim from behind, separates the massing from the background */}
      <directionalLight position={[-4, 5, -10]} intensity={0.45} color={IVORY} />

      {/* Warm pools at the entrance and under the cantilevers */}
      {/* A single soft bounce keeps the shadow side from going muddy */}
      {!lowPower && (
        <pointLight position={[1.5, 2.4, 6]} intensity={2} distance={12} color={IVORY} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** Reports the moment the scene has rendered its first frame. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });
  return null;
}

export default function HeroScene({
  controls,
  modelUrl,
  lowPower = false,
  active = true,
  onReady,
}: SceneProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        scene.fog = new THREE.FogExp2('#FFFFFF', 0.009);
      }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <ReadySignal onReady={onReady} />
        <Lighting lowPower={lowPower} />
        <Rig controls={controls}>
          {modelUrl ? <VillaModel url={modelUrl} /> : <Villa lowPower={lowPower} />}
          {!lowPower && (
            <ContactShadows
              position={[0, -2.58, 0]}
              opacity={0.32}
              scale={26}
              blur={3}
              far={10}
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
