import { NextResponse } from "next/server";
import { generateToken, verifyPassword, hashPassword } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const body = await request.json();
    const { email, password } = body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne();

    if (!existingUser) {
      console.log("No admin user found, creating new admin");
      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      console.log("New admin user created:", {
        id: newUser._id,
        email: newUser.email,
      });

      const token = generateToken(newUser._id.toString());

      const response = NextResponse.json({
        message: "Admin account created and logged in successfully",
        user: {
          id: newUser._id,
        },
      });

      response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    // Verify password for existing user
    console.log("Existing admin user found, verifying password");
    console.log("User ID:", existingUser._id);

    if (existingUser.email !== email) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    if (!existingUser.password) {
      console.error("Password is undefined for user:", existingUser._id);
      return NextResponse.json(
        {
          error: "User account is invalid. Please contact support.",
        },
        { status: 400 }
      );
    }

    const passwordValid = await verifyPassword(existingUser.password, password);
    console.log("Password verification result:", passwordValid);

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const userId = existingUser._id.toString();
    console.log("Generating token for user ID:", userId);

    const token = generateToken(userId);
    console.log("Token generated successfully");

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: existingUser._id,
      },
      token: token,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
