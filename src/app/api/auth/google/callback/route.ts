import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { findUserByEmail, createUser } from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  }

  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    const { email, name, picture } = payload;

    let user = findUserByEmail(email || "");

    if (!user) {
      user = createUser({
        name: name || email?.split("@")[0] || "کاربر گوگل",
        email: email || "",
        phone: "",
        password: "",
        avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        provider: "google",
      });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64");

    // Redirect to dashboard with token in URL params
    const redirectUrl = new URL("/dashboard", req.url);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("user", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    }));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}
