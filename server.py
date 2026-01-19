import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=api_key)
    print("📋 Checking available models...")
    try:
        with open("models_debug.txt", "w") as f:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(f"{m.name}\n")
                    print(f"  - {m.name}")
    except Exception as e:
        print(f"❌ Error listing models: {e}")
        with open("models_debug.txt", "w") as f:
            f.write(f"Error: {str(e)}")

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

        # Initialize model
        # Using the aliased 'latest' version found in your authorized model list
        model = genai.GenerativeModel('gemini-flash-latest')

        # Prepare prompt
        prompt = f"This is an image containing text which may be in Kaithi or Urdu script (or a mix). First, identify which script it is. Then, transliterate it and translate the full content into {target_lang}. Format the output nicely."

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

        return jsonify({"text": response.text})

    except Exception as e:
        print(f"❌ Gemini Error: {str(e)}")
        return jsonify({"error": "Failed to process document", "details": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python Kaithi Converter Server starting on http://localhost:5000")
    app.run(port=5000, debug=True)
