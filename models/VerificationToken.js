import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ["email", "password-reset"],
    required: true
  },
  expires: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Automatically remove expired tokens
verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const VerificationToken = mongoose.models.VerificationToken || 
  mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;