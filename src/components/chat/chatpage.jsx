"use client";
import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";

export function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Load existing messages and check authentication
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("/api/message");
        const data = await response.json();
        
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [router]);

  // Set up Pusher for real-time updates
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    });

    const channel = pusher.subscribe("chat");

    channel.bind("new-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        setError(data.error || "Failed to send message");
        return;
      }

      setText("");
      setError("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // Today: show only time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Other days: show date and time
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">Community Chat</h1>
          <p className="text-blue-100 text-sm">Welcome to the group chat! Connect with other users in real-time.</p>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Be the first to start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={m._id || i} className="flex items-start space-x-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {m.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{m.username}</span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(m.timestamp)}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <p className="text-gray-800 whitespace-pre-wrap break-words">{m.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-colors duration-200"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
