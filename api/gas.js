module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // v68 fresh deploy (paymentDate / ADJUST_NOTE / inventory filter)
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxPm_KFAIdj-qWTsZfto-oQd1sE6wM2z5k9D1j194IpzPDhFAdHrVjirNzfZo9BRru9/exec';

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body),
      redirect: 'follow',
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // GAS が HTML（エラーページなど）を返してきた場合、フロント側の JSON.parse で
    // "Unexpected token '<'" になってしまう。text を検証し、JSON でなければ
    // エラー構造を包んで返すことでフロント側を常に同じ形で扱えるようにする。
    const trimmed = (text || '').trim();
    const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[');
    if (!looksJson) {
      return res.status(200).send(JSON.stringify({
        ok: false,
        error: 'GAS_HTML_RESPONSE',
        data: {
          error: 'Apps Script からの応答が JSON ではありません。スプレッドシート側の処理でエラーが発生している可能性があります。',
          raw: trimmed.slice(0, 300)
        }
      }));
    }

    // JSON っぽいがパースに失敗するケースも保護
    try {
      JSON.parse(trimmed);
    } catch (_e) {
      return res.status(200).send(JSON.stringify({
        ok: false,
        error: 'GAS_BAD_JSON',
        data: {
          error: 'Apps Script からの応答を JSON としてパースできませんでした。',
          raw: trimmed.slice(0, 300)
        }
      }));
    }

    res.status(200).send(text);
  } catch (e) {
    res.status(200).send(JSON.stringify({ ok: false, error: e.message, data: { error: e.message } }));
  }
};
