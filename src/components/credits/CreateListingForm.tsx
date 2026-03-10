// src/components/credits/CreateListingForm.tsx
import { useForm } from 'react-hook-form';
import { useCreateListing } from '@/hooks/credits/useCredits';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface FormData {
  pricePerTonne: string;
  minimumQuantity: string;
  durationDays: '30' | '60' | '90';
  description: string;
}

interface Props {
  creditId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateListingForm({ creditId, open, onOpenChange }: Props) {
  const createListing = useCreateListing(creditId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { minimumQuantity: '1', durationDays: '30', description: '' },
  });

  const onSubmit = (data: FormData) => {
    const price = Number(data.pricePerTonne);
    const qty = Number(data.minimumQuantity);
    const days = Number(data.durationDays) as 30 | 60 | 90;
    if (!price || price < 100) return;
    createListing.mutate(
      { pricePerTonne: price, minimumQuantity: qty, durationDays: days, description: data.description || undefined } as never,
      { onSuccess: () => { onOpenChange(false); reset(); } }
    );
  };

  const priceVal = Number(watch('pricePerTonne'));
  const priceError = priceVal && (priceVal < 100 || priceVal > 10000) ? 'Price must be ₹100 – ₹10,000' : undefined;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="List Credit on Marketplace" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Price per tonne (INR)"
          type="number"
          required
          placeholder="e.g. 850"
          hint="Market range: ₹600 – ₹1,200"
          error={priceError}
          {...register('pricePerTonne', { required: true })}
        />

        <Input
          label="Minimum purchase quantity (tonnes)"
          type="number"
          min={1}
          {...register('minimumQuantity')}
        />

        <Select
          label="Listing duration"
          options={[
            { value: '30', label: '30 days' },
            { value: '60', label: '60 days' },
            { value: '90', label: '90 days' },
          ]}
          value={watch('durationDays')}
          onValueChange={(v) => setValue('durationDays', v as '30' | '60' | '90')}
        />

        <Input
          label="Description (optional)"
          placeholder="Additional context for buyers…"
          {...register('description')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          <Button type="submit" loading={createListing.isPending} className="flex-1">Publish Listing</Button>
        </div>
      </form>
    </Modal>
  );
}
