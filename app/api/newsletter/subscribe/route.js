import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the email already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        {
          message: "Email is already subscribed",
        },
        { status: 409 }
      );
    }

    // Create new subscriber
    const newSubscriber = await NewsletterSubscriber.create({ email });

    return NextResponse.json(
      {
        message: "Successfully subscribed to the newsletter",
        subscriber: {
          id: newSubscriber._id,
          email: newSubscriber.email,
          subscribedAt: newSubscriber.subscribedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
