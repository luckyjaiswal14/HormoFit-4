/**
 * HormoFit Digital Twin 3D Component
 * A 3D representation of the user's hormonal health.
 */

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Html, Torus, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { HealthState } from '../lib/healthEngine';

interface DigitalTwin3DProps {
  state: HealthState;
}

const ProceduralTwin: React.FC<{ stability: number; color: string }> = ({ stability, color }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * (stability > 70 ? 2 : 5)) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Stylized Body Core */}
      <Sphere ref={coreRef} args={[0.8, 64, 64]}>
        <MeshWobbleMaterial
          color={color}
          speed={stability > 70 ? 1 : 3}
          factor={stability > 70 ? 0.2 : 0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Hormonal Rings */}
      <Torus ref={ringRef} args={[1.2, 0.02, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.5} />
      </Torus>
      <Torus args={[1.4, 0.01, 16, 100]} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.3} />
      </Torus>

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <Sphere args={[0.05, 16, 16]} position={[
            Math.sin(i) * 1.5,
            Math.cos(i) * 1.5,
            Math.sin(i * 2) * 0.5
          ]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

const AvatarImage: React.FC<{ stability: number; color: string }> = ({ stability, color }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAvatarUrl = () => {
    if (stability > 70) return 'https://storage.googleapis.com/demo-v-bucket/input_file_0.png';
    if (stability > 40) return 'https://storage.googleapis.com/demo-v-bucket/input_file_1.png';
    return 'https://storage.googleapis.com/demo-v-bucket/input_file_2.png';
  };

  return (
    <>
      {/* Always show procedural twin as a base or fallback */}
      <ProceduralTwin stability={stability} color={color} />
      
      {!hasError && (
        <Html
          center
          transform
          position={[0, 0, 0.5]}
          scale={0.45}
          distanceFactor={4}
          pointerEvents="none"
          zIndexRange={[10, 20]}
        >
          <div className={`relative w-96 h-96 flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={getAvatarUrl()}
              alt="Digital Twin Avatar"
              className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />
          </div>
        </Html>
      )}
    </>
  );
};

const HealthAura: React.FC<{ color: string; intensity: number }> = ({ color, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[2.2, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3 * intensity}
          radius={1}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </Float>
  );
};

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ state }) => {
  const getHealthColor = () => {
    if (state.riskLevel === 'High') return '#f43f5e'; // rose-500
    if (state.riskLevel === 'Medium') return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const color = getHealthColor();
  const intensity = state.riskLevel === 'High' ? 1 : state.riskLevel === 'Medium' ? 0.6 : 0.3;

  return (
    <div className="w-full h-full min-h-[450px] bg-slate-900 rounded-[40px] overflow-hidden relative group">
      {/* UI Overlays */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <div className={`w-2 h-2 rounded-full animate-pulse ${state.riskLevel === 'High' ? 'bg-red-500' : state.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Digital Twin Active</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 text-right">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Stability Index</p>
        <p className="text-white text-4xl font-black tracking-tighter">{Math.round(state.hormonalStabilityScore)}%</p>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/5 text-[10px] text-white/40 font-mono uppercase tracking-widest">
          Real-time Sync: <span className="text-emerald-400">Active</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />
        
        <HealthAura color={color} intensity={intensity} />
        <AvatarImage stability={state.hormonalStabilityScore} color={color} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900 via-transparent to-slate-900 opacity-60" />
      <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-900/50 rounded-[40px]" />
    </div>
  );
};
