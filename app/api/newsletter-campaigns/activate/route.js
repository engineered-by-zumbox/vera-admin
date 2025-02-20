import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import NewsletterCampaign from "@/models/NewsletterCampaign"
import { verifyToken } from "@/lib/auth"

export async function POST(request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = authHeader.split(" ")[1]
  const decodedToken = verifyToken(token)
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    await dbConnect()

    // First, deactivate all campaigns
    await NewsletterCampaign.updateMany({}, { isActive: false })

    // Then, activate the selected campaign
    const campaign = await NewsletterCampaign.findByIdAndUpdate(campaignId, { isActive: true }, { new: true })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Activate campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

