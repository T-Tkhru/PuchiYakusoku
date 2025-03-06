import { createClient } from "jsr:@supabase/supabase-js@2";

const lineToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") ?? "";

const sendMessage = async (
  promise: { id: string },
  messageTo: { displayName: string; userId: string },
  messageFrom: { displayName: string; userId: string },
  message: string,
  imageUrl: string,
): Promise<void | Error> => {
  try {
    console.log("sendMessage: start");
    const response = await fetch(
      `https://api.line.me/v2/bot/message/push`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: messageTo?.userId,
          messages: [
            {
              type: "template",
              altText: message,
              template: {
                type: "buttons",
                thumbnailImageUrl: imageUrl,
                imageAspectRatio: "rectangle",
                imageSize: "cover",
                imageBackgroundColor: "#6ac1b7",
                text: message,
                actions: [
                  {
                    type: "uri",
                    label: "プチ約束を確認する",
                    uri:
                      `https://liff.line.me/${
                        Deno.env.get("NEXT_PUBLIC_LIFF_ID")
                      }` +
                      `/?query=${promise.id}`,
                  },
                ],
              },
            },
          ],
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error fetching auth user data: ${response.status}`);
    }
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
};

Deno.serve(async (req: Request): Promise<Response> => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );
  const requestBody = await req.json();
  const { record } = requestBody;
  console.log(requestBody);
  const { data: promise, error: promiseError } = await supabaseClient
    .from("Promise")
    .select(
      "id, senderUserId, receiverUserId, dueDate, isAccepted, dueDate, completedAt, canceledAt",
    )
    .eq("id", record.id)
    .single();
  if (promiseError) {
    return new Response("Internal Server Error", { status: 500 });
  } else {
    console.log(promise);
  }
  const { data: sender, error: senderError } = await supabaseClient
    .from("User")
    .select("displayName, userId")
    .eq("userId", record.senderUserId)
    .single();
  if (senderError) {
    return new Response("Internal Server Error", { status: 500 });
  } else {
    console.log(sender);
  }
  const { data: receiver, error: receiverError } = await supabaseClient
    .from("User")
    .select("displayName, userId")
    .eq("userId", record.receiverUserId)
    .single();
  if (receiverError) {
    return new Response("Internal Server Error", { status: 500 });
  } else {
    console.log(receiver);
  }
  if (
    promise.isAccepted === false && promise.completedAt === null &&
    promise.canceledAt === null
  ) {
    sendMessage(
      promise,
      sender,
      receiver,
      `${receiver.displayName}さんとの約束は成立しなかったよ...`,
      "https://i.gyazo.com/b286511721ae49d4530bea3dee15bc88.jpg",
    );
    console.log("sendMessage: 成立しなかった");
  }
  if (
    promise.isAccepted === true && promise.completedAt === null &&
    promise.canceledAt === null
  ) {
    sendMessage(
      promise,
      sender,
      receiver,
      `${receiver.displayName}さんとの約束が成立しました！`,
      "https://i.gyazo.com/9353b09650abfb3deb5c50227fc5f56a.jpg",
    );
    sendMessage(
      promise,
      receiver,
      sender,
      `${sender.displayName}さんとの約束が成立しました！`,
      "https://i.gyazo.com/9353b09650abfb3deb5c50227fc5f56a.jpg",
    );
    console.log("sendMessage: 成立しました");
  }
  if (
    promise.isAccepted === true && promise.completedAt === null &&
    promise.canceledAt !== null
  ) {
    sendMessage(
      promise,
      sender,
      receiver,
      `${receiver.displayName}さんとの約束は取り消されました...\nまた約束をしてみよう!`,
      "https://i.gyazo.com/b286511721ae49d4530bea3dee15bc88.jpg",
    );
    sendMessage(
      promise,
      receiver,
      sender,
      `${sender.displayName}さんとの約束は取り消されました...\nまた約束をしてみよう!`,
      "https://i.gyazo.com/b286511721ae49d4530bea3dee15bc88.jpg",
    );
    console.log("sendMessage: 取り消されました");
  }
  if (
    promise.isAccepted === true && promise.completedAt !== null &&
    promise.canceledAt === null
  ) {
    sendMessage(
      promise,
      sender,
      receiver,
      `${receiver.displayName}さんとの約束を達成しました!`,
      "https://i.gyazo.com/c5997a08e5a40cb849018b50f0d3e3ba.jpg",
    );
    sendMessage(
      promise,
      receiver,
      sender,
      `${sender.displayName}さんとの約束を達成しました!`,
      "https://i.gyazo.com/c5997a08e5a40cb849018b50f0d3e3ba.jpg",
    );
    console.log("sendMessage: 達成しました");
  }

  console.log("送信完了");
  return new Response("Message sent successfully", { status: 200 });
});
