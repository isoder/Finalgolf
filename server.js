const http = require('http');
const fs = require('fs');
const path = require('path');

// A2 Hosting fournit le port via l'environnement, sinon 3000 par défaut
const port = process.env.PORT || 3000;

// Chemin vers le dossier contenant le site construit (npm run build)
const distPath = path.join(__dirname, 'dist');

// Types MIME pour que le navigateur comprenne les fichiers (CSS, JS, Images...)
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Sécuriser et nettoyer le chemin demandé
  const safeUrl = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(distPath, safeUrl);
  
  // Obtenir l'extension du fichier
  let extname = path.extname(filePath);

  // Vérifier si le fichier existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si le fichier n'existe pas (ex: rechargement d'une page SPA),
      // on vérifie si c'est une requête pour une ressource statique (.js, .css)
      // Si c'est une ressource statique manquante -> 404
      if (extname) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      // Sinon (navigation React), on renvoie index.html
      filePath = path.join(distPath, 'index.html');
      extname = '.html';
    }

    // Lire et envoyer le fichier
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      } else {
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Serveur Node.js natif démarré sur le port ${port}`);
});