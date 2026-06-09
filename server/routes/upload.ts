import { Router, Request, Response } from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { authMiddleware } from '../middleware/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '../../public/uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const docStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '../../public/uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume_${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|gif|webp|svg/;
    const extName = path.extname(file.originalname).toLowerCase();
    const ext = allowedExts.test(extName) || extName === ''; // allow if no extension
    const mime = file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream';
    if (ext && mime) cb(null, true);
    else cb(new Error(`Only images are allowed. Received: ${file.originalname} (${file.mimetype})`));
  }
});

const uploadDoc = multer({
  storage: docStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for resumes
  fileFilter: (_req, file, cb) => {
    const allowedExts = /pdf|doc|docx/;
    const extName = path.extname(file.originalname).toLowerCase();
    if (allowedExts.test(extName)) cb(null, true);
    else cb(new Error(`Only PDF, DOC, and DOCX are allowed.`));
  }
});

const router = Router();

// POST /api/upload (admin)
router.post('/', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  return res.json({ url, filename: req.file.filename });
});

// POST /api/upload/resume (public)
router.post('/resume', uploadDoc.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  return res.json({ url, filename: req.file.filename });
});

// POST /api/upload/multiple (admin)
router.post('/multiple', authMiddleware, (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const urls = files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename }));
  return res.json(urls);
});

// GET /api/upload/library (admin)
router.get('/library', authMiddleware, async (req: Request, res: Response) => {
  try {
    const uploadsDir = path.resolve(__dirname, '../../public/uploads');
    const files = await fs.readdir(uploadsDir);
    
    const mediaFiles = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stats = await fs.stat(filePath);
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime || stats.mtime,
          isResume: filename.startsWith('resume_'),
        };
      })
    );
    
    // Sort by newest first
    mediaFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return res.json(mediaFiles);
  } catch (err) {
    console.error('Error reading media library:', err);
    return res.status(500).json({ error: 'Failed to read media library' });
  }
});

// DELETE /api/upload/:filename (admin)
router.delete('/:filename', authMiddleware, async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    // Basic security check to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filePath = path.resolve(__dirname, '../../public/uploads', filename);
    await fs.unlink(filePath);
    return res.json({ success: true, message: 'File deleted' });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'File not found' });
    }
    console.error('Error deleting file:', err);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
