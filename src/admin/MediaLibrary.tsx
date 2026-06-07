import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, CheckCircle, Search, Film } from 'lucide-react';
import { useApi } from './useApi';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  isResume: boolean;
}

export default function MediaLibrary() {
  const api = useApi();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await api.get(`/api/upload/library?t=${Date.now()}`);
      setFiles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    try {
      // If single file, we can use the existing /api/upload endpoint, or we can use /multiple if needed.
      // Since we just want simple upload, let's use the single file logic but loop if multiple selected.
      const uploadPromises = Array.from(e.target.files as FileList).map((file: File) => api.upload(file));
      await Promise.all(uploadPromises);
      await fetchLibrary(); // Refresh after upload
    } catch (err) {
      console.error('Upload failed', err);
      alert('حدث خطأ أثناء الرفع. قد يكون حجم الملف كبيراً جداً.');
    } finally {
      setUploading(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف نهائياً؟ قد يؤدي هذا لكسر الصور في الموقع إذا كانت مستخدمة.')) return;
    
    try {
      await api.del(`/api/upload/${filename}`);
      await fetchLibrary(); // Refresh
    } catch (err) {
      console.error('Delete failed', err);
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg|ico|jfif|pjpeg|pjp)$/i.test(filename);
  };

  const isVideo = (filename: string) => {
    return /\.(mp4|webm)$/i.test(filename);
  };

  const filteredFiles = files.filter(f => 
    f.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">مكتبة الوسائط (Media Library)</h1>
          <p className="text-slate-500 mt-1">إدارة جميع الصور والملفات المرفوعة على سيرفر الموقع من مكان واحد.</p>
        </div>
        <label className={`flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-400'}`}>
          <Upload className="w-5 h-5" /> {uploading ? 'جاري الرفع...' : 'رفع ملفات جديدة'}
          <input type="file" multiple accept="image/*,video/mp4,video/webm,.pdf,.doc,.docx" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن ملف باسمه..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-11 pl-4 py-2.5 outline-none focus:border-amber-500"
              dir="rtl"
            />
          </div>
          <div className="text-slate-500 text-sm font-bold">
            إجمالي الملفات: {filteredFiles.length}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold">جاري تحميل المكتبة...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold">لا توجد ملفات.</div>
        ) : (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.filename} className="group border border-slate-200 rounded-xl overflow-hidden hover:border-amber-500 transition-colors bg-slate-50 flex flex-col relative">
                
                {/* Thumbnail Area */}
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-slate-200">
                  {isImage(file.filename) ? (
                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" loading="lazy" />
                  ) : isVideo(file.filename) ? (
                    <div className="flex flex-col items-center text-slate-400">
                      <Film className="w-10 h-10 mb-2" />
                      <span className="text-xs font-bold">Video</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FileText className="w-10 h-10 mb-2" />
                      <span className="text-xs font-bold">Document</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button 
                      onClick={() => copyToClipboard(file.url)}
                      className="p-2 bg-white text-slate-900 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
                      title="نسخ الرابط"
                    >
                      {copiedUrl === file.url ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(file.filename)}
                      className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                      title="حذف الملف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3 text-left" dir="ltr">
                  <p className="text-xs font-bold text-slate-900 truncate mb-1" title={file.filename}>
                    {file.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{formatSize(file.size)}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
