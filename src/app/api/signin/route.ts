import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if this is the admin login
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email.trim() === adminEmail.trim() && password === adminPassword.trim()) {
      const { setSessionCookie } = await import("@/lib/auth");
      await setSessionCookie({ role: "admin", email });
      return NextResponse.json(
        { message: "Admin authenticated successful", isAdmin: true },
        { status: 200 }
      );
    }

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password (support both legacy plain text and new bcrypt hashes)
    let isPasswordValid = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const { setSessionCookie } = await import("@/lib/auth");
    await setSessionCookie({ 
      role: "user", 
      id: user.id, 
      email: user.email, 
      name: user.name,
      houseNo: user.houseNo,
      addressLine1: user.addressLine1,
      pincode: user.pincode,
      phoneNumber: user.phoneNumber,
      alternativeMobileNumber: user.alternativeMobileNumber
    });

    return NextResponse.json(
      { 
        message: "Authentication successful", 
        userId: user.id, 
        userName: user.name, 
        userEmail: user.email,
        houseNo: user.houseNo,
        addressLine1: user.addressLine1,
        pincode: user.pincode,
        phoneNumber: user.phoneNumber,
        alternativeMobileNumber: user.alternativeMobileNumber
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign in. Please try again." },
      { status: 500 }
    );
  }
}
