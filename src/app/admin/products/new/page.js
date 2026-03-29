'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Upload, 
  Save, 
  Plus,
  Tag, 
  DollarSign, 
  Box, 
  Layers,
  RefreshCw 
} from 'lucide-react';
import { categories } from '@/data/products';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    brand: '',
    description: '',
    dimensions: '',
    materials: '',
    images: []
  });

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
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
        images: [data.url]
      });
      toast.success('Asset uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Creation failed');
      
      toast.success(`${formData.name} added to collection`);
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to register new artifact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:translate-x-[-4px] hover:bg-secondary hover:text-foreground transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">New Manifest</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Introducing a new luxury artifact to the santiago bros registry.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-primary px-10 py-3 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
            Register Piece
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3 pb-24">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Box size={22} className="text-primary opacity-80" />
              General Information
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 text-lg font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. Mediterranean Oak Sideboard"
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
                  placeholder="modern-oak-sideboard"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Product Narrative</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-5 rounded-xl border border-border bg-secondary/10 text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="Describe the artisan essence and heritage of this furniture piece..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Layers size={22} className="text-primary opacity-80" />
              Physical Characteristics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Dimensions</label>
                <input 
                  type="text" 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. 180cm x 45cm x 80cm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Materials Used</label>
                <input 
                  type="text" 
                  value={formData.materials}
                  onChange={(e) => setFormData({...formData, materials: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="Oak, Steel, Natural Oil..."
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Tag size={22} className="text-primary opacity-80" />
              Taxonomy
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Collection Segment</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 appearance-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="" disabled>Select Segment</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Investment ($ USD)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full h-14 pl-12 pr-5 rounded-xl border border-border bg-secondary/10 text-lg font-serif focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                    placeholder="2500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Brand Artisan</label>
                <input 
                  type="text" 
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. Santiago Bros"
                />
              </div>
            </div>
          </section>

          {/* Asset Preview */}
          <section className="rounded-2xl border border-border bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Asset Link or Upload</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                required
                value={formData.images[0] || ''}
                onChange={(e) => setFormData({...formData, images: e.target.value ? [e.target.value] : []})}
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
              <div className="aspect-square w-full rounded-xl border-2 border-dashed border-border bg-secondary/5 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all duration-500">
                {formData.images.length > 0 ? (
                  <img 
                    src={formData.images[0]} 
                    alt="Asset preview" 
                    className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <Upload size={32} strokeWidth={1} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Artifact</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[9px] text-center text-muted-foreground italic tracking-wide">Artifact images must be high-resolution for luxury presentation.</p>
          </section>
        </div>
      </form>
    </div>
  );
}
