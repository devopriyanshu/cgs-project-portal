// src/components/ui/FileUpload.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { validateFile, uploadToS3 } from '@/lib/utils/upload';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  url?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

interface FileUploadProps {
  projectId?: string;
  onFilesUploaded?: (urls: string[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  label?: string;
}

const DEFAULT_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export function FileUpload({
  projectId,
  onFilesUploaded,
  maxFiles = 5,
  accept = DEFAULT_ACCEPT,
  label = 'Upload Documents',
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (uploadedFile: UploadedFile) => {
    const index = files.indexOf(uploadedFile);
    const update = (patch: Partial<UploadedFile>) =>
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, ...patch } : f))
      );

    const validationError = validateFile(uploadedFile.file);
    if (validationError) {
      update({ status: 'error', error: validationError });
      toast.error(validationError);
      return;
    }

    update({ status: 'uploading' });
    try {
      const url = await uploadToS3({
        file: uploadedFile.file,
        projectId,
        onProgress: (progress) => update({ progress }),
      });
      update({ status: 'done', url, progress: 100 });
      onFilesUploaded?.([url]);
    } catch {
      update({ status: 'error', error: 'Upload failed. Please try again.' });
      toast.error('Upload failed. Please try again.');
    }
  };

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles: UploadedFile[] = accepted.map((file) => ({
        file, progress: 0, status: 'pending',
      }));
      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
      newFiles.forEach((f) => uploadFile(f));
    },
    [projectId, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, maxFiles,
  });

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition',
          isDragActive
            ? 'border-cgs-sage bg-cgs-sage/5'
            : 'border-cgs-mist hover:border-cgs-sage/60 hover:bg-cgs-sage/5'
        )}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto mb-3 text-cgs-sage/60" />
        <p className="font-medium text-cgs-forest">{label}</p>
        <p className="mt-1 text-sm text-gray-400">
          {isDragActive ? 'Drop it here!' : 'Drag & drop or click to browse'}
        </p>
        <p className="mt-2 text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG — max 50MB each</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-cgs-mist bg-white px-3 py-2">
              <File size={18} className="shrink-0 text-cgs-sage" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-cgs-charcoal">{f.file.name}</p>
                {f.status === 'uploading' && (
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-cgs-sage transition-all"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.error && <p className="mt-0.5 text-xs text-red-500">{f.error}</p>}
              </div>
              <div className="shrink-0">
                {f.status === 'uploading' && <Loader2 size={16} className="animate-spin text-cgs-sage" />}
                {f.status === 'done' && <CheckCircle2 size={16} className="text-green-500" />}
                {(f.status === 'pending' || f.status === 'error') && (
                  <button onClick={() => removeFile(i)}>
                    <X size={16} className="text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
