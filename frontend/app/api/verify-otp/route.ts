import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, getOTPAttempts } from "@/lib/otp/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      const attempts = getOTPAttempts(email);
      return NextResponse.json(
        { 
          error: "Invalid OTP",
          attempts,
          remaining: Math.max(0, 5 - attempts),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "OTP verified successfully",
        email,
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
