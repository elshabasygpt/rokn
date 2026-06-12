import app from '../server/index';

export default async function(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({ error: 'EXPRESS_CRASH: ' + err.message });
  }
}
