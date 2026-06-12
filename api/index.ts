export default async function(req: any, res: any) {
  if (req.url === '/api/test' || req.url === '/test') {
    return res.status(200).json({ ok: true, message: 'Vercel is executing api/index.ts successfully!' });
  }

  try {
    // Dynamic import to catch any initialization errors
    const module = await import('../server/index');
    const app = module.default;
    return app(req, res);
  } catch (err: any) {
    console.error('CRITICAL VERCEL ERROR:', err);
    return res.status(500).json({ error: 'MODULE INIT ERROR: ' + err.message, stack: err.stack });
  }
}
