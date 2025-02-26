import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

console.log("Hello from Functions!");

const handler = async (req: Request) => {
  try {
    const requestBody = await req.json();
    const { record } = requestBody;
    if (
      !record ||
      !record.receiverUserId ||
      !record.senderUserId ||
      !record.content
    ) {
      console.error("Invalid request payload:", requestBody);
      return new Response("Invalid request payload", { status: 400 });
    }
    if (record.isAccepted === undefined) {
      return new Response("isAccepted is not set", { status: 400 });
    }
    const isAccepted = record.isAccepted;
    const content = record.content;
    let messageTo: string[];
    let message: string;

    const lineToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    if (!lineToken) {
      console.error("LINE_CHANNEL_ACCESS_TOKEN is not set.");
      return new Response("Internal Server Error", { status: 500 });
    }

    // 約束が拒否された場合
    if (!isAccepted) {
      messageTo = [record.senderUserId];
      message = `約束は拒否された！！ ${content}`;
    }
    // 約束が受諾された場合
    else {
      messageTo = [record.senderUserId, record.receiverUserId];
      message = `約束は成立した！！ ${content}`;
    }

    const response = await fetch(
      `https://api.line.me/v2/bot/message/multicast`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: messageTo,
          messages: [
            {
              type: "text",
              text: message,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send message:", errorText);
      return new Response(`Failed to send message: ${errorText}`, {
        status: 500,
      });
    }

    return new Response("Message sent successfully", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

serve(handler);
