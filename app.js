// api/app.js

const { createServer } = require('http');
const { parse } = require('url');
const { spawn } = require('child_process');

createServer((req, res) => {
    const { pathname } = parse(req.url);

    if (req.method === 'POST' && pathname === '/submit') {
        // Handle form submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            // Process the form data
            const formData = new URLSearchParams(body);
            const notARobot = formData.get('not_a_robot');

            if (notARobot === 'on') {
                // Checkbox is checked
                // Example: Spawn a Python script
                const python = spawn('python', ['script.py']);
                python.on('close', (code) => {
                    console.log(`Child process closed with code ${code}`);
                });

                // Redirect to sabar24.vercel.app after processing
                res.writeHead(302, { 'Location': 'https://sabar24.vercel.app' });
                res.end();
            } else {
                // Checkbox is not checked
                res.writeHead(400);
                res.end('Checkbox not checked');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
}).listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});