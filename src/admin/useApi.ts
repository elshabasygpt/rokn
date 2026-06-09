/// <reference types="vite/client" />
import { useAuth } from './context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export function useApi() {
  const { token } = useAuth();

  const headers = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const get = async (path: string) => {
    const res = await fetch(`${API}${path}`, { headers: headers() });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  };

  const post = async (path: string, body: any) => {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  };

  const put = async (path: string, body: any) => {
    const res = await fetch(`${API}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json();
  };

  const del = async (path: string) => {
    const res = await fetch(`${API}${path}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.json();
  };

  const upload = async (file: File): Promise<{ url: string }> => {
    // Attempt to compress image before uploading
    let fileToUpload = file;
    try {
      if (file.type.startsWith('image/')) {
        const { compressImage } = await import('../lib/imageCompression');
        fileToUpload = await compressImage(file, 1920, 0.95);
      }
    } catch (e) {
      console.warn('Image compression failed, uploading original', e);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    const res = await fetch(`${API}/api/upload`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل في رفع الملف');
    }
    return res.json();
  };

  return { get, post, put, del, upload };
}
