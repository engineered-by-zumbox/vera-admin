import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
  },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)

