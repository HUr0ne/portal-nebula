const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = __dirname;
const ignoredFiles = new Set([
    '.gitignore',
    '.nojekyll',
    'CNAME',
    'README.md',
    'package.json',
    'app.js',
]);

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
};

function resolveFilePath(requestUrl) {
    const urlPath = decodeURIComponent(requestUrl.split('?')[0]);
    const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
    const filePath = path.normalize(path.join(publicDir, requestedPath));
    const fileName = path.basename(filePath);

    if (!filePath.startsWith(publicDir) || ignoredFiles.has(fileName)) {
        return null;
    }

    return filePath;
}

const server = http.createServer((req, res) => {
    const filePath = resolveFilePath(req.url);

    if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(error.code === 'ENOENT' ? 404 : 500);
            res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': mimeTypes[extension] || 'application/octet-stream',
            'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000',
        });
        res.end(content);
    });
});

server.listen(port, () => {
    console.log(`Portal Nebula running on port ${port}`);
});
