"use client";

import { BlogPost, BlogFormData } from "@/lib/admin-types";

interface BlogsEditorProps {
  blogPosts: BlogPost[];
  showBlogForm: boolean;
  blogForm: BlogFormData;
  setShowBlogForm: (show: boolean) => void;
  setBlogForm: (form: BlogFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  saving: boolean;
}

export default function BlogsEditor({
  blogPosts,
  showBlogForm,
  blogForm,
  setShowBlogForm,
  setBlogForm,
  onSubmit,
  onDelete,
  saving,
}: BlogsEditorProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Blog Posts</h1>
        <button
          onClick={() => setShowBlogForm(!showBlogForm)}
          className="px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all text-sm lg:text-base"
        >
          {showBlogForm ? "Cancel" : "Create Post"}
        </button>
      </div>

      {/* Blog Form */}
      {showBlogForm && (
        <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6 mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Create New Post</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Slug</label>
                <input
                  type="text"
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Excerpt</label>
              <input
                type="text"
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Content</label>
              <textarea
                value={blogForm.content}
                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                rows={6}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <select
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white"
                >
                  <option value="Development" className="bg-black">Development</option>
                  <option value="Design" className="bg-black">Design</option>
                  <option value="Technology" className="bg-black">Technology</option>
                  <option value="Tutorial" className="bg-black">Tutorial</option>
                  <option value="General" className="bg-black">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  placeholder="React, Next.js, TypeScript"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 lg:py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 text-sm lg:text-base"
            >
              {saving ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
        {blogPosts.length === 0 ? (
          <div className="p-8 lg:p-12 text-center">
            <p className="text-white/50">No blog posts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-white/70">Title</th>
                  <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-white/70 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-white/70 hidden md:table-cell">Date</th>
                  <th className="text-right px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5">
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="font-medium text-white text-sm lg:text-base">{post.title}</div>
                      <div className="text-xs lg:text-sm text-white/50">/{post.slug}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 hidden sm:table-cell">
                      <span className="px-2 lg:px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white/50 hidden md:table-cell">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                      <button
                        onClick={() => onDelete(post.id)}
                        className="px-3 py-1.5 text-xs lg:text-sm font-medium text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

