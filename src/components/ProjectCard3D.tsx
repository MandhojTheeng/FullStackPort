"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, MeshTransmissionMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
  tech?: string[];
  category?: string;
}

// Nature-colored palette
const colors = ["#22c55e", "#84cc16", "#a3e635", "#4ade80", "#16a34a"];

function Card3D({ project, isHovered, setHovered }: { project: Project; isHovered: boolean; setHovered: (v: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = isHovered ? 0.05 : state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = isHovered ? 0.15 : state.clock.elapsedTime * 0.1;
    }
  });

  const color = isHovered ? "#22c55e" : "#16a34a";
  const emissiveColor = isHovered ? "#22c55e" : "#16a34a";

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isHovered ? 1.05 : 1}
      >
        <boxGeometry args={[3.2, 2.2, 0.15]} />
        <meshStandardMaterial
          color="#111916"
          metalness={0.3}
          roughness={0.7}
        />
        
        {/* Glass overlay with nature tint */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={isHovered ? 0.2 : 0.08}
            emissive={emissiveColor}
            emissiveIntensity={isHovered ? 0.4 : 0.15}
          />
        </mesh>

        {/* Glowing edges */}
        <lineSegments position={[0, 0, 0.09]}>
          <edgesGeometry args={[new THREE.BoxGeometry(3.2, 2.2, 0.15)]} />
          <lineBasicMaterial color={color} linewidth={2} />
        </lineSegments>

        {/* Corner accents */}
        {[[-1.5, 1, 0.1], [1.5, 1, 0.1], [-1.5, -1, 0.1], [1.5, -1, 0.1]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.8 : 0.4} />
          </mesh>
        ))}

        {/* Project title */}
        <Html position={[0, 0.2, 0.15]} center transform>
          <div className="text-center px-4 w-64">
            <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
            <p className="text-xs text-zinc-400">{project.description}</p>
          </div>
        </Html>

        {/* Tech tags */}
        {project.tech && (
          <Html position={[0, -0.5, 0.15]} center transform>
            <div className="flex flex-wrap justify-center gap-1 px-2">
              {project.tech.slice(0, 3).map((t, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 text-[10px] rounded-full bg-night-800/80 text-zinc-400 border border-forest-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

function ProjectScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#22c55e" />
      <pointLight position={[3, 2, 2]} intensity={0.2} color="#84cc16" />
    </>
  );
}

interface ProjectCard3DProps {
  project: Project;
  index: number;
}

export default function ProjectCard3D({ project, index }: ProjectCard3DProps) {
  const [isHovered, setHovered] = useState(false);

  return (
    <motion.div
      className="perspective-1000"
      initial={{ opacity: 0, rotateY: -20, y: 30 }}
      whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div
        className="w-full h-64 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ProjectScene />
          <Card3D project={project} isHovered={isHovered} setHovered={setHovered} />
        </Canvas>
      </div>
      
      {/* Accessible fallback content */}
      <a
        href={project.url}
        className="block mt-4 p-5 bg-night-800/50 backdrop-blur-sm rounded-xl border border-forest-500/10 hover:border-forest-500/30 transition-all group card-lift"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-forest-400 transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              {project.description}
            </p>
            {project.tech && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tech.map((t, i) => (
                  <span 
                    key={i}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-night-900/80 text-zinc-500 border border-forest-500/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Arrow icon */}
          <div className="p-2 rounded-full bg-forest-500/10 text-forest-500 group-hover:bg-forest-500 group-hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

