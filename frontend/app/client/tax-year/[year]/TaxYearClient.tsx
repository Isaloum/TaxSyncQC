'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { APIClient } from '@/lib/api-client';

export default function TaxYearClient() {
  const params = useParams();
  const router = useRouter();
  const year = parseInt(params.year as string);

  const [completeness, setCompleteness] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('T4');

  const loadCompleteness = async () => {
    try {
      const res = await APIClient.getCompleteness(year);
      setCompleteness(res.data);
    } catch (error: any) {
      console.error('Load error:', error);
    }
  };

  useEffect(() => {
    loadCompleteness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Step 1: get signed URL
      const presignRes = await APIClient.presignUpload(year, {
        docType,
        filename: selectedFile.name,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
      });
      const { signedUrl, documentId } = presignRes.data;

      // Step 2: upload directly to Supabase (no API Gateway)
      const uploadRes = await APIClient.uploadToSignedUrl(signedUrl, selectedFile);
      if (!uploadRes.ok) throw new Error(`Storage upload failed: ${uploadRes.status}`);

      // Step 3: confirm + trigger processing
      await APIClient.confirmUpload(documentId);

      setSelectedFile(null);
      alert(`${docType} uploaded successfully!`);
      loadCompleteness();
    } catch (error: any) {
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const hasProfile = completeness?.taxYear?.profile && (
    completeness.taxYear.profile.has_employment_income ||
    completeness.taxYear.profile.has_self_employment ||
    completeness.taxYear.profile.has_investment_income ||
    completeness.taxYear.profile.has_rental_income ||
    completeness.taxYear.profile.has_rrsp_contributions ||
    completeness.taxYear.profile.has_childcare_expenses ||
    completeness.taxYear.profile.has_tuition ||
    completeness.taxYear.profile.has_medical_expenses ||
    completeness.taxYear.profile.has_donations ||
    completeness.taxYear.profile.claims_home_office ||
    completeness.taxYear.profile.has_moving_expenses ||
    completeness.taxYear.profile.is_married ||
    completeness.taxYear.profile.has_dependents
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tax Year {year}</h1>
          <button onClick={() => router.push('/client/dashboard')} className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-4xl">
        {!hasProfile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">Please complete your tax profile first</p>
            <button
              onClick={() => router.push(`/client/tax-year/${year}/profile`)}
              className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Complete Profile
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <optgroup label="── Federal Slips ──">
                  <option value="T4">T4 – Employment Income</option>
                  <option value="T4A">T4A – Pension / Retirement / Other Income</option>
                  <option value="T4A_P">T4A(P) – CPP / QPP Benefits</option>
                  <option value="T4A_OAS">T4A(OAS) – Old Age Security</option>
                  <option value="T4E">T4E – Employment Insurance (EI)</option>
                  <option value="T4RSP">T4RSP – RRSP Income</option>
                  <option value="T4RIF">T4RIF – RRIF Income</option>
                  <option value="T5">T5 – Investment Income (Dividends / Interest)</option>
                  <option value="T3">T3 – Trust / Mutual Fund Income</option>
                  <option value="T5008">T5008 – Securities Transactions</option>
                  <option value="T5013">T5013 – Partnership Income</option>
                  <option value="T2202">T2202 – Tuition Certificate</option>
                  <option value="T1007">T1007 – Workers Compensation</option>
                </optgroup>
                <optgroup label="── Quebec RL Slips ──">
                  <option value="RL1">RL-1 – Employment &amp; Other Income (Quebec)</option>
                  <option value="RL2">RL-2 – Retirement / Pension Income</option>
                  <option value="RL3">RL-3 – Investment Income</option>
                  <option value="RL5">RL-5 – Benefits &amp; Allocations</option>
                  <option value="RL6">RL-6 – Dividends from Quebec Companies</option>
                  <option value="RL8">RL-8 – Tuition (Quebec)</option>
                  <option value="RL10">RL-10 – EI &amp; QPIP Benefits</option>
                  <option value="RL11">RL-11 – RRSP / RRIF Income</option>
                  <option value="RL15">RL-15 – Professional / Self-Employment Income</option>
                  <option value="RL16">RL-16 – Trust Income</option>
                  <option value="RL22">RL-22 – Employee Benefits</option>
                  <option value="RL24">RL-24 – Childcare Assistance</option>
                  <option value="RL25">RL-25 – Amounts Paid to Residents of Canada</option>
                  <option value="RL31">RL-31 – Rental Housing</option>
                </optgroup>
                <optgroup label="── Contributions &amp; Receipts ──">
                  <option value="RRSP">RRSP Contribution Receipt</option>
                  <option value="TFSA">TFSA Contribution Receipt</option>
                  <option value="FHSA">FHSA – First Home Savings Account</option>
                  <option value="HBP">HBP – Home Buyers&apos; Plan Repayment</option>
                  <option value="LLP">LLP – Lifelong Learning Plan Repayment</option>
                </optgroup>
                <optgroup label="── Deductions &amp; Credits ──">
                  <option value="Medical">Medical Expenses Receipts</option>
                  <option value="Donations">Charitable Donation Receipts</option>
                  <option value="Childcare">Childcare Receipts (Daycare / Babysitter)</option>
                  <option value="Tuition">Tuition Receipts / Student Fees</option>
                  <option value="Moving">Moving Expense Receipts</option>
                  <option value="HomeOffice">Home Office Expenses</option>
                  <option value="Union">Union / Professional Dues</option>
                  <option value="Tools">Tradesperson&apos;s Tools</option>
                </optgroup>
                <optgroup label="── Self-Employment &amp; Business ──">
                  <option value="BusinessIncome">Business / Self-Employment Income Statement</option>
                  <option value="BusinessExpenses">Business Expense Receipts</option>
                  <option value="T2125">T2125 – Business &amp; Professional Activities</option>
                  <option value="T2042">T2042 – Farming Income</option>
                  <option value="GST_HST">GST / HST / QST Return</option>
                </optgroup>
                <optgroup label="── Rental &amp; Capital Gains ──">
                  <option value="RentalIncome">Rental Income / Expense Summary</option>
                  <option value="T776">T776 – Statement of Real Estate Rentals</option>
                  <option value="CapitalGains">Capital Gains / Losses Statement</option>
                  <option value="ACB">Adjusted Cost Base (ACB) Report</option>
                </optgroup>
                <optgroup label="── Other ──">
                  <option value="ForeignIncome">Foreign Income / Assets (T1135)</option>
                  <option value="SocialAssistance">Social Assistance / Welfare Statement</option>
                  <option value="WorkersComp">Workers&apos; Compensation Statement</option>
                  <option value="DisabilityTaxCredit">Disability Tax Credit Certificate (T2201)</option>
                  <option value="ID">Government ID / SIN Card</option>
                  <option value="Other">Other Document</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select File</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-lg"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>

        {completeness && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Tax Return Status</h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Completeness</span>
                <span className="text-blue-600 font-bold">{completeness.completenessScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${completeness.completenessScore}%` }}
                ></div>
              </div>
            </div>

            {completeness.documents && completeness.documents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Uploaded Documents ({completeness.documents.length})</h3>
                <ul className="space-y-2">
                  {completeness.documents.map((doc: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm">{doc.docType} - {doc.filename}</span>
                      <span className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
