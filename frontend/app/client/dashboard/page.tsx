'use client';

import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const taxYears = [currentYear, currentYear - 1];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Tax Years</h1>

      <div className="grid gap-4">
        {taxYears.map((year) => (
          <button
            key={year}
            onClick={() => router.push(`/client/tax-year/${year}`)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{year}</h2>
                <p className="text-gray-600">Click to manage documents</p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
