'use client';

interface ValidationResultsProps {
  validations: any[];
}

export default function ValidationResults({ validations }: ValidationResultsProps) {
  const errors = validations.filter(v => v.status === 'fail');
  const warnings = validations.filter(v => v.status === 'warning');
  const passes = validations.filter(v => v.status === 'pass');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Document Checklist</h3>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-red-600 font-semibold mb-2">❌ Missing Required Documents</h4>
          <ul className="space-y-2">
            {errors.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{v.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-yellow-600 font-semibold mb-2">⚠️ Warnings</h4>
          <ul className="space-y-2">
            {warnings.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{v.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Passes (collapsed by default) */}
      {passes.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-green-600 font-semibold mb-2">
            ✅ Complete ({passes.length})
          </summary>
          <ul className="space-y-1 mt-2">
            {passes.map((v, i) => (
              <li key={i} className="text-sm text-gray-600 ml-4">
                • {v.message}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
