import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    // Get the auth token from the request headers
    const cookies = request.cookies;
    const authToken = cookies.get("auth_token");

    if (!authToken?.value) {
      return null;
    }

    // Verify the token
    const decodedToken = verifyToken(authToken.value);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Fetch subscribers with pagination
    const subscribers = await NewsletterSubscriber.find()
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of subscribers
    const totalSubscribers = await NewsletterSubscriber.countDocuments();

    return NextResponse.json({
      subscribers: subscribers.map((sub) => ({
        id: sub._id,
        email: sub.email,
        subscribedAt: sub.subscribedAt,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalSubscribers / limit),
      totalSubscribers,
    });
  } catch (error) {
    console.error("Fetch newsletter subscribers error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
