import os
from supabase import Client, create_client
from dotenv import load_dotenv
from datetime import datetime
from dataclasses import dataclass

load_dotenv()

@dataclass
class Promise:
    id: int
    content: str
    level: str
    due_date: datetime
    is_accepted: bool
    completed_at: datetime
    created_at: datetime
    updated_at: datetime
    receiverUserId: str
    senderUserId: str



SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
current_time = datetime.utcnow().isoformat()

response = (
    supabase.table("Promise")
    .select("*")
    .not_.is_("completedAt", "null")
    .lte("dueDate", current_time) 
    .eq("isAccepted", True)
    .execute()
)

for row in response.data:
    promise = Promise (
        id=row["id"],
        content=row["content"],
        level=row["level"],
        due_date=row["dueDate"],
        is_accepted=row["isAccepted"],
        completed_at=row["completedAt"],
        created_at=row["createdAt"],
        updated_at=row["updatedAt"],
        receiverUserId=row["receiverUserId"],
        senderUserId=row["senderUserId"]
    )
    print(promise)


# print("Filtered Promises:", response.data)
