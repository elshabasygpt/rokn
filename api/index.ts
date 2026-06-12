import app from '../server/index';

export default function(req: any, res: any) {
  if (req.url === '/api/test' || req.url === '/test') {
    return res.status(200).json({ ok: true, message: 'Vercel is executing api/index.ts successfully!' });
  }

  try {
    return app(req, res);
  } catch (err: any) {
    console.error('CRITICAL VERCEL ERROR:', err);
    return res.status(500).json({ error: 'CRITICAL VERCEL ERROR: ' + err.message });
  }
}
