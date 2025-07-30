import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { loginSchema } from "@/schemas/user.schema";

export const authOptions = {
  providers: [
    // Credentials Provider (your existing username/password system)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input with your existing Zod schema
          const validation = loginSchema.safeParse(credentials);
          if (!validation.success) {
            return null;
          }

          const { email, password } = validation.data;

          await connectToDB();
          
          // Find user and include password for comparison
          const user = await User.findOne({ email }).select('+password');
          if (!user) {
            return null;
          }

          // Check if user has a password (not OAuth-only account)
          if (!user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          // Return user object for NextAuth
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            role: user.role,
            isVerified: user.isVerified,
            image: user.image || null
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      }
    }),

    // Google Provider with account selection
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          await connectToDB();
          
          // Check if user exists with this email
          let existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // If user exists but doesn't have Google ID, link accounts
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              existingUser.isVerified = true;
              existingUser.image = user.image || existingUser.image;
              await existingUser.save();
            }
          } else {
            // Generate a valid username from Google profile data
            const generateValidUsername = (name, email) => {
              // Try to use the name first, clean it up
              let username = name || email.split('@')[0];
              
              // Remove spaces and special characters, keep only letters, numbers, underscores
              username = username.replace(/[^a-zA-Z0-9_]/g, '');
              
              // Ensure it starts with a letter or number
              username = username.replace(/^[^a-zA-Z0-9]+/, '');
              
              // Ensure minimum length
              if (username.length < 3) {
                username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
              }
              
              // Ensure maximum length
              if (username.length > 20) {
                username = username.substring(0, 20);
              }
              
              // If still invalid, use a default pattern
              if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
                username = 'user_' + Date.now().toString().slice(-10);
              }
              
              return username;
            };

            // Create new user for Google sign-in
            const validUsername = generateValidUsername(profile.name, user.email);
            
            const newUser = new User({
              username: validUsername,
              email: user.email,
              googleId: account.providerAccountId,
              image: user.image || "",
              isVerified: true, // Google accounts are pre-verified
            });
            await newUser.save();
          }
          
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        // First time sign in
        token.role = user.role;
        token.id = user.id;
        token.isVerified = user.isVerified;
      }
      
      if (account?.provider === "google") {
        // For Google sign-in, get user data from database
        try {
          await connectToDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
            token.isVerified = dbUser.isVerified;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.isVerified = token.isVerified;
      return session;
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  pages: {
    signIn: '/login',
    signUp: '/register',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 