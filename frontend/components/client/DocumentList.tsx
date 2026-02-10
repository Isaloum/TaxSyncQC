'use client';

import { useState } from 'react';
import { APIClient } from '@/lib/api-client';

interface DocumentListProps {
  documents: any[];
  onDelete: () => void;
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (docId: string) => {
    if (!confirm('Delete this document?')) return;

    setDeletingId(docId);
    try {
      await APIClient.deleteDocument(docId);
      onDelete();
    } catch (error: any) {
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const { downloadUrl } = await APIClient.getDownloadUrl(docId);
      window.open(downloadUrl, '_blank');
    } catch (error: any) {
      alert(`Download failed: ${error.message}`);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Document Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Employer/Payer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Uploaded</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{doc.docType}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{doc.docSubtype || '-'}</td>
              <td className="px-4 py-3 text-sm">
                {doc.extractionStatus === 'success' && (
                  <span className="text-green-600">✅ Processed</span>
                )}
                {doc.extractionStatus === 'processing' && (
                  <span className="text-yellow-600">⏳ Processing...</span>
                )}
                {doc.extractionStatus === 'pending' && (
                  <span className="text-gray-600">⏳ Pending</span>
                )}
                {doc.extractionStatus === 'failed' && (
                  <span className="text-red-600">❌ Failed</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-right space-x-2">
                <button
                  onClick={() => handleDownload(doc.id, doc.originalFilename)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
