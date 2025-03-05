
## こんな感じでデプロイしました

他のプロジェクトもあるので、projectは逐一指定します

スケジューラーの設定
URIは後から設定

```sh
gcloud scheduler jobs create http time-updater --schedule="0 0 * * *" --uri="https://REGION-PROJECT_ID.cloudfunctions.net/run-task" --http-method=POST --time-zone="Asia/Tokyo" --project puchiyakusoku  --location=asia-northeast1
```

```sh
 gcloud functions deploy random_time --runtime python311 --allow-unauthenticated --project puchiyakusoku --trigger-topic=test-topic

```

このためにtest-topicを追加

```sh
 gcloud pubsub topics create test-topic --project=puchiyakusoku

```

トピックリストはここで見れる

```sh
 gcloud pubsub topics list

```

新たに作り直す場合は消す

```sh
 gcloud functions delete random_time --project puchiyakusoku --region=us-central1
```

うまくできたらこんな感じ

```sh
(.venv) PS C:\Users\kake-\Documents\development\webApp\hello-liff\reminder> gcloud functions list --project puchiyakusoku
NAME           STATE   TRIGGER            REGION       ENVIRONMENT
my_hello_http  ACTIVE  HTTP Trigger       us-central1  2nd gen
random_time    ACTIVE  topic: test-topic  us-central1  2nd gen

```

## 各リソース

defineTime: scheduler1（定期実行、scheduler2の実行決定) → scheduler2（本タスクの実行時間決定)
reminder:scheduler2（本タスクの実行時間決定) → remind_promises(本タスク)

## よく使ったコマンド

### スケジューラーの一覧を表示する方法

cloud functionsと違ってasiaを設定できるので大体これ

```sh
gcloud scheduler jobs list --format="table(name, schedule, timeZone, state, pubsubTarget)" --project=puchiyakusoku --location=asia-northeast1
```

結果

```sh
PS C:\Users\kake-> gcloud scheduler jobs list --format="table(name, schedule, timeZone, state, pubsubTarget)" --project=puchiyakusoku --location=asia-northeast1
ID               SCHEDULE     TIME_ZONE   STATE    PUBSUB_TARGET
hello-scheduler  0 */2 * * *  Asia/Tokyo  ENABLED  {'data': 'dGVzdA==', 'topicName': 'projects/puchiyakusoku/topics/test-topic'}
time-updater     0 0 * * *    Asia/Tokyo  ENABLED
```

---

### ジョブ削除

特定のジョブを削除するには、以下のコマンドを実行します。

```sh
gcloud scheduler jobs delete time-updater --project=puchiyakusoku --location=asia-northeast1
```

例: `time-updater` というジョブを `us-central1` リージョンから削除する場合

```sh
gcloud scheduler jobs delete time-updater --location=us-central1
```

### ログを見る

```sh
gcloud functions logs read remind_promises --project=puchiyakusoku --limit=50

```
