import datetime
import random

import google.auth
from dotenv import load_dotenv
from google.cloud import scheduler_v1

load_dotenv()
PROJECT_ID = os.getenv("PROJECT_ID")
SCHEDULER_JOB_NAME = os.getenv("SCHEDULER_JOB_NAME")
SCHEDULER_LOCATION = "asia-northeast1"
TIME_ZONE = "Asia/Tokyo"


def random_time():
    first_time = random.randint(8 * 60, 20 * 60)
    second_time = random.randint(8 * 60, 20 * 60)

    if first_time > second_time:
        first_time, second_time = second_time, first_time

    return [
        datetime.time(hour=first_time // 60, minute=first_time % 60),
        datetime.time(hour=second_time // 60, minute=second_time % 60),
    ]


def update_scheduler(event, context):
    credentials, project = google.auth.default()
    client = scheduler_v1.CloudSchedulerClient(credentials=credentials)
    parent = f"projects/{PROJECT_ID}/locations/{SCHEDULER_LOCATION}"
    job_name = f"{parent}/jobs/{SCHEDULER_JOB_NAME}"

    times = random_time()
    schedules = [f"{t.minute} {t.hour} * * *" for t in times]

    job = client.get_job(name=job_name)
    job.schedule = schedules[0]
    client.update_job(job)

    second_job_name = f"{SCHEDULER_JOB_NAME}-2"
    second_job_path = f"{parent}/jobs/{second_job_name}"

    try:
        job2 = client.get_job(name=second_job_path)
        job2.schedule = schedules[1]
        client.update_job(job2)
    except:
        new_job = scheduler_v1.Job(
            name=second_job_path,
            schedule=schedules[1],
            time_zone=TIME_ZONE,
            http_target=job.http_target,
        )
        client.create_job(parent=parent, job=new_job)

    print(f"{schedules}")
