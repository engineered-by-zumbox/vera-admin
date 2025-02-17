import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    await dbConnect();

    const adminUser = await User.findOne();

    if (!adminUser) {
      return NextResponse.json(
        {
          error: "No admin user found",
        },
        { status: 404 }
      );
    }

    const resetToken = generateToken(adminUser._id.toString(), "15m"); // Token valid for 15 minutes

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: `Veralyssa Admin <noreply@wescng.com>`,
      to: [process.env.ADMIN_EMAIL_FROM],
      subject: "Password Reset Link",
      html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({
      message: "Password reset link sent to admin email",
    });
  } catch (error) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
