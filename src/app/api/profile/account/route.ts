import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, phoneNumber, alternativeMobileNumber } = body;

    if (!userId || !name || !email) {
      return NextResponse.json({ error: "User ID, name, and email are required." }, { status: 400 });
    }

    // Check if email belongs to someone else
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phoneNumber,
        alternativeMobileNumber
      },
    });

    return NextResponse.json(
      { 
        message: "Account details updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          alternativeMobileNumber: updatedUser.alternativeMobileNumber
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating account details." },
      { status: 500 }
    );
  }
}
