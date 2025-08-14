async function generate() {
  const topic = document.getElementById('topic').value.trim();
  const keyPoints = document.getElementById('keyPoints').value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const out = document.getElementById('output');
  out.textContent = 'Generating...';

  try {
    const resp = await fetch('/api/press', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, keyPoints })
    });

    const data = await resp.json();
    if (!data.ok) throw new Error(data.error || 'Unknown error');
    out.textContent = data.content;
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  }
}

document.getElementById('generateBtn').addEventListener('click', generate);
