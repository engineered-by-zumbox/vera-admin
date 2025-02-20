import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import NewsletterCampaign from "@/models/NewsletterCampaign"
import { verifyToken } from "@/lib/auth"
import { put } from "@vercel/blob"

async function checkAdminAuth(request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  const token = authHeader.split(" ")[1]
  return verifyToken(token)
}

export async function GET(request) {
  try {
    await dbConnect()
    const campaigns = await NewsletterCampaign.find().sort({ createdAt: -1 })
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Fetch campaigns error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  const decodedToken = await checkAdminAuth(request)
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = formData.get("title")
    const message = formData.get("message")
    const image = formData.get("image")

    if (!title || !message || !image) {
      return NextResponse.json({ error: "Title, message, and image are required" }, { status: 400 })
    }

    const blob = await put(image.name, image, { access: "public" })

    await dbConnect()
    const newCampaign = await NewsletterCampaign.create({
      title,
      message,
      imageUrl: blob.url,
      isActive: false, // Always create as inactive
    })

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

