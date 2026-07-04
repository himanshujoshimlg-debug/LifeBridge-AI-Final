// Simple static file server for Capstone project
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.ico':  'image/x-icon'
};

const requestHandler = (req, res) => {
  // Resolve file path
  let filePath = path.join(__dirname, req.url);
  // Default to index.html
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, serve 404 page
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Capstone static server running at http://localhost:${PORT}`);
});
