import { NextRequest, NextResponse } from "next/server";
import { createPurchase, getPurchasesByUser, getAllPurchases, approvePurchase, rejectPurchase, findUserById } from "@/lib/db";

function getUser(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  try {
    const decoded = JSON.parse(Buffer.from(auth.replace("Bearer ", ""), "base64").toString());
    return findUserById(decoded.id);
  } catch { return null; }
}

// Get purchases
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin");

  if (admin === "true") {
    return NextResponse.json(getAllPurchases());
  }

  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getPurchasesByUser(user.id));
}

// Create purchase
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planType, gigabytes, totalPrice, receipt } = await req.json();

  if (!planType || !receipt) {
    return NextResponse.json({ error: "فیلدها رو پر کنید" }, { status: 400 });
  }

  const purchase = createPurchase({
    userId: user.id,
    userName: user.name,
    planType,
    gigabytes: gigabytes || 0,
    totalPrice: totalPrice || "۳۰۰,۰۰۰",
    receipt,
  });

  return NextResponse.json(purchase);
}

// Approve or reject
export async function PUT(req: NextRequest) {
  const { purchaseId, action, subscriptionLink, reason } = await req.json();

  if (action === "approve") {
    approvePurchase(purchaseId, subscriptionLink || "");
  } else if (action === "reject") {
    rejectPurchase(purchaseId, reason || "");
  }

  return NextResponse.json({ ok: true });
}
