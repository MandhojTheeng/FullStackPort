"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/admin-types";
import { getAuthHeaders } from "@/lib/admin-utils";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCalendar, FiUser, FiTag, FiFileText, FiChevronRight, FiClock } from "react-icons/fi";

interface BlogEditorProps {
  onMessage: (type: "success" | "error", text: string) => void;
  onSave: () => void;
  saving: boolean;
}

interface BlogMetadata {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  description: string;
}

export default function BlogEditor({ onMessage, onSave, saving: parentSaving }: BlogEditorProps) {
  const [posts, setPosts] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogMetadata | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [localSaving, setLocalSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
      onMessage("error", "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setAuthor("Santosh Timalsina");
    setDescription("");
    setContent("");
    setSlug("");
    setSelectedPost(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsCreating(true);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleEdit = async (post: BlogMetadata) => {
    setSelectedPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setDate(post.date);
    setAuthor(post.author);
    setDescription(post.description || "");
    setSlug(post.slug);
    setIsEditing(true);
    setIsCreating(false);

    // Load the full content for this post
    try {
      const res = await fetch(`/api/blogs?slug=${post.slug}`);
      const data = await res.json();
      if (data.post && data.post.content) {
        setContent(data.post.content);
      }
    } catch (err) {
      console.error("Failed to load post content:", err);
      onMessage("error", "Failed to load post content");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      onMessage("error", "Title is required");
      return;
    }
    if (!content.trim()) {
      onMessage("error", "Content is required");
      return;
    }

    // Set saving state first
    setLocalSaving(true);

    // Add a minimum delay to make the feedback more noticeable (1.5 seconds)
    const minSaveTime = new Promise(resolve => setTimeout(resolve, 1500));

    const payload = {
      title,
      category,
      date,
      author,
      description,
      content,
      ...(isEditing && { slug }),
    };

    try {
      const res = await fetch("/api/blogs", {
        method: isEditing ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save blog post");
      }

      // Wait for minimum save time
      await minSaveTime;
      
      onMessage("success", isEditing ? "Blog post updated!" : "Blog post created!");
      resetForm();
      loadPosts();
      onSave();
    } catch (err) {
      console.error("Save error:", err);
      onMessage("error", err instanceof Error ? err.message : "Failed to save blog post");
    } finally {
      setLocalSaving(false);
    }
  };

  const handleDelete = async (postSlug: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    setDeletingSlug(postSlug);
    try {
      const res = await fetch(`/api/blogs?slug=${postSlug}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete blog post");
      }

      onMessage("success", "Blog post deleted!");
      loadPosts();
      if (selectedPost?.slug === postSlug) {
        resetForm();
      }
    } catch (err) {
      console.error("Delete error:", err);
      onMessage("error", err instanceof Error ? err.message : "Failed to delete blog post");
    } finally {
      setDeletingSlug(null);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Render list view
  if (!isCreating && !isEditing) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Blog Posts</h2>
            <p className="text-zinc-400 text-sm mt-1">Manage your blog content</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <FiPlus size={18} />
            <span>New Post</span>
          </button>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
              <FiFileText className="text-zinc-500" size={28} />
            </div>
            <p className="text-zinc-500 mb-4">No blog posts yet.</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-5 hover:bg-zinc-900 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-zinc-500 text-xs">
                        <FiClock size={12} />
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-zinc-500 text-sm mt-2 line-clamp-2">{post.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-zinc-600 text-xs">
                      <FiUser size={12} />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      <FiEdit2 size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      disabled={deletingSlug === post.slug}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 size={14} />
                      <span className="hidden sm:inline">{deletingSlug === post.slug ? "..." : "Delete"}</span>
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

  // Render editor
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {isCreating ? "Create New Post" : "Edit Post"}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {isCreating ? "Write a new blog post" : `Editing: ${selectedPost?.title}`}
          </p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <FiX size={16} />
          <span>Cancel</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (isCreating) {
                setSlug(generateSlug(e.target.value));
              }
            }}
            className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            placeholder="Enter post title"
          />
        </div>

        {/* Slug (for editing) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-zinc-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="post-url-slug"
            />
          </div>
        )}

        {/* Category and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <FiTag size={14} />
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="e.g., AI & Agents"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <FiCalendar size={14} />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
            <FiUser size={14} />
            Author
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            placeholder="Author name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Description (Excerpt)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
            placeholder="Brief description for the blog list"
          />
        </div>

        {/* Content */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
            <FiFileText size={14} />
            Content * (MDX Supported)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono text-sm resize-y"
            placeholder={`Write your content here... You can use MDX format.

Example format:
---
title: "Your Title"
category: "Your Category"
date: "2026-01-01"
author: "Your Name"
---

<div className="content-section">
  <h3 className="section-label">01 / SECTION TITLE</h3>
  <p className="hero-para">Your hero paragraph here.</p>
  <p>Your regular paragraph here.</p>
</div>`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={localSaving}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {localSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{isEditing ? "Update Post" : "Create Post"}</span>
                <FiChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

