"use client";

import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url}
      className="block w-64 h-40 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg perspective-1000"
      whileHover={{ rotateY: 15, scale: 1.05 }}
      whileTap={{ rotateY: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-full h-full">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {project.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
