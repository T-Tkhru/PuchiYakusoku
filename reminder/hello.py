import datetime
import random


def random_time():
    """08:00〜20:00の間でランダムな2つの時間を生成"""
    first_time = random.randint(8 * 60, 20 * 60)  # 分単位 (08:00〜20:00)
    second_time = random.randint(8 * 60, 20 * 60)

    if first_time > second_time:
        first_time, second_time = second_time, first_time  # 昇順に並べる

    return [
        datetime.time(hour=first_time // 60, minute=first_time % 60),
        datetime.time(hour=second_time // 60, minute=second_time % 60),
    ]


print(random_time())
