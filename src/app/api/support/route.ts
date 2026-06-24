import { NextRequest, NextResponse } from "next/server";
import { createMessage, getMessagesByUser, getAllMessages, addMessageToThread, closeMessage, findUserById } from "@/lib/db";

function getUser(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  try {
    const decoded = JSON.parse(Buffer.from(auth.replace("Bearer ", ""), "base64").toString());
    return findUserById(decoded.id);
  } catch {
    return null;
  }
}

// Get messages
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin");
  const messageId = url.searchParams.get("id");

  // Admin: get all messages
  if (admin === "true") {
    return NextResponse.json(getAllMessages());
  }

  // Get single message
  if (messageId) {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const messages = getMessagesByUser(user.id);
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(msg);
  }

  // User: get own messages
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getMessagesByUser(user.id));
}

// Create or reply
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Admin reply
  if (body.admin && body.messageId) {
    addMessageToThread(body.messageId, "admin", body.text);
    return NextResponse.json({ ok: true });
  }

  // User reply to existing thread
  if (body.messageId && !body.admin) {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: "برای ارسال پیام ابتدا وارد شوید" }, { status: 401 });
    addMessageToThread(body.messageId, "user", body.text);
    return NextResponse.json({ ok: true });
  }

  // User: create new message
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "برای ارسال پیام ابتدا وارد شوید" }, { status: 401 });

  // Check if user already has an open thread with this category
  const existing = getMessagesByUser(user.id);
  const openThread = existing.find((m) => m.status === "open" && m.category === body.category);

  if (openThread) {
    // Add to existing thread
    if (body.text) {
      addMessageToThread(openThread.id, "user", body.text);
    }
    return NextResponse.json(openThread);
  }

  // Create new thread
  const msg = createMessage({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    category: body.category || "عمومی",
    subject: body.subject || "پیام جدید",
  });

  if (body.text) {
    addMessageToThread(msg.id, "user", body.text);
  }

  return NextResponse.json(msg);
}

// Close message
export async function PUT(req: NextRequest) {
  const { messageId } = await req.json();
  closeMessage(messageId);
  return NextResponse.json({ ok: true });
}
