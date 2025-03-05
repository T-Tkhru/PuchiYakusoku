import os

import requests
from dotenv import load_dotenv

load_dotenv()
LIFF_ID = os.getenv("LIFF_ID")
LIFF_URL = os.getenv("LIFF_URL")
LINE_ACCESS_TOKEN = os.getenv("LINE_ACCESS_TOKEN")

def create_button_template_message(text, image_url, liff_url):

    return {
        "type": "template",
        "altText": text,
        "template": {
            "type": "buttons",
            "thumbnailImageUrl": image_url,
            "imageAspectRatio": "rectangle",
            "imageSize": "cover",
            "imageBackgroundColor": "#6ac1b7",
            "text": text,
            "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": liff_url
            },
            "actions": [
                {
                    "type": "uri",
                    "label": "約束を確認する",
                    "uri": liff_url
                }
            ]
        }
    }


def send_line_message(user_id, messages):
    print(LINE_ACCESS_TOKEN)
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
    }
    data = {
        "to": user_id,
        "messages": messages
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  
        print(f"Response: {response}")
        return response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        return None, {"error": str(e)}
