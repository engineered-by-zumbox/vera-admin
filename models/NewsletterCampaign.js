import mongoose from "mongoose"

const NewsletterCampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.NewsletterCampaign || mongoose.model("NewsletterCampaign", NewsletterCampaignSchema)

