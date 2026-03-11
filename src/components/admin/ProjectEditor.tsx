"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Project } from "@/lib/admin-types";
import { getAuthHeaders } from "@/lib/admin-utils";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiLink,
  FiStar,
  FiImage,
  FiCode,
} from "react-icons/fi";

interface ProjectEditorProps {
  onMessage: (type: "success" | "error", text: string) => void;
  onSave: () => void;
  saving: boolean;
  projects?: Project[];
}

export default function ProjectEditor({
  onMessage,
  onSave,
  saving: parentSaving,
  projects: initialProjects,
}: ProjectEditorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localSaving, setLocalSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [link, setLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAuthError = (message?: string) => {
    const text = message || "Your session has expired. Please login again.";
    onMessage("error", text);

    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");

      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1200);
    }
  };

  const loadProjects = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/content", {
        headers: getAuthHeaders(),
      });

      let data: any = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.status === 401 || res.status === 403) {
        handleAuthError(data?.error);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || `Failed to load projects (${res.status})`);
      }

      if (data?.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else if (initialProjects) {
        setProjects(initialProjects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);

      if (initialProjects) {
        setProjects(initialProjects);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setTech("");
    setLink("");
    setFeatured(false);
    setImage("");
    setSelectedProject(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setTech(project.tech.join(", "));
    setLink(project.link);
    setFeatured(project.featured);
    setImage(project.image);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      onMessage("error", "Project title is required");
      return;
    }

    if (!description.trim()) {
      onMessage("error", "Project description is required");
      return;
    }

    setLocalSaving(true);

    const minSaveTime = new Promise((resolve) => setTimeout(resolve, 800));

    const projectData = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      tech: tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      link: link.trim(),
      featured,
      image: image.trim(),
      ...(isEditing && selectedProject ? { id: selectedProject.id } : {}),
    };

    try {
      let updatedProjects: Project[];

      if (isEditing && selectedProject) {
        updatedProjects = projects.map((p) =>
          p.id === selectedProject.id
            ? ({ ...p, ...projectData } as Project)
            : p
        );
      } else {
        const newProject: Project = {
          ...(projectData as Omit<Project, "id">),
          id: `proj_${Date.now()}`,
        };

        updatedProjects = [...projects, newProject];
      }

      const res = await fetch("/api/content", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          section: "projects",
          data: updatedProjects,
        }),
      });

      let data: any = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = {
          error: `Server error: ${res.status} ${res.statusText}`,
        };
      }

      if (res.status === 401 || res.status === 403) {
        handleAuthError(data?.error);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || `Failed to save project (${res.status})`);
      }

      await minSaveTime;

      onMessage("success", isEditing ? "Project updated!" : "Project created!");
      setProjects(updatedProjects);
      resetForm();
      onSave();
    } catch (err) {
      console.error("Save error:", err);
      onMessage(
        "error",
        err instanceof Error ? err.message : "Failed to save project"
      );
    } finally {
      setLocalSaving(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(projectId);

    try {
      const updatedProjects = projects.filter((p) => p.id !== projectId);

      const res = await fetch("/api/content", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          section: "projects",
          data: updatedProjects,
        }),
      });

      let data: any = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = {
          error: `Server error: ${res.status} ${res.statusText}`,
        };
      }

      if (res.status === 401 || res.status === 403) {
        handleAuthError(data?.error);
        return;
      }

      if (!res.ok) {
        const errorMessage = data?.error || "Failed to delete project";
        const details =
          Array.isArray(data?.details) && data.details.length > 0
            ? ` (${data.details.join(", ")})`
            : "";

        throw new Error(errorMessage + details);
      }

      onMessage("success", "Project deleted!");
      setProjects(updatedProjects);

      if (selectedProject?.id === projectId) {
        resetForm();
      }

      onSave();
    } catch (err) {
      console.error("Delete error:", err);
      onMessage(
        "error",
        err instanceof Error ? err.message : "Failed to delete project"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (!isCreating && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Projects
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Manage your portfolio projects
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <FiPlus size={18} />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
              <FiCode className="text-zinc-500" size={28} />
            </div>

            <p className="mb-4 text-zinc-500">No projects yet.</p>

            <button
              onClick={handleCreateNew}
              className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Add your first project
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      {project.featured && (
                        <span className="flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          <FiStar size={10} />
                          Featured
                        </span>
                      )}

                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="truncate text-lg font-semibold text-white transition-colors group-hover:text-green-400">
                      {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-[9px] text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                    >
                      <FiEdit2 size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <FiTrash2 size={14} />
                      <span className="hidden sm:inline">
                        {deletingId === project.id ? "..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {isCreating ? "Create New Project" : "Edit Project"}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {isCreating
              ? "Add a new project to your portfolio"
              : `Editing: ${selectedProject?.title}`}
          </p>
        </div>

        <button
          onClick={resetForm}
          className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          <FiX size={16} />
          <span>Cancel</span>
        </button>
      </div>

      <div className="space-y-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/60 p-6 backdrop-blur-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Project Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g., E-Commerce Platform"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g., Full Stack Systems"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Describe your project..."
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <FiCode size={14} />
            Tech Stack (comma separated)
          </label>
          <input
            type="text"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="w-full rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g., Next.js, TypeScript, Stripe, PostgreSQL"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <FiLink size={14} />
              Project Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <FiImage size={14} />
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-zinc-700/50 bg-black/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="/project-image.jpg"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              featured ? "bg-green-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                featured ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <label className="text-sm font-medium text-zinc-300">
            Mark as Featured
          </label>
        </div>

        <div className="flex flex-col items-stretch justify-end gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center">
          <button
            onClick={resetForm}
            className="rounded-xl bg-zinc-800 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={localSaving || parentSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {localSaving || parentSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? "Update Project" : "Create Project"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}