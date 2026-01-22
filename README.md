# 🕉️ Thawe Dham - Kaithi & Urdu Script Converter

Welcome to the **Thawe Dham** project repository! This project serves as a digital shrine for Maa Thawe Wali and features a cutting-edge AI-powered tool to translate ancient **Kaithi** and **Urdu** scripts into modern languages (Hindi/English).

## 🌟 Project Overview

This application bridges faith and technology. It provides a serene, interactive user interface for devotees while offering researchers and historians a powerful tool to decode scanned documents using the **Google Gemini Pro Vision (v2.5)** AI model.

### Key Features

*   **Multilingual Support**: Fully operational in **English** and **Hindi**.
*   **Kaithi/Urdu Converter**: Upload an image of any handwritten script, and our AI will translate it instantly.
*   **Interactive Shrine**: Ring the virtual bell 🔔 and light a Diya 🪔 for a spiritual experience.
*   **Secure Audit Logging**: All conversion activities are monitored silently via a private GitHub Dashboard.
*   **Responsive Design**: A premium, "Glassmorphism" UI that works perfectly on mobile and desktop.
*   **Themes**: Toggle between Light (Day) and Dark (Night) modes.

---

## 🛠️ Tech Stack

*   **Frontend**: HTML5, Vanilla CSS3 (Custom Variables & Animations), JavaScript (ES6+).
*   **Animations**: GSAP (GreenSock Animation Platform) for smooth scrolling and interactions.
*   **Backend (Production)**: Vercel Serverless Functions (`api/convert.py`) running Python 3.9+.
*   **Backend (Local)**: Flask (`server.py`) for easy local development.
*   **AI Engine**: Google GenAI SDK (`google-genai`) utilizing the `gemini-2.5-flash` model.
*   **Logging**: GitHub REST API used to log usage stats to a private Issue.

---

## 📂 File Structure & Details

Here is a detailed breakdown of every file in this repository:

```text
ThaweDham/
│
├── api/
│   ├── convert.py       # [PRODUCTION] Vercel Serverless Function. Handles the API request, 
│   │                    # initializes Gemini AI, processes the image, and triggers logging.
│   └── logger.py        # [HELPER] Contains the logic to send secure audit logs to GitHub Issues.
│                        # It's imported by convert.py.
│
├── index.html           # [FRONTEND] The main structure of the website. Contains the Shrine, 
│                        # Photo Gallery, Story Section, and the Kaithi Converter UI.
│
├── style.css            # [STYLING] The complete design system. Includes CSS variables for themes,
│                        # responsive grid layouts, and complex keyframe animations.
│
├── script.js            # [LOGIC] Handles all client-side interactions:
│                        # - Theme/Language toggles
│                        # - Bell/Diya animations (GSAP)
│                        # - File Drag & Drop
│                        # - Fetching the Python API and displaying results type-writer style.
│
├── server.py            # [LOCAL] A Flask server that mimics the Vercel environment.
│                        # Used for testing the Python logic on your own machine without deploying.
│
├── requirements.txt     # [DEPENDENCIES] List of Python libraries required by Vercel 
│                        # (flask, google-genai, requests, etc.).
│
├── vercel.json          # [CONFIG] Vercel project configuration. 
│                        # Specific settings like increasing function timeouts to 60 seconds.
│
└── .env                 # [SECRET] (Not committed) Stores API Keys for Gemini and GitHub.
```

---

## 🚀 How to Run Locally

If you want to contribute or test features on your own machine:

### 1. Prerequisites
*   Install **Python 3.10+**
*   Install **Node.js** (for Vercel CLI, optional)
*   A Google Cloud API Key for **Gemini**.
*   A GitHub Personal Access Token (for logging).

### 2. Installation
Clone the repo and install Python dependencies:
```bash
git clone https://github.com/YourUsername/ThaweDham.git
cd ThaweDham
pip install -r requirements.txt
```

### 3. Environment Variables
Create a file named `.env` in the root folder and add your keys:
```env
GEMINI_API_KEY=your_google_api_key_here
GITHUB_TOKEN=your_github_pat_here
GITHUB_REPO=YourUsername/ThaweDham
GITHUB_ISSUE_NO=1
```

### 4. Start the Server
Run the Flask server:
```bash
python server.py
```
The API will be live at `http://localhost:5000`.

### 5. Start the Frontend
You can use Vercel Dev or simply open `index.html` (though API calls require a local web server).
```bash
npx vercel dev
```
Open `http://localhost:3000`.

---

## ☁️ Deployment

This project is optimized for **Vercel**.

1.  Connect your GitHub repository to Vercel.
2.  In Vercel **Settings > Environment Variables**, add the secrets from your `.env` file.
3.  Deploy! Vercel will automatically detect the `api/` folder and set up the Python Serverless Functions.

---

## 🛡️ License

Designed with devotion. © 2026 Thawe Dham.
All rights reserved.
