import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp/store";
import { isRateLimited, getRateLimitInfo } from "@/lib/otp/rate-limiter";
import { sendOTPEmail } from "@/lib/otp/client";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check rate limit
    if (isRateLimited(email)) {
      const { remaining, resetAt } = getRateLimitInfo(email);
      const resetIn = Math.ceil((resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${resetIn} seconds`,
          remaining,
          resetIn,
        },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Store OTP
    storeOTP(email, otp);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please check your email configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "OTP sent successfully",
        email,
        otp: process.env.NODE_ENV === "development" ? otp : undefined, // Only return OTP in development
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
