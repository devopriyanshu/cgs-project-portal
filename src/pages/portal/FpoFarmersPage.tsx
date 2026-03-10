// src/pages/portal/FpoFarmersPage.tsx
import { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmers, useEnrollFarmer } from '@/hooks/fpo/useFpo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime } from '@/lib/utils/format';
import { hashAadhaar } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const KYC_FILTERS = ['All', 'Verified', 'Pending KYC', 'Inactive'] as const;

export default function FpoFarmersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState<typeof KYC_FILTERS[number]>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Raw form state (no RHF — simpler to avoid zod transform issues)
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', aadhaar: '',
    village: '', district: '', state: '', totalAcres: '', upiId: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useFarmers({ page, limit: 20, search: search || undefined });
  const enroll = useEnrollFarmer();

  const setField = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (formErrors[key]) setFormErrors(e => { const n = {...e}; delete n[key]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Valid Indian mobile number required (6–9 start)';
    if (!/^\d{12}$/.test(form.aadhaar)) errs.aadhaar = '12-digit Aadhaar required';
    if (!form.village.trim()) errs.village = 'Required';
    if (!form.district.trim()) errs.district = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    const acres = parseFloat(form.totalAcres);
    if (isNaN(acres) || acres <= 0) errs.totalAcres = 'Enter a valid positive number';
    return errs;
  };

  const onEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const aadhaarHash = await hashAadhaar(form.aadhaar);
    const { aadhaar: _a, ...rest } = form;
    enroll.mutate(
      { ...rest, totalAcres: parseFloat(form.totalAcres), aadhaarHash },
      { onSuccess: () => { setForm({ firstName:'',lastName:'',phone:'',aadhaar:'',village:'',district:'',state:'',totalAcres:'',upiId:'' }); setDrawerOpen(false); } }
    );
  };

  const Field = ({ name, label, placeholder, type = 'text', note }: { name: string; label: string; placeholder?: string; type?: string; note?: string }) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-cgs-charcoal">{label}</label>
      <input
        type={type}
        value={form[name as keyof typeof form]}
        onChange={e => setField(name, e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition',
          formErrors[name]
            ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
            : 'border-cgs-mist focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20'
        )}
      />
      {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
      {formErrors[name] && <p className="mt-1 text-xs text-red-500">{formErrors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmers"
        subtitle={`${data?.meta?.total ?? 0} farmers enrolled`}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-cgs-sage px-4 py-2 text-sm font-semibold text-white hover:bg-cgs-moss"
            >
              <Plus size={15} /> Enroll Farmer
            </button>
          </div>
        }
      />

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, or village…"
            className="w-full rounded-lg border border-cgs-mist bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20"
          />
        </div>
        <div className="flex gap-1">
          {KYC_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setKycFilter(f)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                kycFilter === f ? 'bg-cgs-sage text-white' : 'bg-white ring-1 ring-cgs-mist text-gray-500 hover:ring-cgs-sage/40'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <EmptyState
          preset="farmers"
          action={
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg bg-cgs-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss"
            >
              + Enroll Your First Farmer
            </button>
          }
        />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-cgs-cream/60 text-left">
                <th className="px-4 py-3 font-medium text-cgs-forest">Name</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Phone</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Village / District</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Acres</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">KYC</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Enrolled</th>
                <th className="px-4 py-3 text-right font-medium text-cgs-forest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-cgs-charcoal">
                    {farmer.firstName} {farmer.lastName}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{farmer.phone}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {[farmer.village, farmer.district].filter(Boolean).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{farmer.totalAcres ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      farmer.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                      farmer.kycStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {farmer.kycStatus ?? 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatRelativeTime(farmer.enrolledAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded p-1 text-gray-400 hover:text-cgs-sage hover:bg-cgs-sage/5">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          hasNextPage={data.meta.hasNextPage}
          hasPrevPage={data.meta.hasPrevPage}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
        />
      )}

      {/* Enroll Farmer Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 inset-y-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
            >
              <div className="border-b border-cgs-mist px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold italic text-cgs-forest">Enroll New Farmer</h2>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <form onSubmit={onEnroll} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field name="firstName" label="First Name" />
                  <Field name="lastName" label="Last Name" />
                </div>
                <Field name="phone" label="Phone (Indian mobile)" type="tel" placeholder="e.g. 9876543210" />
                <Field
                  name="aadhaar"
                  label="Aadhaar Number"
                  note="🔒 Hashed client-side before transmission. CGS never stores raw Aadhaar."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field name="village" label="Village" />
                  <Field name="district" label="District" />
                </div>
                <Field name="state" label="State" />
                <Field name="totalAcres" label="Total Acres" type="number" placeholder="e.g. 2.5" />
                <Field name="upiId" label="UPI ID (for payouts)" placeholder="e.g. farmer@upi" />

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="flex-1 rounded-lg border border-cgs-mist py-2.5 text-sm font-medium text-cgs-forest hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enroll.isPending}
                    className="flex-1 rounded-lg bg-cgs-sage py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss disabled:opacity-50"
                  >
                    {enroll.isPending ? 'Enrolling…' : 'Enroll Farmer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
