'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Upload,
  Save, 
  Trash, 
  FolderKanban,
  MapPin,
  RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    location: '',
    year: '',
    description: '',
    image: '',
    categories: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Project not found');
        const project = await res.json();
        
        setFormData({
          title: project.title,
          slug: project.slug,
          location: project.location,
          year: project.year,
          description: project.description,
          image: project.image || '',
          categories: project.categories?.join(', ') || ''
        });
      } catch (error) {
        toast.error('Failed to load project details');
        router.push('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean)
        })
      });
      
      if (!res.ok) throw new Error('Update failed');
      
      toast.success(`Successfully updated ${formData.title}`);
      router.push('/admin/projects');
    } catch (error) {
      toast.error('Failed to sync changes');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      setFormData({
        ...formData,
        image: data.url
      });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Project removed from archive');
      router.push('/admin/projects');
    } catch (error) {
      toast.error('Deletion failed');
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={40} className="animate-spin" />
        <p className="tracking-widest uppercase text-xs">Restoring Project Data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/projects" 
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:translate-x-[-4px] hover:bg-secondary hover:text-foreground transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">Edit Project</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Updating project archive entry.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white transition-all duration-300 shadow-sm"
          >
            <Trash size={16} />
            Delete
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3 pb-24">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <FolderKanban size={22} className="text-primary opacity-80" />
              Project Information
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 text-lg font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. Marbella Villa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">URL Identifier (Slug)</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full h-12 px-5 rounded-xl border border-border bg-secondary/5 text-sm font-mono text-muted-foreground focus:outline-none transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Project Narrative</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-5 rounded-xl border border-border bg-secondary/10 text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="Describe the scope and vision of this design project..."
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <MapPin size={22} className="text-primary opacity-80" />
              Details
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Location</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. Marbella, Spain"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Year</label>
                <input 
                  type="text" 
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 font-serif text-lg focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Categories (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.categories}
                  onChange={(e) => setFormData({...formData, categories: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="Outdoor, Sofas, Lighting"
                />
              </div>
            </div>
          </section>

          {/* Image Preview */}
          <section className="rounded-2xl border border-border bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Cover Image Link or Upload</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-border bg-secondary/10 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                placeholder="https://images.unsplash.com/..."
              />
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-12 rounded-xl bg-primary text-white text-sm font-medium tracking-wide hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? 'Uploading...' : 'Upload from System'}
                </button>
              </div>
              <div className="aspect-video w-full rounded-xl border-2 border-dashed border-border bg-secondary/5 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all duration-500">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Project preview" 
                    className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <Upload size={32} strokeWidth={1} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-primary px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Swap Asset
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>

      {isModalOpen && (
        <DeleteModal
          itemName={formData.title || 'this project'}
          isDeleting={isDeleting}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
