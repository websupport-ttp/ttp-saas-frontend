'use client';

import { useState, useEffect } from 'react';
import { cmsService, HeroSlide } from '@/lib/services/cms-service';
import ImageUpload from './ImageUpload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await cmsService.getHeroSlides();
      setSlides(response.data);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      await cmsService.deleteHeroSlide(id);
      fetchSlides();
    } catch (error: any) {
      alert(error.message || 'Failed to delete slide');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSlide(null);
    fetchSlides();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <ViewCarouselIcon className="text-brand-blue" sx={{ fontSize: 28 }} />
              <h2 className="text-xl font-semibold text-brand-blue">Hero Slides</h2>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors shadow-sm"
            >
              <AddIcon sx={{ fontSize: 20 }} />
              Add New Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div key={slide._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {slide.image?.url && (
                  <img src={slide.image.url} alt={slide.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-brand-blue">{slide.title}</h3>
                  {slide.subtitle && <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button
                        onClick={() => handleDelete(slide._id!)}
                        className="p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {slides.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <ViewCarouselIcon className="text-gray-400 mx-auto mb-4" sx={{ fontSize: 64 }} />
              <p className="text-gray-600 font-medium">No hero slides yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first slide to get started!</p>
            </div>
          )}
        </>
      ) : (
        <HeroSlideForm slide={editingSlide} onClose={handleFormClose} />
      )}
    </div>
  );
}

function HeroSlideForm({ slide, onClose }: { slide: HeroSlide | null; onClose: () => void }) {
  const [formData, setFormData] = useState<Omit<HeroSlide, '_id'>>({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    image: slide?.image || { url: '' },
    ctaText: slide?.ctaText || '',
    ctaLink: slide?.ctaLink || '',
    order: slide?.order || 0,
    isActive: slide?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (slide?._id) {
        await cmsService.updateHeroSlide(slide._id, formData);
      } else {
        await cmsService.createHeroSlide(formData);
      }
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brand-blue">{slide ? 'Edit' : 'Create'} Hero Slide</h2>
        <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <CloseIcon sx={{ fontSize: 24 }} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-blue mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            placeholder="Enter slide title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-blue mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            placeholder="Enter subtitle (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-blue mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            placeholder="Enter description (optional)"
          />
        </div>

        <ImageUpload
          value={formData.image?.url}
          onChange={(url) => setFormData({ ...formData, image: { url } })}
          label="Hero Image"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-2">CTA Text</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              placeholder="e.g., Book Now"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-2">CTA Link</label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              placeholder="/deals"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
              />
              <span className="ml-2 text-sm font-medium text-brand-blue">Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <SaveIcon sx={{ fontSize: 20 }} />
            {saving ? 'Saving...' : 'Save Slide'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
