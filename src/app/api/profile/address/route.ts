import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, houseNo, addressLine1, pincode, phoneNumber, alternativeMobileNumber } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        houseNo,
        addressLine1,
        pincode,
        phoneNumber,
        alternativeMobileNumber: alternativeMobileNumber || "",
      },
    });

    return NextResponse.json(
      { 
        message: "Address updated successfully",
        user: {
          id: updatedUser.id,
          houseNo: updatedUser.houseNo,
          addressLine1: updatedUser.addressLine1,
          pincode: updatedUser.pincode,
          phoneNumber: updatedUser.phoneNumber,
          alternativeMobileNumber: updatedUser.alternativeMobileNumber
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the address." },
      { status: 500 }
    );
  }
}
