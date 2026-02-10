const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class APIClient {
  private static getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  }

  // Tax Years
  static async getTaxYears() {
    const res = await fetch(`${API_URL}/client/tax-years`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch tax years');
    return res.json();
  }

  // Documents
  static async uploadDocument(year: number, file: File, docType: string, docSubtype?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    if (docSubtype) formData.append('docSubtype', docSubtype);

    const res = await fetch(`${API_URL}/client/tax-years/${year}/documents`, {
      method: 'POST',
      headers: { 'Authorization': this.getAuthHeaders()['Authorization'] },
      body: formData
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  static async getDocuments(year: number) {
    const res = await fetch(`${API_URL}/client/tax-years/${year}/documents`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  }

  static async deleteDocument(docId: string) {
    const res = await fetch(`${API_URL}/client/documents/${docId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  }

  static async getDownloadUrl(docId: string) {
    const res = await fetch(`${API_URL}/client/documents/${docId}/download`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to get download URL');
    return res.json();
  }

  // Validation
  static async getCompleteness(year: number) {
    const res = await fetch(`${API_URL}/client/tax-years/${year}/completeness`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch completeness');
    return res.json();
  }

  static async updateProfile(year: number, profile: any) {
    const res = await fetch(`${API_URL}/client/tax-years/${year}/update-profile`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Profile update failed');
    return res.json();
  }
}
