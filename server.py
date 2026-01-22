import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
# New SDK Import
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/convert', methods=['POST'])
def convert_kaithi():
    print("📨 Request received at /api/convert")
    try:
        data = request.json
        image_data = data.get('image')
        mime_type = data.get('mimeType')
        target_lang = data.get('targetLang')
        
        print(f"   - Target Lang: {target_lang}")
        print(f"   - Mime Type: {mime_type}")

        if not image_data or not mime_type or not target_lang:
            return jsonify({"error": "Missing required fields"}), 400

        # Initialize Client (New SDK)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
             return jsonify({"error": "No API Key found"}), 500
        
        client = genai.Client(api_key=api_key)

        # Prepare prompt
        prompt_text = f"""Analyze this image containing text in Kaithi or Urdu script. Translate the full content into {target_lang}.
        
        Output strictly in this format:
        
        Translated text :
        -------
        [Insert the translation here]
        
        Do NOT provide the original transcription or any explanations."""

        # Process image
        image_bytes = base64.b64decode(image_data)
        
        # Call Gemini (New SDK Pattern)
        # Using 2.5 Flash as it is confirmed working for this key
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=[
                prompt_text,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ]
        )

        # --- LOGGING ---
        try:
            from api.logger import log_to_github
            # Get IP (local dev usually 127.0.0.1)
            user_ip = request.remote_addr
            print(f"🔒 Logging to GitHub for IP: {user_ip}")
            log_to_github(user_ip, target_lang, response.text)
        except Exception as log_ex:
            print(f"❌ Logger failed: {log_ex}")
        # ---------------

        return jsonify({"text": response.text})

    except Exception as e:
        print(f"❌ Gemini Error: {str(e)}")
        return jsonify({"error": "Failed to process document", "details": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python Kaithi Converter Server starting on http://localhost:5000")
    app.run(port=5000, debug=True)
