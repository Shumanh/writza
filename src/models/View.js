import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
    ip: { type: String, required: true, index: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Optional compound index to quickly query by blog and ip with recent time filter
viewSchema.index({ blog: 1, ip: 1, createdAt: -1 });

const View = mongoose.models.View || mongoose.model("View", viewSchema);
export default View;


