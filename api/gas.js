module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzOvezI3qxbJBDEfwNdnFoLBHtuW8ejUNuyWQXOCLeE6DNvjOEVqxZ8dOxgmChw7zrw/exec';

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
};
