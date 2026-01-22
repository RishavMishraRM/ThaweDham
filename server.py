import os  # Standard library for OS-level operations
import base64  # Library to handle Base64 encoding/decoding of images
from flask import Flask, request, jsonify  # Flask framework for creating the web server
from flask_cors import CORS  # Extension for handling Cross-Origin Resource Sharing (CORS)
# New Google Generative AI SDK Imports
from google import genai
from google.genai import types
from dotenv import load_dotenv  # Library to load environment variables from .env file

# Load environment variables from .env file (e.g., API Keys)
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS for all routes (allows frontend to talk to this backend locally)
CORS(app)

@app.route('/api/convert', methods=['POST'])
def convert_kaithi():
    """
    Main API Endpoint: /api/convert
    Accepts POST requests with an image and target language.
    Returns the translated text from Gemini AI.
    """
    print("📨 Request received at /api/convert")
    try:
        # Get JSON data from the incoming request body
        data = request.json
        # Extract fields
        image_data = data.get('image')      # Base64 image string
        mime_type = data.get('mimeType')    # Image type (e.g., 'image/png')
        target_lang = data.get('targetLang') # Target language string
        
        # Log basic info for debugging
        print(f"   - Target Lang: {target_lang}")
        print(f"   - Mime Type: {mime_type}")

        # Basic Validation: Ensure all fields are present
        if not image_data or not mime_type or not target_lang:
            return jsonify({"error": "Missing required fields"}), 400

        # Initialize the AI Client
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
             # Return error if API key is missing
             return jsonify({"error": "No API Key found"}), 500
        
        # Create client instance with the key
        client = genai.Client(api_key=api_key)

        # Construct the detailed prompt for the AI
        prompt_text = f"""Analyze this image containing text in Kaithi or Urdu script. Translate the full content into {target_lang}.
        
        Output strictly in this format:
        
        Translated text :
        -------
        [Insert the translation here]
        
        Do NOT provide the original transcription or any explanations."""

        # Decode the image data from Base64
        image_bytes = base64.b64decode(image_data)
        
        # Call the Gemini Model (using the confirmed working model 'gemini-2.5-flash')
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=[
                prompt_text,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ]
        )

        # --- LOGGING ---
        # Attempt to log this transaction to GitHub (Internal Audit)
        try:
            from api.logger import log_to_github
            # In local dev, IP is usually the localhost
            user_ip = request.remote_addr
            print(f"🔒 Logging to GitHub for IP: {user_ip}")
            log_to_github(user_ip, target_lang, response.text)
        except Exception as log_ex:
            # If logging fails, print error but do NOT stop the conversion
            print(f"❌ Logger failed: {log_ex}")
        # ---------------

        # Return the AI's response text as JSON
        return jsonify({"text": response.text})

    except Exception as e:
        # Catch any unexpected server errors
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Failed to process document", "details": str(e)}), 500

# Entry point: Run the server if executed directly
if __name__ == '__main__':
    print("🚀 Python Kaithi Converter Server starting on http://localhost:5000")
    # Run in debug mode for auto-reloading during development
    app.run(port=5000, debug=True)
