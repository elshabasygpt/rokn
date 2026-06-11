import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';
import AdmZip from 'adm-zip';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// ⚠️ ALL tables in the database — order matters for foreign key safety
const ALL_TABLES = [
  'admin',
  'settings',
  'services',
  'gallery',
  'articles',
  'testimonials',
  'partners',
  'faqs',
  'cities',
  'industries',
  'case_studies',
  'redirects',
  'dynamic_pages',
  'jobs',
  'job_applications',
  'bookings',
  'lead_activities'
];

const uploadsPath = path.resolve(__dirname, '../../public/uploads');

// Helper: recursively delete directory contents
function clearDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

// Helper: reset PostgreSQL sequence for a table's id column
async function resetSequence(table: string) {
  try {
    await pool.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false)`);
  } catch {
    // Table might not have a serial id column (e.g., settings uses 'key')
  }
}

// ──────────────────────────────────────────────────────
// GET /api/backup/export — Full website backup (DB + all media)
// Supports both: Authorization header OR ?token= query param
// ──────────────────────────────────────────────────────
router.get('/export', (req, res, next) => {
  if (!req.headers.authorization && req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
}, authMiddleware, async (_req, res) => {
  try {
    // 1. Gather ALL database data
    const backupData: Record<string, any[]> = {};
    for (const table of ALL_TABLES) {
      try {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        backupData[table] = rows;
      } catch (tableErr) {
        console.warn(`⚠️ Table "${table}" skipped:`, tableErr);
        backupData[table] = [];
      }
    }

    // 2. Build metadata
    const fullBackup = {
      _meta: {
        timestamp: new Date().toISOString(),
        version: '4.0',
        appName: 'Rokn Elryan',
        type: 'full-disaster-recovery',
        tablesIncluded: Object.keys(backupData),
        tableRowCounts: Object.fromEntries(
          Object.entries(backupData).map(([k, v]) => [k, v.length])
        ),
        uploadsIncluded: fs.existsSync(uploadsPath),
      },
      data: backupData,
    };

    // 3. Create ZIP archive
    const zip = new AdmZip();
    zip.addFile('database.json', Buffer.from(JSON.stringify(fullBackup, null, 2), 'utf8'));

    // 4. Add ALL uploads (images/media) — recursively
    if (fs.existsSync(uploadsPath)) {
      const addFilesRecursively = (dir: string, zipDir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          const zipPath = `${zipDir}/${entry.name}`;
          if (entry.isDirectory()) {
            addFilesRecursively(fullPath, zipPath);
          } else {
            zip.addFile(zipPath, fs.readFileSync(fullPath));
          }
        }
      };
      addFilesRecursively(uploadsPath, 'uploads');
    }

    // 5. Add any other static assets from /public that are NOT in /uploads
    const publicPath = path.resolve(__dirname, '../../public');
    for (const entry of fs.readdirSync(publicPath, { withFileTypes: true })) {
      if (entry.name === 'uploads') continue; // Already handled above
      const fullPath = path.join(publicPath, entry.name);
      if (entry.isFile()) {
        zip.addFile(`public_assets/${entry.name}`, fs.readFileSync(fullPath));
      } else if (entry.isDirectory()) {
        // Recursively add public subdirectories (e.g., partners/)
        const addDir = (dir: string, zipDir: string) => {
          for (const sub of fs.readdirSync(dir, { withFileTypes: true })) {
            const fp = path.join(dir, sub.name);
            const zp = `${zipDir}/${sub.name}`;
            if (sub.isDirectory()) addDir(fp, zp);
            else zip.addFile(zp, fs.readFileSync(fp));
          }
        };
        addDir(fullPath, `public_assets/${entry.name}`);
      }
    }

    const zipBuffer = zip.toBuffer();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `Rokn Elryan_backup_${timestamp}.zip`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.status(200).end(zipBuffer);
  } catch (err) {
    console.error('❌ Backup export failed:', err);
    res.status(500).json({ error: 'Failed to create backup', details: String(err) });
  }
});

// ──────────────────────────────────────────────────────
// GET /api/backup/info — Backup stats (no download)
// ──────────────────────────────────────────────────────
router.get('/info', authMiddleware, async (_req, res) => {
  try {
    const tableStats: Record<string, number> = {};
    for (const table of ALL_TABLES) {
      try {
        const { rows } = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        tableStats[table] = parseInt(rows[0].count, 10);
      } catch { tableStats[table] = 0; }
    }

    let uploadsCount = 0;
    let uploadsSizeMB = 0;
    if (fs.existsSync(uploadsPath)) {
      const getStatsRecursively = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            getStatsRecursively(fullPath);
          } else {
            uploadsCount++;
            uploadsSizeMB += fs.statSync(fullPath).size;
          }
        }
      };
      getStatsRecursively(uploadsPath);
      uploadsSizeMB = Math.round(uploadsSizeMB / 1024 / 1024 * 100) / 100;
    }

    res.json({ tables: tableStats, uploads: { count: uploadsCount, sizeMB: uploadsSizeMB } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get backup info' });
  }
});

// ──────────────────────────────────────────────────────
// POST /api/backup/import — Full disaster recovery restore
// ──────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB
router.post('/import', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Parse ZIP
    let zip: AdmZip;
    try {
      zip = new AdmZip(req.file.buffer);
    } catch {
      return res.status(400).json({ error: 'Invalid ZIP file. The file appears corrupted.' });
    }

    // 2. Validate database.json
    const dbEntry = zip.getEntry('database.json');
    if (!dbEntry) {
      return res.status(400).json({ error: 'Invalid backup: database.json is missing.' });
    }

    let payload: any;
    try {
      payload = JSON.parse(dbEntry.getData().toString('utf8'));
    } catch {
      return res.status(400).json({ error: 'Invalid backup: database.json contains invalid JSON.' });
    }

    if (!payload?._meta || !payload?.data) {
      return res.status(400).json({ error: 'Invalid backup format: missing _meta or data.' });
    }

    const { data } = payload;

    // 3. Restore ALL database tables (including admin)
    const restoredTables: string[] = [];
    const skippedTables: string[] = [];

    for (const table of ALL_TABLES) {
      if (!data[table] || !Array.isArray(data[table])) {
        skippedTables.push(table);
        continue;
      }

      try {
        // Wipe current data
        await pool.query(`DELETE FROM ${table}`);

        // Insert restored data
        const rows = data[table];
        if (rows.length > 0) {
          const keys = Object.keys(rows[0]);
          for (const row of rows) {
            const vals = keys.map(k => {
              const v = row[k];
              if (v === null || v === undefined) return null;
              if (typeof v === 'object') return JSON.stringify(v);
              return v;
            });
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            try {
              await pool.query(
                `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
                vals
              );
            } catch (rowErr: any) {
              // Skip duplicate rows silently
              if (!rowErr.message?.includes('duplicate')) {
                console.error(`⚠️ Row insert error in ${table}:`, rowErr.message);
              }
            }
          }
        }

        // Reset PostgreSQL sequence to prevent ID conflicts on future inserts
        await resetSequence(table);

        restoredTables.push(table);
      } catch (tableErr) {
        console.error(`⚠️ Failed to restore table "${table}":`, tableErr);
        skippedTables.push(table);
      }
    }

    // 4. Restore uploads (images/media)
    let uploadedFilesCount = 0;
    try {
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
      } else {
        clearDirectory(uploadsPath);
      }

      const zipEntries = zip.getEntries();
      for (const entry of zipEntries) {
        if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
          const relativePath = entry.entryName.replace('uploads/', '');
          const targetPath = path.join(uploadsPath, relativePath);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.writeFileSync(targetPath, entry.getData());
          uploadedFilesCount++;
        }
      }
    } catch (uploadErr) {
      console.error('⚠️ Error restoring uploads:', uploadErr);
    }

    // 5. Restore public_assets if present (logo, partners, etc.)
    let publicAssetsCount = 0;
    try {
      const publicPath = path.resolve(__dirname, '../../public');
      const zipEntries = zip.getEntries();
      for (const entry of zipEntries) {
        if (entry.entryName.startsWith('public_assets/') && !entry.isDirectory) {
          // e.g., "public_assets/logo.png" → "public/logo.png"
          // e.g., "public_assets/partners/img.png" → "public/partners/img.png"
          const relativePath = entry.entryName.replace('public_assets/', '');
          const targetPath = path.join(publicPath, relativePath);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.writeFileSync(targetPath, entry.getData());
          publicAssetsCount++;
        }
      }
    } catch (assetErr) {
      console.error('⚠️ Error restoring public assets:', assetErr);
    }

    res.status(200).json({
      success: true,
      message: 'Full disaster recovery completed successfully!',
      details: {
        tablesRestored: restoredTables,
        tablesSkipped: skippedTables,
        filesRestored: uploadedFilesCount,
        publicAssetsRestored: publicAssetsCount,
      },
    });
  } catch (err: any) {
    console.error('❌ Backup import failed:', err);
    res.status(500).json({ error: 'Failed to restore backup', details: err.message });
  }
});

export default router;
