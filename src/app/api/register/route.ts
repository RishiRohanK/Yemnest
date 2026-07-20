import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      houseNo,
      addressLine1,
      pincode,
      phoneNumber,
      alternativeMobileNumber,
    } = body;

    // Validate inputs
    if (
      !name ||
      !email ||
      !password ||
      !houseNo ||
      !addressLine1 ||
      !pincode ||
      !phoneNumber ||
      !alternativeMobileNumber
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Neon DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        houseNo,
        addressLine1,
        pincode,
        phoneNumber,
        alternativeMobileNumber,
      },
    });

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
