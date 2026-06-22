const http = require('http');
// Astuce : Tu peux embarquer une lib onvif light ou faire des requêtes fetch SOAP directement vers ta caméra

// Crée un mini serveur local pour communiquer avec ton interface HTML
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/get-stream') {
        // Logique ONVIF pour récupérer le profil de la caméra et l'URL du flux
        // Exemple de réponse :
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            streamUrl: "rtsp://admin:password@1192.168.1.50:554/stream1" 
        }));
    }
});

server.listen(4545, '127.0.0.1', () => {
    console.log('Service ONVIF démarré sur le port 4545');
});