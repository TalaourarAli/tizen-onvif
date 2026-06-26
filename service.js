const http = require('http');
const url = require('url');

// Crée un mini serveur local pour communiquer avec ton interface HTML
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/get-stream') {
        const query = parsedUrl.query;
        const ip = query.ip || '192.168.1.50';
        const port = query.port || '554';
        const user = query.user || 'admin';
        const pass = query.pass || 'password';
        const path = query.path || 'stream1';

        // Logique ONVIF dynamique ou construction directe du flux
        const streamUrl = `rtsp://${user}:${pass}@${ip}:${port}/${path}`;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ streamUrl }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(4545, '127.0.0.1', () => {
    console.log('Service ONVIF démarré sur le port 4545');
});