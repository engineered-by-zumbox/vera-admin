import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import NewsletterCampaign from "@/models/NewsletterCampaign"

export async function GET(request) {
  try {
    await dbConnect()
    const activeCampaign = await NewsletterCampaign.findOne({ isActive: true })
    if (!activeCampaign) {
      return NextResponse.json({ message: "No active campaign found" }, { status: 404 })
    }
    return NextResponse.json(activeCampaign)
  } catch (error) {
    console.error("Fetch active campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

