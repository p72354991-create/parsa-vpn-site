import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, getAllPurchases, findAdminByUsername, hashPassword, ensureOwnerAdmin } from "@/lib/db";

ensureOwnerAdmin();

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;
  const decoded = atob(auth.split(" ")[1]);
  const [username, password] = decoded.split(":");
  const admin = findAdminByUsername(username);
  return admin && admin.password === hashPassword(password);
}

// Get all users with purchases
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = getAllUsers();
  const purchases = getAllPurchases();

  const usersWithStats = users.map((u) => {
    const userPurchases = purchases.filter((p) => p.userId === u.id);
    const activePurchases = userPurchases.filter((p) => p.status === "approved");
    const pendingPurchases = userPurchases.filter((p) => p.status === "pending");

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      provider: u.provider,
      createdAt: u.createdAt,
      stats: {
        totalPurchases: userPurchases.length,
        activeSubscriptions: activePurchases.length,
        pendingPurchases: pendingPurchases.length,
      },
      activeSubscriptions: activePurchases.map((p) => ({
        id: p.id,
        planType: p.planType,
        gigabytes: p.gigabytes,
        totalPrice: p.totalPrice,
        subscriptionLink: p.subscriptionLink,
        approvedAt: p.approvedAt,
      })),
    };
  });

  return NextResponse.json(usersWithStats);
}

// Cancel/deactivate subscription
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { purchaseId, action, reason } = await req.json();

  if (action === "deactivate") {
    const { rejectPurchase } = await import("@/lib/db");
    rejectPurchase(purchaseId, reason || "لغو شده توسط ادمین");
  }

  return NextResponse.json({ ok: true });
}
