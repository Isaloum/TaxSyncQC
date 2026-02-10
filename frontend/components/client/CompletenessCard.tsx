'use client';

import { useEffect, useState } from 'react';
import { APIClient } from '@/lib/api-client';

interface CompletenessCardProps {
  year: number;
}

export default function CompletenessCard({ year }: CompletenessCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompleteness();
  }, [year]);

  const loadCompleteness = async () => {
    try {
      const result = await APIClient.getCompleteness(year);
      setData(result);
    } catch (error) {
      console.error('Failed to load completeness:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />;
  if (!data) return null;

  const scoreColor = 
    data.completenessScore >= 90 ? 'text-green-600' :
    data.completenessScore >= 70 ? 'text-yellow-600' :
    'text-red-600';

  const errors = data.validations?.filter((v: any) => v.status === 'fail') || [];
  const warnings = data.validations?.filter((v: any) => v.status === 'warning') || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      <h2 className="text-xl font-bold mb-4">Document Completeness</h2>
      
      {/* Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${data.completenessScore * 3.52} 352`}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
              className={scoreColor}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {data.completenessScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Documents Uploaded:</span>
          <span className="font-semibold">{data.documentsUploaded}</span>
        </div>
        
        {errors.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-red-600">Missing Required:</span>
            <span className="font-semibold text-red-600">{errors.length}</span>
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-yellow-600">Warnings:</span>
            <span className="font-semibold text-yellow-600">{warnings.length}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-4">
        {data.completenessScore === 100 ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-semibold">
            ✅ Ready to Submit
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-center font-semibold">
            ⚠️ Missing Documents
          </div>
        )}
      </div>
    </div>
  );
}
