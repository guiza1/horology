import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WatchModelProps {
  modelPath: string;
  scaleFactor: number;
  isExploded: boolean;
  isMobile: boolean;
}

interface ExplodePart {
  mesh: THREE.Object3D;
  origPos: THREE.Vector3;
  targetOffset: THREE.Vector3;
}

function WatchModel({ modelPath, scaleFactor, isExploded, isMobile }: WatchModelProps) {
  const { scene } = useGLTF(modelPath);
  const partsRef = useRef<ExplodePart[]>([]);
  const containerRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const parts: ExplodePart[] = [];
    const spreadMultiplier = isMobile ? 0.6 : 1.0;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const origPos = child.position.clone();
        const name = child.name.toLowerCase();

        const offset = new THREE.Vector3(0, 0, 0);

        if (name.includes('glass') || name.includes('crystal') || name.includes('lens')) {
          offset.set(0, 0, 0.08 * spreadMultiplier);
        } else if (name.includes('bezel') || name.includes('ring')) {
          offset.set(0, 0, 0.05 * spreadMultiplier);
        } else if (name.includes('hand') || name.includes('pointer') || name.includes('needle')) {
          offset.set(0, 0, 0.03 * spreadMultiplier);
        } else if (name.includes('dial') || name.includes('face')) {
          offset.set(0, 0, 0.015 * spreadMultiplier);
        } else if (name.includes('strap') || name.includes('band') || name.includes('bracelet') || name.includes('link')) {
          const xDir = child.position.x >= 0 ? 0.038 : -0.038;
          offset.set(xDir * spreadMultiplier, 0, -0.045 * spreadMultiplier);
        } else if (name.includes('case') || name.includes('back')) {
          offset.set(0, 0, -0.065 * spreadMultiplier);
        } else if (name.includes('crown') || name.includes('button')) {
          offset.set(0.05 * spreadMultiplier, 0, 0);
        } else {
          const index = parts.length;
          const spreadZ = ((index % 7) - 3) * 0.018 * spreadMultiplier;
          const spreadX = ((index % 3) - 1) * 0.02 * spreadMultiplier;
          const spreadY = (index % 2 === 0 ? 1 : -1) * 0.01 * spreadMultiplier;
          offset.set(spreadX, spreadY, spreadZ);
        }

        parts.push({
          mesh: child,
          origPos,
          targetOffset: offset,
        });
      }
    });

    partsRef.current = parts;
  }, [scene, isMobile]);

  useFrame((_, delta) => {
    const step = THREE.MathUtils.clamp(delta * 4.0, 0, 1);

    // 1. Animação de dispersão das peças individuais
    partsRef.current.forEach(({ mesh, origPos, targetOffset }) => {
      const target = isExploded ? origPos.clone().add(targetOffset) : origPos;
      mesh.position.lerp(target, step);
    });

    // 2. Zoom out suave no Explode (animando o container sem travar o OrbitControls)
    if (containerRef.current) {
      // Quando explode no mobile reduz para 0.65x e no desktop para 0.8x para caber no centro
      const targetScaleMultiplier = isExploded ? (isMobile ? 0.65 : 0.82) : 1.0;
      const targetY = isExploded ? (isMobile ? 0.28 : 0.18) : (isMobile ? 0.15 : 0.25);

      containerRef.current.scale.lerp(
        new THREE.Vector3(targetScaleMultiplier, targetScaleMultiplier, targetScaleMultiplier),
        step
      );
      containerRef.current.position.y = THREE.MathUtils.lerp(
        containerRef.current.position.y,
        targetY,
        step
      );
    }
  });

  return (
    <group ref={containerRef} position={[0, isMobile ? 0.15 : 0.25, 0]}>
      <Center>
        <primitive object={scene} scale={scaleFactor} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 border border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
          CALIBRATING
        </span>
      </div>
    </Html>
  );
}

interface SceneProps {
  currentModel: string;
  scaleFactor: number;
  isExploded: boolean;
}

export function WatchScene({ currentModel, scaleFactor, isExploded }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 4.8 : 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 7, 5]} intensity={2.2} />
        <directionalLight position={[-5, 2, -2]} intensity={0.8} color="#cbd5e1" />

        <Suspense fallback={<Loader />}>
          <WatchModel 
            key={currentModel} 
            modelPath={currentModel} 
            scaleFactor={scaleFactor}
            isExploded={isExploded}
            isMobile={isMobile}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={8.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          enableDamping={true}
          dampingFactor={0.06}
          autoRotate={!isExploded}
          autoRotateSpeed={0.8}
        />

        <ContactShadows
          position={[0, isMobile ? -1.4 : -1.2, 0]}
          opacity={0.5}
          scale={isMobile ? 4.2 : 5.0}
          blur={2.0}
          far={3}
        />

        <Environment preset="city" environmentIntensity={0.8} />
      </Canvas>
    </div>
  );
}