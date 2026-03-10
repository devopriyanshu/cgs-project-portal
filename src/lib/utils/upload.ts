// src/lib/utils/upload.ts
// S3 pre-signed URL upload utility.
// Files go DIRECTLY to S3 — never through NestJS.
// Flow: GET presigned URL → PUT to S3 → POST metadata to backend

import axios from 'axios';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_DOCUMENT_TYPES } from '@/lib/constants/app.constants';
import type { ApiResponse } from '@/types/api.types';

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface UploadOptions {
  file: File;
  projectId?: string;
  onProgress?: (percent: number) => void;
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File "${file.name}" exceeds the 50MB limit.`;
  }
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type as never)) {
    return `File type "${file.type}" is not accepted. Use PDF, DOC, DOCX, JPG, or PNG.`;
  }
  return null;
}

export async function uploadToS3({
  file,
  projectId,
  onProgress,
}: UploadOptions): Promise<string> {
  // Step 1: Get pre-signed URL from backend
  const { data } = await apiClient.get<ApiResponse<PresignedUrlResponse>>(
    API_ENDPOINTS.UPLOADS.PRESIGNED_URL,
    { params: { filename: file.name, mimeType: file.type, projectId } }
  );

  const { uploadUrl, fileUrl } = data.data;

  // Step 2: PUT directly to S3 using pre-signed URL (no auth header — S3 has its own sig)
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return fileUrl;
}
