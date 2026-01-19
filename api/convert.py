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
            prompt = f"This is an image containing text in Kaithi script. Please transliterate it and then translate it into {target_lang}. Format the output nicely. If the content is a legal record or land record (common for Kaithi), explain the key details."

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
