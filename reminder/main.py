import os
import random
from dataclasses import dataclass
from datetime import datetime

from dotenv import load_dotenv
from line.send_message import create_button_template_message, send_line_message

from supabase import Client, create_client

load_dotenv()

@dataclass
class Promise:
    id: int
    content: str
    level: str
    due_date: datetime
    is_reverse: bool
    is_accepted: bool
    completed_at: datetime
    created_at: datetime
    updated_at: datetime
    receiverUserId: str
    senderUserId: str


@dataclass
class User:
    userId: int
    display_name: str


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
current_time = datetime.utcnow().isoformat()

response_promises = (
    supabase.table("Promise")
    .select("*")
    .is_("completedAt", "null")
    .not_.is_("receiverUserId", "null")
    .gt("dueDate", current_time)
    .eq("isAccepted", True)
    .execute()
)

response_users = supabase.table("User").select("*").execute()
users = {row["userId"]: row["displayName"] for row in response_users.data}


def get_user_name(user_id):
    return users.get(user_id, "Unknown")


for row in response_promises.data:
    promise = Promise(
        id=row["id"],
        content=row["content"],
        is_reverse=row["direction"],
        level=row["level"],
        due_date=row["dueDate"],
        is_accepted=row["isAccepted"],
        completed_at=row["completedAt"],
        created_at=row["createdAt"],
        updated_at=row["updatedAt"],
        receiverUserId=row["receiverUserId"],
        senderUserId=row["senderUserId"],
    )
    print(promise)
    result = send_line_message(
        user_id=promise.senderUserId if promise.is_reverse else promise.receiverUserId,
        messages=[
            {
                "type": "text",
                "text": f"{get_user_name(promise.senderUserId)}と{get_user_name(promise.receiverUserId)}との連絡...忘れてない？",
            },
            create_button_template_message(
                text="約束を確認はこちらこら！",
                image_url="https://i.gyazo.com/9353b09650abfb3deb5c50227fc5f56a.jpg",
                liff_url=f"https://example.com/promise/{promise.id}",
            ),
        ],
    )
    print(result)
