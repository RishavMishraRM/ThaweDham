import os  # To access environment variables like API keys
import requests  # To send HTTP POST requests to GitHub's API
import json  # To format data as JSON
from datetime import datetime  # To add timestamps to the logs

def log_to_github(ip, target_lang, content):
    """
    Logs the conversion activity to a private GitHub Issue as a comment.
    This acts as a secure, invisible dashboard for monitoring usage.
    """
    token = os.getenv("GITHUB_TOKEN")  # Get the GitHub Personal Access Token (PAT)
    repo = os.getenv("GITHUB_REPO")  # Get the repository name (e.g., "User/Repo")
    issue_number = os.getenv("GITHUB_ISSUE_NO")  # Get the specific Issue ID to post to

    # Check if any required credential is missing
    if not token or not repo or not issue_number:
        # Log a warning to the console but don't crash the app
        print(f"⚠️ Logging skipped: Missing creds. Token: {bool(token)}, Repo: {repo}, Issue: {issue_number}")
        return  # Exit the function safely

    # Get the current timestamp in readable format (YYYY-MM-DD HH:MM:SS)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Create the body of the GitHub comment using formatted string (Markdown supported)
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

    # Construct the GitHub API URL for creating a comment
    url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
    
    # Set the headers required by GitHub API
    headers = {
        "Authorization": f"token {token}",  # Authenticate with the PAT
        "Accept": "application/vnd.github.v3+json"  # Specify API version
    }
    
    try:
        # Log the attempt to the server console
        print(f"📡 Sending log to GitHub: {url}")
        
        # Make the POST request to create the comment
        resp = requests.post(url, headers=headers, json={"body": body})
        
        # Check if the request was successful (HTTP 201 Created)
        if resp.status_code == 201:
            print("✅ Logged to GitHub successfully")
        else:
            # Print error details if it failed
            print(f"❌ GitHub API Error: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        # Catch network or other errors to prevent crashing the main app
        print(f"❌ Failed to log to GitHub: {str(e)}")
