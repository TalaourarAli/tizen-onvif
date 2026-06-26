const http = require('http');
const url = require('url');

// Crée un mini serveur local pour communiquer avec ton interface HTML
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/get-stream') {
        const query = parsedUrl.query;
        const ip = query.ip !== undefined ? query.ip : '192.168.10.103';
        const port = query.port !== undefined ? query.port : '554';
        const user = query.user !== undefined ? query.user : 'admin';
        const pass = query.pass !== undefined ? query.pass : 'password';
        const path = query.path !== undefined ? query.path : 'cam/realmonitor?channel=1&subtype=0';

        // Nettoyer les espaces indésirables dans les paramètres
        let cleanIp = ip.trim().replace(/\s+/g, '');
        let cleanPort = port.trim().replace(/\s+/g, '');
        let cleanPath = path.trim().replace(/\s+/g, '');
        const cleanUser = user.trim();
        const cleanPass = pass.trim();

        // Si le chemin (path) ou l'IP est une URL complète, on extrait les informations
        if (cleanPath.includes('://')) {
            try {
                const parsedPathUrl = url.parse(cleanPath, true);
                if (parsedPathUrl.hostname) {
                    cleanIp = parsedPathUrl.hostname;
                }
                if (parsedPathUrl.port) {
                    cleanPort = parsedPathUrl.port;
                }
                cleanPath = (parsedPathUrl.pathname || '') + (parsedPathUrl.search || '');
            } catch (e) {
                // En cas d'erreur de parsing, on garde le path d'origine nettoyé
            }
        } else if (cleanIp.includes('://')) {
            try {
                const parsedIpUrl = url.parse(cleanIp, true);
                if (parsedIpUrl.hostname) {
                    cleanIp = parsedIpUrl.hostname;
                }
                if (parsedIpUrl.port) {
                    cleanPort = parsedIpUrl.port;
                }
            } catch (e) {
                // En cas d'erreur, on garde l'IP d'origine nettoyée
            }
        }

        // Si l'IP contient toujours un port (ex: 192.168.10.103:554)
        if (cleanIp.includes(':')) {
            const parts = cleanIp.split(':');
            cleanIp = parts[0];
            if (!cleanPort) {
                cleanPort = parts[1];
            }
        }

        // Éviter les doubles slashes (ex: si le chemin commence par /)
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        // Si aucun port n'est spécifié, ne pas ajouter de double point
        const portSuffix = cleanPort ? `:${cleanPort}` : '';

        // Construction dynamique du flux RTSP (avec ou sans authentification)
        let authPrefix = '';
        if (cleanUser || cleanPass) {
            authPrefix = `${cleanUser}:${cleanPass}@`;
        }
        const streamUrl = `rtsp://${authPrefix}${cleanIp}${portSuffix}/${cleanPath}`;

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