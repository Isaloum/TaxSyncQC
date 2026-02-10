'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { APIClient } from '@/lib/api-client';
import { DOCUMENT_TYPES, DocType } from '@/lib/document-types';

interface DocumentUploaderProps {
  year: number;
  onUploadComplete: () => void;
}

export default function DocumentUploader({ year, onUploadComplete }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [docType, setDocType] = useState<DocType>('T4');
  const [docSubtype, setDocSubtype] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await APIClient.uploadDocument(year, file, docType, docSubtype || undefined);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setDocSubtype('');
        onUploadComplete();
      }, 500);
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      setProgress(0);
    }
  }, [year, docType, docSubtype, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Upload Document</h3>

      {/* Document Type Selector */}
      <div className="mb-4">
        <label htmlFor="docType" className="block text-sm font-medium mb-2">Document Type</label>
        <select
          id="docType"
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        >
          {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Optional: Employer/Payer Name */}
      <div className="mb-4">
        <label htmlFor="docSubtype" className="block text-sm font-medium mb-2">
          Employer/Payer Name (Optional)
        </label>
        <input
          id="docSubtype"
          type="text"
          value={docSubtype}
          onChange={(e) => setDocSubtype(e.target.value)}
          placeholder="e.g., ABC Corporation"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <div className="text-lg font-semibold mb-2">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">{progress}%</div>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              {isDragActive ? (
                <span className="text-blue-600 font-semibold">Drop file here</span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">
              PDF, JPG, PNG, HEIC up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
