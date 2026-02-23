'use client';

import { useState, useEffect } from 'react';
import { cmsService, HotDeal } from '@/lib/services/cms-service';
import ImageUpload from './ImageUpload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function HotDealsManager() {
  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<HotDeal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await cmsService.getHotDeals();
      setDeals(response.data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (deal: HotDeal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      await cmsService.deleteHotDeal(id);
      fetchDeals();
    } catch (error: any) {
      alert(error.message || 'Failed to delete deal');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDeal(null);
    fetchDeals();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
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
              <LocalFireDepartmentIcon className="text-brand-red" sx={{ fontSize: 28 }} />
              <h2 className="text-xl font-semibold text-brand-blue">Hot Deals</h2>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors shadow-sm"
            >
              <AddIcon sx={{ fontSize: 20 }} />
              Add New Deal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {deal.image?.url && (
                  <div className="relative">
                    <img src={deal.image.url} alt={deal.title} className="w-full h-48 object-cover" />
                    {deal.featured && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <LocalOfferIcon sx={{ fontSize: 14 }} />
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-brand-blue">{deal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{deal.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                    <span className="text-lg font-bold text-brand-red">{formatCurrency(deal.discountedPrice)}</span>
                    <span className="ml-auto px-2 py-1 bg-brand-red/10 text-brand-red text-xs font-bold rounded-full">
                      {deal.discountPercentage}% OFF
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Valid: {new Date(deal.validFrom).toLocaleDateString()} - {new Date(deal.validUntil).toLocaleDateString()}
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${deal.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {deal.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(deal)}
                        className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button
                        onClick={() => handleDelete(deal._id!)}
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

          {deals.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <LocalFireDepartmentIcon className="text-gray-400 mx-auto mb-4" sx={{ fontSize: 64 }} />
              <p className="text-gray-600 font-medium">No hot deals yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first deal to get started!</p>
            </div>
          )}
        </>
      ) : (
        <HotDealForm deal={editingDeal} onClose={handleFormClose} />
      )}
    </div>
  );
}

function HotDealForm({ deal, onClose }: { deal: HotDeal | null; onClose: () => void }) {
  const [formData, setFormData] = useState<Omit<HotDeal, '_id'>>({
    title: deal?.title || '',
    description: deal?.description || '',
    image: deal?.image || { url: '' },
    originalPrice: deal?.originalPrice || 0,
    discountedPrice: deal?.discountedPrice || 0,
    category: deal?.category || 'Flight',
    validFrom: deal?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: deal?.validUntil || new Date().toISOString().split('T')[0],
    link: deal?.link || '',
    isActive: deal?.isActive ?? true,
    featured: deal?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (deal?._id) {
        await cmsService.updateHotDeal(deal._id, formData);
      } else {
        await cmsService.createHotDeal(formData);
      }
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to save deal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{deal ? 'Edit' : 'Create'} Hot Deal</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <ImageUpload
          value={formData.image?.url}
          onChange={(url) => setFormData({ ...formData, image: { url } })}
          label="Deal Image"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
            <input
              type="number"
              required
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price *</label>
            <input
              type="number"
              required
              value={formData.discountedPrice}
              onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="Flight">Flight</option>
            <option value="Hotel">Hotel</option>
            <option value="Package">Package</option>
            <option value="Car Rental">Car Rental</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
            <input
              type="date"
              required
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
            <input
              type="date"
              required
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
          <input
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Deal'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
