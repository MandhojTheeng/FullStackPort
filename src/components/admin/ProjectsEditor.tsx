"use client";

import { Project, ProjectFormData } from "@/lib/admin-types";

interface ProjectsEditorProps {
  projects: Project[];
  showProjectForm: boolean;
  editingProject: Project | null;
  projectForm: ProjectFormData;
  setShowProjectForm: (show: boolean) => void;
  setEditingProject: (project: Project | null) => void;
  setProjectForm: (form: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => Promise<void>;
  saving: boolean;
}

export default function ProjectsEditor({
  projects,
  showProjectForm,
  editingProject,
  projectForm,
  setShowProjectForm,
  setEditingProject,
  setProjectForm,
  onSubmit,
  onEdit,
  onDelete,
  saving,
}: ProjectsEditorProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => {
            setShowProjectForm(true);
            setEditingProject(null);
            setProjectForm({ title: "", description: "", tech: "", link: "", featured: false, image: "" });
          }}
          className="px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all text-sm lg:text-base"
        >
          Add Project
        </button>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6 mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={projectForm.tech}
                onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Project Link</label>
              <input
                type="text"
                value={projectForm.link}
                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={projectForm.featured}
                onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              <label htmlFor="featured" className="text-sm font-medium text-white/70">Featured Project</label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 text-sm lg:text-base"
              >
                {saving ? "Saving..." : "Save Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                }}
                className="px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm lg:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base lg:text-lg font-semibold text-white">{project.title}</h3>
              {project.featured && (
                <span className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                  Featured
                </span>
              )}
            </div>
            <p className="text-white/50 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(project)}
                className="px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

