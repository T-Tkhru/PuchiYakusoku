import logging
import os
import random
from dataclasses import dataclass

from dotenv import load_dotenv
from src.line.send_message import get_promise_status, send_with_probability
from src.type import Promise, User

from supabase import Client, create_client

load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_user_name(user_id):
    return users.get(user_id, "Unknown")


def remind_promises(event, context):
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
        status = get_promise_status(promise)
        logging.info(f"result :{promise}")
        send_with_probability(promise, status)
