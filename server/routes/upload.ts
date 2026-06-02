import { Router, Request, Response } from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
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
    const allowedExts = /jpeg|jpg|png|gif|webp|svg|mp4|webm|ico|jfif|pjpeg|pjp/;
    const extName = path.extname(file.originalname).toLowerCase();
    const ext = allowedExts.test(extName) || extName === ''; // allow if no extension
    const mime = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream';
    if (ext && mime) cb(null, true);
    else cb(new Error(`Only images and videos are allowed. Received: ${file.originalname} (${file.mimetype})`));
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
router.post('/', authMiddleware, upload.single('file'), (req: Request, res: Response) => {
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
router.post('/multiple', authMiddleware, upload.array('files', 5), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const urls = files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename }));
  return res.json(urls);
});

export default router;
