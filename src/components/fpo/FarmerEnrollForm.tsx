// src/components/fpo/FarmerEnrollForm.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Info } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { hashAadhaar } from '@/lib/utils/format';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface FormData {
  name: string;
  phone: string;
  aadhaar: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  upiId: string;
  bankAccount: string;
  bankIfsc: string;
  totalAcres: string;
  primaryCrop: string;
}

const INITIAL: FormData = { name: '', phone: '', aadhaar: '', village: '', district: '', state: '', pincode: '', upiId: '', bankAccount: '', bankIfsc: '', totalAcres: '', primaryCrop: '' };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function FarmerEnrollForm({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit Indian mobile required';
    if (!/^\d{12}$/.test(form.aadhaar)) e.aadhaar = 'Aadhaar must be 12 digits';
    if (!form.village.trim()) e.village = 'Village required';
    if (!form.district.trim()) e.district = 'District required';
    if (!form.state.trim()) e.state = 'State required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const aadhaarHash = await hashAadhaar(form.aadhaar);
      await apiClient.post(API_ENDPOINTS.FPO.ENROLL_FARMER, {
        name: form.name,
        phone: form.phone,
        aadhaarHash,
        village: form.village,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        upiId: form.upiId || undefined,
        bankAccount: form.bankAccount || undefined,
        bankIfsc: form.bankIfsc || undefined,
        totalAcres: form.totalAcres ? Number(form.totalAcres) : undefined,
        primaryCrop: form.primaryCrop || undefined,
      });
      toast.success('Farmer enrolled successfully!');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.fpo.farmers() });
      onOpenChange(false);
      setForm(INITIAL);
      setErrors({});
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Enroll New Farmer">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" required value={form.name} onChange={set('name')} error={errors.name} />
        <Input label="Mobile Number" type="tel" required placeholder="10-digit mobile" value={form.phone} onChange={set('phone')} error={errors.phone} />

        <div>
          <Input
            label="Aadhaar Number"
            type="password"
            inputMode="numeric"
            maxLength={12}
            required
            value={form.aadhaar}
            onChange={set('aadhaar')}
            error={errors.aadhaar}
          />
          <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-500">
            <Info size={12} className="mt-0.5 shrink-0 text-blue-500" />
            Aadhaar number is hashed (SHA-256) before sending. CGS never stores raw Aadhaar.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Village" required value={form.village} onChange={set('village')} error={errors.village} />
          <Input label="District" required value={form.district} onChange={set('district')} error={errors.district} />
          <Input label="State" required value={form.state} onChange={set('state')} error={errors.state} />
          <Input label="Pincode" type="text" inputMode="numeric" maxLength={6} required value={form.pincode} onChange={set('pincode')} error={errors.pincode} />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Details</p>
          <Input label="UPI ID (for payouts)" value={form.upiId} onChange={set('upiId')} />
          <Input label="Bank Account Number" className="mt-3" value={form.bankAccount} onChange={set('bankAccount')} />
          <Input label="Bank IFSC Code" className="mt-3" value={form.bankIfsc} onChange={set('bankIfsc')} />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Farm Details</p>
          <Input label="Total Acres" type="number" step="0.5" value={form.totalAcres} onChange={set('totalAcres')} />
          <Input label="Primary Crop" className="mt-3" placeholder="Wheat, Rice, Cotton…" value={form.primaryCrop} onChange={set('primaryCrop')} />
        </div>

        <Button type="submit" loading={loading} className="mt-2">
          Enroll Farmer
        </Button>
      </form>
    </Drawer>
  );
}
