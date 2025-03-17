import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { put, del } from "@vercel/blob";

// Helper function to check admin authentication
async function checkAdminAuth(request) {
  const cookies = request.cookies;
  const authToken = cookies.get("auth_token");

  if (!authToken?.value) {
    return null;
  }

  return verifyToken(authToken.value);
}

// GET a specific project
export async function GET(request, { params }) {
  const id = (await params).id;
  try {
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("Fetch project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT (update) a specific project
export async function PUT(request, { params }) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = (await params).id;

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");

    // Handle empty arrays correctly
    const newImagesData = formData.get("newImages");
    const newImages =
      formData.has("newImages") && newImagesData !== "[]"
        ? formData.getAll("newImages")
        : [];

    const newCaptionsData = formData.get("newCaptions");
    const newCaptions =
      formData.has("newCaptions") && newCaptionsData !== "[]"
        ? formData.getAll("newCaptions")
        : [];

    // Parse existing images with error handling
    let existingImages = [];
    try {
      const existingImagesStr = formData.get("existingImages") || "[]";
      existingImages = JSON.parse(existingImagesStr);

      // Validate existingImages format
      if (!Array.isArray(existingImages)) {
        throw new Error("existingImages must be an array");
      }

      // Ensure each item has required properties
      existingImages = existingImages.filter((img) => {
        return img && typeof img === "object" && img.url && img.blobId;
      });
    } catch (jsonError) {
      console.error("Error parsing existingImages:", jsonError);
      return NextResponse.json(
        { error: "Invalid existingImages format" },
        { status: 400 }
      );
    }

    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Process new images with better error handling
    const processedNewImages = await Promise.all(
      newImages.map(async (image, index) => {
        if (image instanceof File || image instanceof Blob) {
          try {
            // Generate a unique filename if one doesn't exist
            const fileName = image.name || `image-${Date.now()}-${index}.jpg`;

            const blob = await put(fileName, image, {
              access: "public",
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });

            // Extract blobId more safely
            const urlParts = blob.url.split("/");
            const blobId = urlParts[urlParts.length - 1];

            return {
              url: blob.url,
              blobId,
              caption: newCaptions[index] || "",
            };
          } catch (uploadError) {
            console.error("Image upload error:", uploadError);
            throw new Error(
              `Failed to upload image ${index + 1}: ${uploadError.message}`
            );
          }
        }
        return null;
      })
    ).then((images) => images.filter((img) => img !== null));

    // Create a set of blobIds to keep
    const imagesToKeep = new Set(existingImages.map((img) => img.blobId));

    // Delete removed blobs with error handling
    await Promise.all(
      project.images.map(async (image) => {
        if (image.blobId && !imagesToKeep.has(image.blobId)) {
          try {
            await del(image.blobId);
            console.log(`Successfully deleted blob: ${image.blobId}`);
          } catch (delError) {
            console.error(`Error deleting blob ${image.blobId}:`, delError);
            // Continue with update even if deletion fails
          }
        }
      })
    );

    // Combine existing and new images
    const allImages = [...existingImages, ...processedNewImages];

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        images: allImages,
      },
      { new: true } // Returns the updated document
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a specific project
export async function DELETE(request, { params }) {
  const decodedToken = await checkAdminAuth(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (await params).id;
  try {
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete all associated images from Vercel Blob
    await Promise.all(
      project.images.map(async (image) => {
        await del(image?.blobId);
      })
    );

    // Delete the project from the database
    await Project.findByIdAndDelete(id); // Fixed: use id instead of params.id

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
