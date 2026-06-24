import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findUserByPhone, createUser, hashPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, provider } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "نام و رمز عبور الزامی است" }, { status: 400 });
    }

    if (provider !== "google" && !email && !phone) {
      return NextResponse.json({ error: "ایمیل یا شماره تلفن الزامی است" }, { status: 400 });
    }

    if (email && findUserByEmail(email)) {
      return NextResponse.json({ error: "این ایمیل قبلاً ثبت‌نام شده" }, { status: 400 });
    }

    if (phone && findUserByPhone(phone)) {
      return NextResponse.json({ error: "این شماره تلفن قبلاً ثبت‌نام شده" }, { status: 400 });
    }

    const user = createUser({
      name,
      email: email || "",
      phone: phone || "",
      password: provider === "google" ? "" : hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      provider: provider || "local",
    });

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64");

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
