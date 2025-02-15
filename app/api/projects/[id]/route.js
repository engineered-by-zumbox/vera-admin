import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Project from "@/models/Project"
import { verifyToken } from "@/lib/auth"
import { put, del } from "@vercel/blob"

// Helper function to check admin authentication
async function checkAdminAuth(request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  const token = authHeader.split(" ")[1]
  return verifyToken(token)
}

// GET a specific project
export async function GET(request, { params }) {
  const id = (await params).id
  try {
    await dbConnect()
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error("Fetch project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT (update) a specific project
export async function PUT(request, { params }) {
  const decodedToken = await checkAdminAuth(request)
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const id = (await params).id

  try {
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const category = formData.get("category")
    const newImages = formData.getAll("newImages")
    const newCaptions = formData.getAll("newCaptions")
    const existingImages = JSON.parse(formData.get("existingImages") || "[]")

    await dbConnect()
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Process new images
    const processedNewImages = await Promise.all(
      newImages.map(async (image, index) => {
        const blob = await put(image.name, image, { access: "public", token: process.env.BLOB_READ_WRITE_TOKEN })
        return {
          url: blob.url,
          blobId: blob.url.split("/").pop(),
          caption: newCaptions[index] || "",
        }
      }),
    )

    // Delete removed images
    const imagesToKeep = new Set(existingImages.map((img) => img.blobId))
    await Promise.all(
      project.images.map(async (image) => {
        if (!imagesToKeep.has(image.blobId)) {
          await del(image.blobId)
        }
      }),
    )

    // Update project
    project.name = name
    project.description = description
    project.category = category
    project.images = [...existingImages, ...processedNewImages]

    const updatedProject = await project.save()
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a specific project
export async function DELETE(request, { params }) {
  const decodedToken = await checkAdminAuth(request)
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
 const id = (await params).id
  try {
    await dbConnect()
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete all associated images from Vercel Blob
    await Promise.all(
      project.images.map(async (image) => {
        await del(image.blobId)
      }),
    )

    // Delete the project from the database
    await Project.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

