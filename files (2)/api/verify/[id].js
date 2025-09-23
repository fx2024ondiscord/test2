export default async function handler(req, res) {
  const { id } = req.query;

  const apiToken = process.env.SHRTFLY_API_TOKEN;
  if (!apiToken) {
    res.status(500).send("Server misconfigured: SHRTFLY_API_TOKEN missing");
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>User Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 40px; }
    #status { font-size: 2em; margin: 2em 0; }
  </style>
</head>
<body>
  <div id="status">Verifying...</div>
  <script>
    // Shrtfly full-page script injection
    (function() {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://shrtfly.com/fullpage.js?api=${apiToken}';
      document.body.appendChild(s);
    })();

    // After page load, send POST to complete-task
    window.addEventListener('DOMContentLoaded', function() {
      fetch('/api/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: '${id}' })
      })
      .then(r => r.json())
      .then(() => {
        document.getElementById('status').textContent = "Complete!";
      })
      .catch(() => {
        document.getElementById('status').textContent = "Error!";
      });
    });
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}