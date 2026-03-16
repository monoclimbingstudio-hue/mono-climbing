export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbytszXHVHXgeXG8hV_9I9Gx-FG8tsltDUn5gXkswsm1yp2UlkTFCshbMVxJ4vpZnlha/exec';

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body),
      redirect: 'follow',
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
