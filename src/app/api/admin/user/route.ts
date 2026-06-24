import { NextRequest, NextResponse } from "next/server";
import { findUserById, getMessagesByUser, getAllMessages } from "@/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const user = findUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userMessages = getMessagesByUser(userId);
  const allMessages = getAllMessages();

  const openTickets = userMessages.filter((m) => m.status === "open");
  const closedTickets = userMessages.filter((m) => m.status === "closed");

  // Count conversations with admin
  const totalReplies = userMessages.reduce((acc, m) => acc + m.messages.filter((msg) => msg.sender === "admin").length, 0);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      provider: user.provider,
      createdAt: user.createdAt,
    },
    stats: {
      openTickets: openTickets.length,
      closedTickets: closedTickets.length,
      totalMessages: userMessages.length,
      totalReplies,
    },
    tickets: userMessages.map((m) => ({
      id: m.id,
      category: m.category,
      subject: m.subject,
      status: m.status,
      messageCount: m.messages.length,
      lastMessage: m.messages[m.messages.length - 1]?.text?.slice(0, 100) || "",
      lastTime: m.messages[m.messages.length - 1]?.time || m.createdAt,
      createdAt: m.createdAt,
    })),
  });
}
