import { NextRequest, NextResponse } from "next/server";
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, findAdminByUsername, hashPassword, ensureOwnerAdmin } from "@/lib/db";

ensureOwnerAdmin();

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;
  const decoded = atob(auth.split(" ")[1]);
  const [username, password] = decoded.split(":");
  const admin = findAdminByUsername(username);
  return admin && admin.password === hashPassword(password) && admin.role === "owner";
}

// Get all admins
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admins = getAllAdmins().map((a) => ({ ...a, password: "***" }));
  return NextResponse.json(admins);
}

// Create admin
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username, password, name, role } = await req.json();
  if (!username || !password || !name || !role) {
    return NextResponse.json({ error: "فیلدها رو پر کنید" }, { status: 400 });
  }
  if (findAdminByUsername(username)) {
    return NextResponse.json({ error: "این نام کاربری قبلاً استفاده شده" }, { status: 400 });
  }
  const admin = createAdmin({ username, password: hashPassword(password), name, role });
  return NextResponse.json({ ...admin, password: "***" });
}

// Update admin
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, name, role, password, username } = await req.json();
  const update: Record<string, string> = {};
  if (name) update.name = name;
  if (role) update.role = role;
  if (password) update.password = hashPassword(password);
  if (username) {
    const existing = findAdminByUsername(username);
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "این یوزرنیم قبلاً استفاده شده" }, { status: 400 });
    }
    update.username = username;
  }
  updateAdmin(id, update);
  return NextResponse.json({ ok: true });
}

// Delete admin
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  if (id === "owner") return NextResponse.json({ error: "قادر به حذف مالک نیستید" }, { status: 400 });
  deleteAdmin(id);
  return NextResponse.json({ ok: true });
}
