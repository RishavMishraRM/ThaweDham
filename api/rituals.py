from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Determine directory path
            # Vercel functions run in a specific way, usually root is accessible
            # We try to find 'Rituals and News' relative to current working dir
            
            base_dir = os.getcwd() # Usually project root
            target_dir = os.path.join(base_dir, 'Rituals and News')
            
            # If not found, try going up one level (sometimes api/ is working dir)
            if not os.path.exists(target_dir):
                target_dir = os.path.join(os.path.dirname(base_dir), 'Rituals and News')
                
            if not os.path.exists(target_dir):
                # Defines empty backup if folder keeps failing
                content = {"rituals": [], "news": []}
            else:
                files = [f for f in os.listdir(target_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
                content = {
                    "rituals": [],
                    "news": []
                }
                for file in files:
                    if file.lower().startswith('rituals'):
                        content['rituals'].append(file)
                    elif file.lower().startswith('news'):
                        content['news'].append(file)
                
                content['rituals'].sort()
                content['news'].sort()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(content).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
