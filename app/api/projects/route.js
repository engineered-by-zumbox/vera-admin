import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { put } from "@vercel/blob";

// Helper function to check admin authentication
async function checkAdminAuth(request) {
  const cookies = request.cookies;
  const authToken = cookies.get("auth_token");

  if (!authToken?.value) {
    return null;
  }

  return verifyToken(authToken.value);
}

// GET all projects
export async function GET(request) {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new project
export async function POST(request) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const images = formData.getAll("images");
    const captions = formData.has("captions")
      ? formData.getAll("captions")
      : [];

    if (!name || images.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one image are required" },
        { status: 400 }
      );
    }

    const processedImages = await Promise.all(
      images.map(async (image, index) => {
        if (image instanceof File) {
          const blob = await put(image.name, image, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          return {
            url: blob.url,
            blobId: blob.url.split("/").pop(),
            caption: captions[index] || "",
          };
        }
      })
    );

    await dbConnect();
    const newProject = await Project.create({
      name,
      description,
      category,
      images: processedImages,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
