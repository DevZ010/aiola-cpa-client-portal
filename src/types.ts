export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'staff';
}

export interface Document {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  upload_date: string;
  user_id: number;
  status: string;
  client_name?: string;
  client_email?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
