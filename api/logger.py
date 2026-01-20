import os
import requests
import json
from datetime import datetime

def log_to_github(ip, target_lang, content):
    token = os.getenv("GITHUB_TOKEN")
    repo = os.getenv("GITHUB_REPO") # e.g. "RishavMishraRM/ThaweDham"
    issue_number = os.getenv("GITHUB_ISSUE_NO") # The Issue ID to comment on

    if not token or not repo or not issue_number:
        print(f"⚠️ Logging skipped: Missing creds. Token: {bool(token)}, Repo: {repo}, Issue: {issue_number}")
        return

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Create the comment body (Markdown supported)
    body = f"""
### 🕵️ New Activity Detected
| Metric | Detail |
| :--- | :--- |
| **Time** | `{timestamp}` |
| **IP Address** | `{ip}` |
| **Target Lang** | `{target_lang}` |

**Converted Content:**
```text
{content}
```
    """

    url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        print(f"📡 Sending log to GitHub: {url}")
        resp = requests.post(url, headers=headers, json={"body": body})
        if resp.status_code == 201:
            print("✅ Logged to GitHub successfully")
        else:
            print(f"❌ GitHub API Error: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"❌ Failed to log to GitHub: {str(e)}")
