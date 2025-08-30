file struct backend


vulnscanner/
│── app.py                 # Flask API entry point
│── scanners/
│   ├── port_scanner.py    # Port scanning
│   ├── xss_scanner.py     # XSS detection
│   ├── sqli_scanner.py    # SQLi detection
│   ├── cmd_injection.py   # Command injection
│   ├── csrf_scanner.py    # CSRF detection
│   ├── ssl_scanner.py     # SSL/TLS check
│   └── __init__.py        # makes it a package
