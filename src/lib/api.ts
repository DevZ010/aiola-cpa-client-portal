const API_BASE = '/api';

export const api = {
  getHeaders: () => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },

  async register(email: string, password: string, name: string, role: string = 'client') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }
    return res.json();
  },

  async getDocuments() {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || error.error || 'Failed to fetch documents');
      }
      return res.json();
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        throw new Error('Cannot connect to backend. Is the Python server running on port 8000?');
      }
      throw err;
    }
  },

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Upload failed');
    }
    return res.json();
  },

  async downloadDocument(filename: string, originalName: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/documents/download/${filename}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error('Download failed');
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
};
