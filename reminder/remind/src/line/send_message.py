import asyncio
import logging
import os
import random
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional

import httpx
import requests
from dotenv import load_dotenv

load_dotenv()


LIFF_ID = os.getenv("LIFF_ID")
LIFF_URL = os.getenv("LIFF_URL")
LINE_ACCESS_TOKEN = os.getenv("LINE_ACCESS_TOKEN")

x

PROMISE_STATUS_PROBABILITY = {
    PromiseStatus.LIGHT: 0.1,
    PromiseStatus.NORMAL: 0.5,
    PromiseStatus.NEAR_DEADLINE: 0.8,
    PromiseStatus.DEADLINE_TODAY: 1.0,
}


class PromiseStatus(str, Enum):
    LIGHT = "light"
    NORMAL = "normal"
    NEAR_DEADLINE = "near_deadline"
    DEADLINE_TODAY = "deadline_today"


def get_promise_status(promise: Promise) -> PromiseStatus:
    if promise.level == "LOW":
        return PromiseStatus.LIGHT
    if not promise.due_date:
        return PromiseStatus.NORMAL

    now = datetime.utcnow()
    try:
        due_date = datetime.fromisoformat(promise.due_date)
    except ValueError:
        logging.error(f"約束の内容が無効: {promise.due_date}")
        return PromiseStatus.NORMAL

    diff_days = (due_date - now).days

    if 0 <= diff_days < 1:
        return PromiseStatus.DEADLINE_TODAY
    elif 1 <= diff_days < 7:
        return PromiseStatus.NEAR_DEADLINE
    return PromiseStatus.NORMAL


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


def send_with_probability(user_id, messages, status: PromiseStatus):
    probability = PROMISE_STATUS_PROBABILITY.get(status, 1.0)
    if random.random() < probability:
        return send_line_message(user_id, messages)
    else:
        return None
