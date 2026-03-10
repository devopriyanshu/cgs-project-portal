// src/components/fpo/BatchUploadZone.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useBatchStatus } from '@/hooks/fpo/useFpo';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';

export function BatchUploadZone() {
  const [batchId, setBatchId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data: batchStatus } = useBatchStatus(batchId, processing);

  const isComplete = batchStatus?.status === 'COMPLETED';
  const hasFailed = batchStatus?.status === 'FAILED';

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await apiClient.post(API_ENDPOINTS.FPO.BATCH_ENROLL, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBatchId(data.data.batchId);
      setProcessing(true);
    } catch {
      // handled by interceptor
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    disabled: uploading || processing,
  });

  const handleDownloadTemplate = () => {
    const csv = 'name,phone,aadhaar,village,district,state,pincode,upiId\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cgs_farmer_batch_template.csv';
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-cgs-forest">Batch Enrollment via CSV</p>
        <Button size="sm" variant="secondary" onClick={handleDownloadTemplate}>
          Download Template
        </Button>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all cursor-pointer',
          isDragActive
            ? 'border-cgs-sage bg-cgs-sage/5'
            : 'border-gray-200 bg-gray-50 hover:border-cgs-mist hover:bg-cgs-cream',
          (uploading || processing) && 'pointer-events-none opacity-60'
        )}
      >
        <input {...getInputProps()} />
        <Upload size={28} className="text-gray-400" />
        <div>
          <p className="text-sm font-medium text-cgs-forest">Drop your CSV file here</p>
          <p className="mt-0.5 text-xs text-gray-400">or click to browse — accepts .csv only</p>
        </div>
      </div>

      {/* Progress */}
      {processing && batchStatus && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileText size={14} className="text-cgs-sage" />
              <span className="font-medium text-cgs-forest">Processing batch…</span>
            </div>
            {isComplete && <CheckCircle2 size={16} className="text-emerald-500" />}
            {hasFailed && <XCircle size={16} className="text-red-500" />}
          </div>
          <Progress
            value={batchStatus.processed ?? 0}
            max={batchStatus.total ?? 1}
            showValue
            label={isComplete ? 'Complete' : hasFailed ? 'Failed' : 'Processing'}
            color={hasFailed ? 'error' : 'sage'}
          />
          {batchStatus.errors > 0 && (
            <p className="mt-2 text-xs text-red-500">
              {batchStatus.errors} row{batchStatus.errors > 1 ? 's' : ''} failed. Download error report for details.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
