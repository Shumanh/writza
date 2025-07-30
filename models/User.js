import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [true, "Username is required"], 
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username must not exceed 20 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    index: true 
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, 
    trim: true,
    lowercase: true , 
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    index: true 
  },

  password: {
    type: String,
    // Password only required for credentials authentication, not OAuth
    required: function() {
      return !this.googleId && !this.githubId;
    },
    minlength: [8, "Password must be at least 8 characters"],
    
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*()\-+=|\[\]{}\\\/,.<>\?`~])[A-Za-z\d_!@#$%^&*()\-+=|\[\]{}\\\/,.<>\?`~]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ],
    select: false 
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"], 
      message: "Role must be user or admin"
    },
    default: "user", 
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // OAuth provider IDs
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values and ensures uniqueness for non-null values
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  image: {
    type: String,
    default: ""
  }
}, {
  timestamps: true 
});


// Pre-save hook for password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("password") || !this.password) {
    return next(); 
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt); 
    next(); 
  } catch (error) {
    next(error);
  }
});



// Model Export
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User; 