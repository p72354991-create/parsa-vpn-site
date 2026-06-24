import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findUserByResetToken, updateUser, hashPassword, generateToken } from "@/lib/db";

// Request reset - generates token
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ message: "اگر ایمیل شما ثبت شده باشد، لینک بازیابی ارسال شده." });
    }

    const token = generateToken();
    updateUser(user.id, {
      resetToken: token,
      resetExpiry: Date.now() + 3600000, // 1 hour
    });

    // In production, send email here. For now, return the token.
    console.log(`[PASSWORD RESET] ${email} -> token: ${token}`);

    return NextResponse.json({
      message: "لینک بازیابی رمز عبور ارسال شد.",
      // In dev mode, return token for testing
      _devToken: token,
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// Reset password with token
export async function PUT(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "توکن و رمز عبور جدید الزامی است" }, { status: 400 });
    }

    const user = findUserByResetToken(token);
    if (!user) {
      return NextResponse.json({ error: "توکن نامعتبر یا منقضی شده" }, { status: 400 });
    }

    updateUser(user.id, {
      password: hashPassword(password),
      resetToken: "",
      resetExpiry: 0,
    });

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد." });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
