import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, isAdminLogin } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (isAdminLogin) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@yemnest.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword123";
      if (email === adminEmail && password === adminPassword) {
        const sessionPayload = { role: "admin", email };
        await setSessionCookie(sessionPayload);
        return NextResponse.json({ success: true, role: "admin" });
      } else {
        return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
      }
    }

    // User login
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const bcrypt = await import("bcryptjs");
    let isPasswordValid = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isPasswordValid = await bcrypt.default.compare(password, user.password);
    } else {
      isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionPayload = { 
      role: "user", 
      id: user.id, 
      email: user.email, 
      name: user.name 
    };
    await setSessionCookie(sessionPayload);
    
    // Don't return password in response
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
