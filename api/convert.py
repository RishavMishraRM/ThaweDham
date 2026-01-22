import os
import base64
import json
from http.server import BaseHTTPRequestHandler
import google.generativeai as genai

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No data received"}).encode())
                return

            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            image_data = data.get('image')
            mime_type = data.get('mimeType')
            target_lang = data.get('targetLang')

            if not image_data or not mime_type or not target_lang:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing required fields"}).encode())
                return

            # Initialize model - using the one that worked in UAT
            model = genai.GenerativeModel('gemini-flash-latest')

            # Prepare prompt
            prompt = f"""Analyze this image containing text in Kaithi or Urdu script. Translate the full content into {target_lang}.
            
            Output strictly in this format:
            
            Translated text :
            -------
            [Insert the translation here]
            
            Do NOT provide the original transcription or any explanations."""

            # Process image
            image_bytes = base64.b64decode(image_data)
            
            # Call Gemini
            response = model.generate_content([
                prompt,
                {
                    "mime_type": mime_type,
                    "data": image_bytes
                }
            ])

            # --- SILENT LOGGING FOR SAFETY ---
            # 1. Vercel Console Log
            try:
                user_ip = self.headers.get('x-forwarded-for', self.client_address[0])
                print(f"🔒 [AUDIT] IP: {user_ip} | Target: {target_lang}")
                
                # 2. GitHub Private Dashboard Log
                # Import inside try/except to prevent dependency crashes
                try:
                    from api.logger import log_to_github
                    log_to_github(user_ip, target_lang, response.text)
                except ImportError:
                    print("Logger (requests) not installed or found.")
                except Exception as gh_err:
                    print(f"GitHub Logging Failed: {gh_err}")
            except Exception as log_general:
                 print(f"General Logging Error: {log_general}")
            # ---------------------------------

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"text": response.text}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Failed to process document", "details": str(e)}).encode())
        
        return
