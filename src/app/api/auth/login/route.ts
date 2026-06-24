import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findUserByPhone, hashPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: "فیلدها رو پر کنید" }, { status: 400 });
    }

    const user = findUserByEmail(login) || findUserByPhone(login);

    if (!user) {
      return NextResponse.json({ error: "کاربری با این مشخصات یافت نشد" }, { status: 401 });
    }

    if (user.provider === "google" && !user.password) {
      return NextResponse.json({ error: "این اکانت با گوگل ساخته شده. با گوگل وارد شوید." }, { status: 401 });
    }

    if (user.password !== hashPassword(password)) {
      return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64");

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
