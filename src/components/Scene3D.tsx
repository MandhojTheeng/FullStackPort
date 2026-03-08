"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Organic floating torus
function OrganicTorus({ position, scale = 1, color = "#22c55e" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

// Organic icosahedron
function OrganicIcosahedron({ position, scale = 1, color = "#84cc16" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

// Organic octahedron
function OrganicOctahedron({ position, scale = 1, color = "#a3e635" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

// Organic knot
function OrganicKnot({ position, scale = 1, color = "#4ade80" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusKnotGeometry args={[0.4, 0.12, 64, 8]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.25}
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

// Floating particles with nature colors
function Particles() {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const greenShades = ["#22c55e", "#84cc16", "#a3e635", "#4ade80", "#16a34a"];
    for (let i = 0; i < count; i++) {
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];
      const c = new THREE.Color(color);
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Floating glow orbs
function GlowOrbs() {
  const orbs = [
    { position: [-4, 2, -5], color: "#22c55e", scale: 0.3 },
    { position: [4, -1, -4], color: "#84cc16", scale: 0.25 },
    { position: [0, 3, -6], color: "#a3e635", scale: 0.2 },
    { position: [-3, -2, -3], color: "#4ade80", scale: 0.15 },
    { position: [3, 2, -5], color: "#22c55e", scale: 0.2 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={orb.position as [number, number, number]} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={orb.color}
              transparent
              opacity={0.15}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#22c55e" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#84cc16" />
        
        {/* Starfield */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
        
        {/* Sparkles */}
        <Sparkles
          count={80}
          scale={12}
          size={1.5}
          speed={0.3}
          opacity={0.4}
          color="#22c55e"
        />
        
        {/* Organic shapes */}
        <OrganicTorus position={[-3, 1.5, -5]} scale={0.8} color="#22c55e" />
        <OrganicTorus position={[3.5, -1, -4]} scale={0.6} color="#84cc16" />
        
        <OrganicIcosahedron position={[2, 2, -6]} scale={0.7} color="#a3e635" />
        <OrganicIcosahedron position={[-2, -1.5, -5]} scale={0.5} color="#4ade80" />
        
        <OrganicOctahedron position={[0, 2.5, -7]} scale={0.6} color="#22c55e" />
        <OrganicOctahedron position={[-3.5, 0.5, -4]} scale={0.4} color="#84cc16" />
        
        <OrganicKnot position={[3, 1, -5]} scale={0.5} color="#a3e635" />
        <OrganicKnot position={[-1, -2, -4]} scale={0.4} color="#4ade80" />
        
        <Particles />
        <GlowOrbs />
      </Canvas>
    </div>
  );
}

