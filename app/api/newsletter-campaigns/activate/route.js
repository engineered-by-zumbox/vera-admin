import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import NewsletterCampaign from "@/models/NewsletterCampaign";
import { verifyToken } from "@/lib/auth";

async function checkAdminAuth(request) {
  const cookies = request.cookies;
  const authToken = cookies.get("auth_token");

  if (!authToken?.value) {
    return null;
  }

  return verifyToken(authToken.value);
}

export async function POST(request) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // First, deactivate all campaigns
    await NewsletterCampaign.updateMany({}, { isActive: false });

    // Then, activate the selected campaign
    const campaign = await NewsletterCampaign.findByIdAndUpdate(
      campaignId,
      { isActive: true },
      { new: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Activate campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
