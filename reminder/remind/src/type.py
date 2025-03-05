from dataclasses import dataclass
from datetime import datetime


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
