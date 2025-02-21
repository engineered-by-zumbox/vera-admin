import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import NewsletterCampaign from "@/models/NewsletterCampaign";
import { verifyToken } from "@/lib/auth";
import { put, del } from "@vercel/blob";

async function checkAdminAuth(request) {
  const cookies = request.cookies;
  const authToken = cookies.get("auth_token");

  if (!authToken?.value) {
    return null;
  }

  return verifyToken(authToken.value);
}

export async function GET(request, { params }) {
  const id = (await params).id;
  try {
    await dbConnect();
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Fetch campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = (await params).id;
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const message = formData.get("message");
    const image = formData.get("image");
    const isActive = formData.get("isActive") === "true";

    await dbConnect();
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    campaign.title = title || campaign.title;
    campaign.message = message || campaign.message;

    if (image) {
      const blob = await put(image.name, image, { access: "public" });
      campaign.imageUrl = blob.url;
    }

    campaign.isActive = isActive;

    if (isActive) {
      // Deactivate all other campaigns
      await NewsletterCampaign.updateMany(
        { _id: { $ne: campaign._id } },
        { isActive: false }
      );
    }

    const updatedCampaign = await campaign.save();
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = (await params).id;

  try {
    await dbConnect();
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Delete the associated image from Vercel Blob
    const blobId = campaign.imageUrl.split("/").pop();
    await del(blobId);

    // Delete the campaign from the database
    await NewsletterCampaign.findByIdAndDelete(id);

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
