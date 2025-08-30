import socket

VULNERABLE_PORTS = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143,
                    389, 443, 445, 465, 587, 993, 995, 1433,
                    1521, 2049, 3306, 3389, 5432, 5900, 6379,
                    8080, 8443]

def scan_ports(ip):
    open_ports = []
    for port in VULNERABLE_PORTS:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        try:
            s.connect((ip, port))
            open_ports.append(port)
        except:
            pass
        finally:
            s.close()
    return open_ports
