import { useState, useEffect, ChangeEvent } from 'react';
import { api } from '../lib/api';
import { User, Document } from '../types';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  User as UserIcon, 
  LogOut,
  Clock,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const fetchDocs = async () => {
    try {
      const data = await api.getDocuments();
      setDocs(data);
    } catch (err: any) {
      console.error(err);
      // You could set an error state here to show a toast or message in the UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('uploading');
    try {
      await api.uploadDocument(file);
      setUploadProgress('success');
      fetchDocs();
      setTimeout(() => setUploadProgress('idle'), 3000);
    } catch (err) {
      console.error(err);
      setUploadProgress('error');
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066CC] rounded-lg flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Portal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold mb-1">
              {user.role === 'staff' ? 'Client Documents' : 'My Documents'}
            </h2>
            <p className="text-gray-500">
              Manage and track secure document submissions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {user.role === 'client' && (
              <label className="btn-primary cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </header>

        {/* Upload Status Alert */}
        <AnimatePresence>
          {uploadProgress !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                uploadProgress === 'uploading' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                uploadProgress === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
                'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {uploadProgress === 'uploading' && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />}
              {uploadProgress === 'success' && <CheckCircle2 className="w-5 h-5" />}
              <span>
                {uploadProgress === 'uploading' && 'Uploading document...'}
                {uploadProgress === 'success' && 'Document uploaded successfully!'}
                {uploadProgress === 'error' && 'Failed to upload document. Please try again.'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium text-sm">Total Files</span>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold">{docs.length}</div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium text-sm">Last Upload</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold">
              {docs.length > 0 ? format(new Date(docs[0].upload_date), 'MMM d') : '--'}
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium text-sm">Storage Used</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold">
              {(docs.reduce((acc, doc) => acc + doc.size, 0) / (1024 * 1024)).toFixed(1)} MB
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Document Name</th>
                  {user.role === 'staff' && (
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Client</th>
                  )}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 border-l border-gray-200/50">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Size</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={user.role === 'staff' ? 5 : 4} className="px-6 py-8">
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={user.role === 'staff' ? 5 : 4} className="px-6 py-12 text-center text-gray-500 italic">
                      No documents found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-sm">{doc.original_name}</div>
                            <div className="text-xs text-gray-400 font-mono">{doc.filename.slice(0, 10)}...</div>
                          </div>
                        </div>
                      </td>
                      {user.role === 'staff' && (
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">{doc.client_name}</div>
                          <div className="text-xs text-gray-500">{doc.client_email}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-600 border-l border-gray-200/20">
                        {format(new Date(doc.upload_date), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {(doc.size / 1024).toFixed(0)} KB
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => api.downloadDocument(doc.filename, doc.original_name)}
                          className="p-2 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent rounded-lg text-gray-600 transition-all inline-flex items-center gap-1 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden md:inline">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
