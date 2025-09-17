import Pusher from "pusher";
import { dbConnect } from "@/lib/db/mongodb";
import Message from "@/models/Message";
import { getUserFromCookies } from "@/lib/auth/cookies";

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

export async function GET() {
  try {
    // Get authentication info
    const userAuth = await getUserFromCookies();
    if (userAuth.error) {
      return new Response(JSON.stringify({ error: "Authentication required" }), { 
        status: 401 
      });
    }

    await dbConnect();
    
    // Get the last 50 messages
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    // Reverse to show oldest first
    const orderedMessages = messages.reverse();
    
    return new Response(JSON.stringify({ 
      messages: orderedMessages,
      currentUser: {
        id: userAuth.data.id,
        username: userAuth.data.username || userAuth.data.email?.split('@')[0] || "User",
      }
    }), { 
      status: 200 
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { 
      status: 500 
    });
  }
}

export async function POST(req) {
  try {
    // Check authentication
    const userAuth = await getUserFromCookies();
    if (userAuth.error) {
      return new Response(JSON.stringify({ error: "Authentication required" }), { 
        status: 401 
      });
    }

    const { message } = await req.json();
    
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: "Message cannot be empty" }), { 
        status: 400 
      });
    }

    await dbConnect();

    // Create new message with fallback for username
    const newMessage = new Message({
      username: userAuth.data.username || userAuth.data.email.split('@')[0],
      userId: userAuth.data.id,
      message: message.trim(),
    });

    await newMessage.save();

    // Trigger real-time update
    await pusherServer.trigger("chat", "new-message", {
      _id: newMessage._id,
      username: newMessage.username,
      userId: newMessage.userId,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: newMessage 
    }), { 
      status: 200 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), { 
      status: 500 
    });
  }
}

export async function DELETE(req) {
  try {
    const userAuth = await getUserFromCookies();
    if (userAuth.error) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
      });
    }

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Message id is required" }), {
        status: 400,
      });
    }

    await dbConnect();

    const msg = await Message.findById(id);
    if (!msg) {
      return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 });
    }
    
    // Only the author can delete
    if (String(msg.userId) !== String(userAuth.data.id)) {
      return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403 });
    }

    await msg.deleteOne();

    // Notify clients to remove the message
    await pusherServer.trigger("chat", "delete-message", { _id: id });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(JSON.stringify({ error: "Failed to delete message" }), { status: 500 });
  }
}
