import { NextRequest, NextResponse } from "next/server";
import { getSiteData, updateSiteData } from "@/lib/content";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { findAdminByUsername, hashPassword, ensureOwnerAdmin } from "@/lib/db";

ensureOwnerAdmin();

export async function GET() {
  const data = getSiteData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = atob(authHeader.split(" ")[1]);
  const [username, password] = decoded.split(":");

  const admin = findAdminByUsername(username);
  if (!admin || admin.password !== hashPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const body = await req.json();
  const updated = updateSiteData(body);

  if (body.adminRoute) {
    const envPath = join(process.cwd(), ".env.local");
    let envContent = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";
    if (envContent.includes("ADMIN_SECRET=")) {
      envContent = envContent.replace(/ADMIN_SECRET=.*/, `ADMIN_SECRET=${body.adminRoute}`);
    } else {
      envContent += `\nADMIN_SECRET=${body.adminRoute}`;
    }
    writeFileSync(envPath, envContent.trim() + "\n", "utf-8");
  }

  return NextResponse.json(updated);
}
