import os  # To access environment variables
import base64  # To decode the base64 image data from the frontend
import json  # To handle JSON input and output
from http.server import BaseHTTPRequestHandler  # Vercel's standard Python handler
from google import genai  # The official Google Gemini AI SDK
from google.genai import types  # Types for the SDK parts

class handler(BaseHTTPRequestHandler):
    """
    Serverless function handler for Vercel.
    Each request creates a new instance of this class.
    """
    def do_POST(self):
        """
        Handle HTTP POST requests.
        Triggered when the frontend sends an image for conversion.
        """
        try:
            # 1. Parse the Request Body
            # Get the size of the incoming data
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Check if body is empty
            if content_length == 0:
                self.send_response(400) # Bad Request
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No data received"}).encode())
                return

            # Read the bytes from the request
            body = self.rfile.read(content_length)
            # Parse bytes into a Python dictionary
            data = json.loads(body)
            
            # Extract fields from the payload
            image_data = data.get('image')      # The Base64 string of the image
            mime_type = data.get('mimeType')    # e.g., "image/png"
            target_lang = data.get('targetLang') # e.g., "Hindi", "English"

            # Validate required fields
            if not image_data or not mime_type or not target_lang:
                self.send_response(400) # Bad Request
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing required fields"}).encode())
                return

            # 2. Configure Google Gemini AI
            # Retrieve API Key from environment variables (set in Vercel settings)
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                 # Critical error if key is missing
                 raise ValueError("GEMINI_API_KEY not found")
            
            # Initialize the Gemini Client with the API key
            client = genai.Client(api_key=api_key)

            # 3. Construct the AI Prompt
            # Explicit instruction to the AI model
            prompt_text = f"""Analyze this image containing text in Kaithi or Urdu script. Translate the full content into {target_lang}.
            
            Output strictly in this format:
            
            Translated text :
            -------
            [Insert the translation here]
            
            Do NOT provide the original transcription or any explanations."""

            # 4. Prepare the Image
            # Decode the base64 string back into raw bytes for Gemini
            image_bytes = base64.b64decode(image_data)
            
            # 5. Call Gemini API
            # Use 'gemini-2.5-flash' model (Latest, fast, and cost-effective)
            response = client.models.generate_content(
                model='gemini-2.5-flash', 
                contents=[
                    prompt_text,
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
                ]
            )

            # 6. Silent Logging (Audit Trail)
            # This block is wrapped in try/except so it NEVER crashes the user experience
            try:
                # Get User IP address (from Vercel headers)
                user_ip = self.headers.get('x-forwarded-for', self.client_address[0])
                # Print to Vercel Runtime Logs
                print(f"🔒 [AUDIT] IP: {user_ip} | Target: {target_lang}")
                
                # Setup Private Dashboard Logging (GitHub Issues)
                try:
                    # Import logger module here 
                    from api.logger import log_to_github
                    # Send data to GitHub
                    log_to_github(user_ip, target_lang, response.text)
                except ImportError:
                    print("Logger module not found (local dev or missing requests).")
                except Exception as gh_err:
                    print(f"GitHub Logging Failed: {gh_err}")
            except Exception as log_general:
                 print(f"General Logging Error: {log_general}")

            # 7. Send Success Response
            self.send_response(200) # HTTP OK
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Send the AI's text response back to the frontend
            self.wfile.write(json.dumps({"text": response.text}).encode())

        except Exception as e:
            # 8. Global Error Handling
            # Catch unexpected crashes and return a proper JSON error
            self.send_response(500) # Internal Server Error
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Failed to process document", "details": str(e)}).encode())
        
        return
