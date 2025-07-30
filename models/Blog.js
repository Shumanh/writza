import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [50, "Title should not exceed 50 characters"]
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    index: true
  },

  shortDescription: {
    type: String,
    required: [true, "Short description is required"],
    trim: true,
    maxlength: [150, "Short description should not exceed 150 characters"]
  },

  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true
  },

  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [25, "Each tag should not exceed 25 characters"]
  }],

  image: {
    url: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: "",
      maxlength: [200, "Alt text should not exceed 200 characters"]
    },

  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: [true, "Author is required"],
    index: true 
  },

  publishedAt: {
    type: Date,
    default: null,
    index: true 
  },

}, {
  timestamps: true 
  
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
