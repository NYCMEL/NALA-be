const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const jsonData = JSON.parse(body);

                // Check for "action" and "id"
                if (jsonData.action && jsonData.id !== undefined) {
                    console.log(`Action received: ${jsonData.action}, ID: ${jsonData.id}`);

                    // Result JSON
                    const result = {
                        success: true,
                        receivedData: jsonData,
                        message: `Action '${jsonData.action}' processed successfully for ID ${jsonData.id}`
                    };

                    // Return original + result
                    const response = {
                        original: jsonData,
                        result: result
                    };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response, null, 2));
                } else {
                    // Missing action or id
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Missing action or id field' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
