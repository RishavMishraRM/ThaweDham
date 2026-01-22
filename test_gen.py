import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

model_name = 'gemini-2.5-flash' # From the list!
print(f"Testing {model_name}...")
try:
    response = client.models.generate_content(
        model=model_name,
        contents="Say hello"
    )
    print(f"SUCCESS with {model_name}!")
    print(response.text)
except Exception as e:
    print(f"FAILED {model_name}: {e}")
