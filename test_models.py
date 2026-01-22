import os
import sys
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

try:
    client = genai.Client(api_key=api_key)
    print("Listing models START")
    for m in client.models.list():
        # Clean the name (remove 'models/' prefix if present for clarity)
        name = m.name.replace('models/', '')
        print(f"FOUND: {name}")
    print("Listing models END")
except Exception as e:
    print(f"Error: {e}")
