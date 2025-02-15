import { NextResponse } from "next/server"
import { verifyToken, hashPassword } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(request) {
  try {
    const { resetToken, newPassword, confirmPassword } = await request.json()

    if (!resetToken || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          error: "Reset token, new password, and confirm password are required",
        },
        { status: 400 },
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          error: "Passwords do not match",
        },
        { status: 400 },
      )
    }

    await dbConnect()

    const decodedToken = verifyToken(resetToken)
    if (!decodedToken) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
        },
        { status: 400 },
      )
    }

    const user = await User.findById(decodedToken.userId)
    if (!user) {
      return NextResponse.json(
        {
          error: "Admin user not found",
        },
        { status: 404 },
      )
    }

    // Update the password
    user.password = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Set new password error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

