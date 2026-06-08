'use client';

import { useState, useEffect, useCallback } from 'react';
import { visaAssistanceService } from '@/lib/services/visa-assistance-service';
import { useCurrency } from '@/contexts/CurrencyContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisaType {
  type: string;
  price: number;
  currency: string;
  processingTime: string;
  description: string;
  isAvailable: boolean;
}

interface VisaPriceEntry {
  _id: string;
  country: string;
  countryCode: string;
  visaTypes: VisaType[];
  isActive: boolean;
  isOthers: boolean;
  sortOrder: number;
}

interface VisaApplication {
  _id: string;
  applicationReference: string;
  destinationCountry: string;
  visaType: string;
  status: string;
  paymentStatus: string;
  fees: { total: number };
  guestEmail: string;
  guestPhoneNumber: string;
  personalInformation: { firstName: string; lastName: string };
  assignedOfficer?: { firstName: string; lastName: string };
  createdAt: string;
}

type TabType = 'applications' | 'pricing';

const VISA_TYPES_ENUM = ['Tourist', 'Business', 'Student', 'Transit', 'Work'];
const STATUS_COLORS: Record<string, string> = {
  Pending:                    'bg-yellow-100 text-yellow-800',
  'Under Review':             'bg-blue-100 text-blue-800',
  'Additional Documents Required': 'bg-orange-100 text-orange-800',
  Approved:                   'bg-green-100 text-green-800',
  Rejected:                   'bg-red-100 text-red-800',
};
const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Paid:    'bg-green-100 text-green-800',
  Failed:  'bg-red-100 text-red-800',
  Refunded:'bg-gray-100 text-gray-800',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VisaManagement() {
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<TabType>('applications');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Visa Assistance</h2>
          <p className="text-sm text-gray-500 mt-1">Manage applications, pricing, and officer assignments</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          {(['applications', 'pricing'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'applications' ? 'Applications' : 'Price Inventory'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'applications' ? (
        <ApplicationsPanel formatAmount={formatAmount} />
      ) : (
        <PricingPanel />
      )}
    </div>
  );
}

// ─── Applications Panel ───────────────────────────────────────────────────────

function ApplicationsPanel({ formatAmount }: { formatAmount: (n: number) => string }) {
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [filters, setFilters]           = useState({ status: '', paymentStatus: '', page: 1 });
  const [total, setTotal]               = useState(0);
  const [selected, setSelected]         = useState<VisaApplication | null>(null);
  const [showDetail, setShowDetail]     = useState(false);
  const [statusNote, setStatusNote]     = useState('');
  const [newStatus, setNewStatus]       = useState('');
  const [payLinkAmount, setPayLinkAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visaAssistanceService.getOfficerApplications({
        status:        filters.status      || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        page:          filters.page,
      });
      setApplications(res.data.applications || []);
      setTotal(res.data.total || 0);
    } catch (e: any) {
      setError(e.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const openDetail = async (app: VisaApplication) => {
    setSelected(app);
    setShowDetail(true);
    setActionMsg(null);
    setNewStatus(app.status);
    setPayLinkAmount(String(app.fees?.total || ''));
  };

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    setActionLoading(true);
    try {
      await visaAssistanceService.updateStatus(selected._id, newStatus, statusNote);
      setActionMsg({ type: 'success', text: 'Status updated successfully' });
      fetchApplications();
      setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message || 'Failed to update status' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendPaymentLink = async () => {
    if (!selected || !payLinkAmount) return;
    const amount = parseFloat(payLinkAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionMsg({ type: 'error', text: 'Enter a valid amount' });
      return;
    }
    setActionLoading(true);
    try {
      await visaAssistanceService.generatePaymentLink(
        selected._id,
        amount,
        `Visa Assistance — ${selected.destinationCountry}`
      );
      setActionMsg({ type: 'success', text: `Payment link sent to ${selected.guestEmail}` });
      fetchApplications();
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message || 'Failed to send payment link' });
    } finally {
      setActionLoading(false);
    }
  };

  const PAGES = Math.ceil(total / 20) || 1;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
        >
          <option value="">All Statuses</option>
          {['Pending', 'Under Review', 'Additional Documents Required', 'Approved', 'Rejected'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
          value={filters.paymentStatus}
          onChange={e => setFilters(f => ({ ...f, paymentStatus: e.target.value, page: 1 }))}
        >
          <option value="">All Payment Statuses</option>
          {['Pending', 'Paid', 'Failed', 'Refunded'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={fetchApplications}
          className="text-sm px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
        <span className="text-sm text-gray-500 self-center ml-auto">{total} total</span>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="material-icons text-5xl mb-3 block">inbox</span>
          No applications found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">Reference</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Applicant</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Destination</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Fee</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{app.applicationReference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {app.personalInformation?.firstName} {app.personalInformation?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{app.guestEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{app.destinationCountry}</td>
                  <td className="px-4 py-3 text-gray-700">{app.visaType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[app.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {app.fees?.total ? formatAmount(app.fees.total) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(app.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(app)}
                      className="text-xs font-semibold text-brand-red hover:underline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {PAGES > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: PAGES }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setFilters(f => ({ ...f, page: p }))}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                filters.page === p ? 'bg-brand-red text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Application Details</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selected.applicationReference}</p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {actionMsg && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  actionMsg.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {actionMsg.text}
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Destination', selected.destinationCountry],
                  ['Visa Type',   selected.visaType],
                  ['Status',      selected.status],
                  ['Payment',     selected.paymentStatus],
                  ['Email',       selected.guestEmail],
                  ['Phone',       selected.guestPhoneNumber],
                  ['Fee',         selected.fees?.total ? formatAmount(selected.fees.total) : '—'],
                  ['Officer',     selected.assignedOfficer
                    ? `${selected.assignedOfficer.firstName} ${selected.assignedOfficer.lastName}`
                    : 'Unassigned'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-gray-900 font-medium break-all">{value}</p>
                  </div>
                ))}
              </div>

              {/* Update status */}
              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Update Status</h4>
                <select
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-3"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  {['Pending', 'Under Review', 'Additional Documents Required', 'Approved', 'Rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <textarea
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-3 resize-none"
                  rows={2}
                  placeholder="Note (optional)"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={actionLoading}
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Saving…' : 'Update Status'}
                </button>
              </div>

              {/* Send payment link */}
              {selected.paymentStatus === 'Pending' && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Send Payment Link</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2"
                      placeholder="Amount (₦)"
                      value={payLinkAmount}
                      onChange={e => setPayLinkAmount(e.target.value)}
                    />
                    <button
                      onClick={handleSendPaymentLink}
                      disabled={actionLoading || !payLinkAmount}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    A Paystack payment link will be emailed directly to the applicant.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pricing Panel ────────────────────────────────────────────────────────────

function PricingPanel() {
  const [entries, setEntries]   = useState<VisaPriceEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<VisaPriceEntry | null>(null);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for create/edit
  const [formCountry, setFormCountry]   = useState('');
  const [formCode, setFormCode]         = useState('');
  const [formIsOthers, setFormIsOthers] = useState(false);
  const [formSortOrder, setFormSortOrder] = useState(100);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formVisaTypes, setFormVisaTypes] = useState<VisaType[]>([
    { type: 'Tourist', price: 0, currency: 'NGN', processingTime: '5-10 business days', description: '', isAvailable: true },
  ]);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visaAssistanceService.getAllPricesAdmin();
      setEntries(res.data.prices || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load pricing');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditing(null);
    setFormCountry('');
    setFormCode('');
    setFormIsOthers(false);
    setFormSortOrder(100);
    setFormIsActive(true);
    setFormVisaTypes([{ type: 'Tourist', price: 0, currency: 'NGN', processingTime: '5-10 business days', description: '', isAvailable: true }]);
    setShowForm(true);
    setMsg(null);
  };

  const openEdit = (entry: VisaPriceEntry) => {
    setEditing(entry);
    setFormCountry(entry.country);
    setFormCode(entry.countryCode);
    setFormIsOthers(entry.isOthers);
    setFormSortOrder(entry.sortOrder);
    setFormIsActive(entry.isActive);
    setFormVisaTypes(entry.visaTypes.map(v => ({ ...v })));
    setShowForm(true);
    setMsg(null);
  };

  const addVisaType = () => {
    setFormVisaTypes(prev => [
      ...prev,
      { type: 'Tourist', price: 0, currency: 'NGN', processingTime: '5-10 business days', description: '', isAvailable: true },
    ]);
  };

  const removeVisaType = (idx: number) => {
    setFormVisaTypes(prev => prev.filter((_, i) => i !== idx));
  };

  const updateVisaTypeField = <K extends keyof VisaType>(idx: number, field: K, value: VisaType[K]) => {
    setFormVisaTypes(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    if (!formCountry.trim()) { setMsg({ type: 'error', text: 'Country name is required' }); return; }
    if (formVisaTypes.length === 0) { setMsg({ type: 'error', text: 'Add at least one visa type' }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        country:    formCountry.trim(),
        countryCode: formCode.trim().toUpperCase() || 'XX',
        visaTypes:  formVisaTypes,
        isActive:   formIsActive,
        sortOrder:  formSortOrder,
        isOthers:   formIsOthers,
      };
      if (editing) {
        await visaAssistanceService.updatePriceEntry(editing._id, payload);
        setMsg({ type: 'success', text: 'Entry updated' });
      } else {
        await visaAssistanceService.createPriceEntry(payload);
        setMsg({ type: 'success', text: 'Entry created' });
      }
      await fetch();
      setTimeout(() => setShowForm(false), 1200);
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: VisaPriceEntry) => {
    if (!confirm(`Delete pricing for "${entry.country}"? This cannot be undone.`)) return;
    try {
      await visaAssistanceService.deletePriceEntry(entry._id);
      await fetch();
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  const handleToggleActive = async (entry: VisaPriceEntry) => {
    try {
      await visaAssistanceService.updatePriceEntry(entry._id, { isActive: !entry.isActive });
      await fetch();
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{entries.length} destinations configured</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-red hover:bg-brand-red/90 transition-colors"
        >
          <span className="material-icons text-base">add</span>
          Add Destination
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="material-icons text-5xl mb-3 block">public_off</span>
          No pricing entries yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div
              key={entry._id}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-opacity ${entry.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">{entry.country}</span>
                    <span className="text-xs text-gray-400 font-mono">{entry.countryCode}</span>
                    {entry.isOthers && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">Others</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {entry.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.visaTypes.map((vt, i) => (
                      <div
                        key={i}
                        className={`text-xs rounded-lg px-3 py-1.5 ${vt.isAvailable ? 'bg-gray-50 border border-gray-100' : 'bg-gray-50 border border-gray-100 opacity-50'}`}
                      >
                        <span className="font-semibold text-gray-700">{vt.type}</span>
                        <span className="text-gray-400 mx-1">·</span>
                        <span className="text-brand-red font-bold">₦{vt.price.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">{vt.processingTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(entry)}
                    title={entry.isActive ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-icons text-base">{entry.isActive ? 'visibility_off' : 'visibility'}</span>
                  </button>
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <span className="material-icons text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(entry)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-icons text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Destination' : 'Add Destination'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {msg && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  msg.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {msg.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Country Name *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="United Kingdom"
                    value={formCountry}
                    onChange={e => setFormCountry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Country Code</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm uppercase"
                    placeholder="GB"
                    maxLength={2}
                    value={formCode}
                    onChange={e => setFormCode(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Sort Order</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    value={formSortOrder}
                    onChange={e => setFormSortOrder(parseInt(e.target.value) || 100)}
                  />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={formIsActive} onChange={e => setFormIsActive(e.target.checked)} />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={formIsOthers} onChange={e => setFormIsOthers(e.target.checked)} />
                    "Others" catch-all
                  </label>
                </div>
              </div>

              {/* Visa types */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Visa Types</label>
                  <button
                    type="button"
                    onClick={addVisaType}
                    className="text-xs font-semibold text-brand-red hover:underline flex items-center gap-1"
                  >
                    <span className="material-icons text-sm">add</span>Add Type
                  </button>
                </div>
                <div className="space-y-4">
                  {formVisaTypes.map((vt, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <select
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                          value={vt.type}
                          onChange={e => updateVisaTypeField(idx, 'type', e.target.value)}
                        >
                          {VISA_TYPES_ENUM.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={vt.isAvailable}
                              onChange={e => updateVisaTypeField(idx, 'isAvailable', e.target.checked)}
                            />
                            Available
                          </label>
                          {formVisaTypes.length > 1 && (
                            <button onClick={() => removeVisaType(idx)} className="text-red-400 hover:text-red-600">
                              <span className="material-icons text-sm">remove_circle_outline</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Price (₦)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                            value={vt.price}
                            onChange={e => updateVisaTypeField(idx, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Processing Time</label>
                          <input
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                            value={vt.processingTime}
                            onChange={e => updateVisaTypeField(idx, 'processingTime', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
                        <input
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          value={vt.description}
                          placeholder="Brief note shown to clients"
                          onChange={e => updateVisaTypeField(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-brand-red hover:bg-brand-red/90 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
