"use client";
import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";

export function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
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
        
        // Persisted clear timestamp per user
        let filtered = Array.isArray(data.messages) ? data.messages : [];
        if (data.currentUser) {
          try {
            const key = `chatClearedAt:${data.currentUser.id}`;
            const ts = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
            if (ts) {
              const clearedAt = new Date(ts).getTime();
              if (!Number.isNaN(clearedAt)) {
                filtered = filtered.filter((m) => {
                  const mt = new Date(m.timestamp).getTime();
                  return Number.isFinite(mt) ? mt > clearedAt : true;
                });
              }
            }
          } catch (_e) {}
        }

        setMessages(filtered);
        if (data.currentUser) setCurrentUser(data.currentUser);
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

    channel.bind("delete-message", (data) => {
      if (!data?._id) return;
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== data._id));
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

  const deleteMessage = async (id) => {
    try {
      const res = await fetch('/api/message', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.error || 'Failed to delete message');
      }
    } catch (e) {
      setError('Failed to delete message');
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
    <div className="min-h-screen grid place-items-center px-4 py-8">
      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-5 py-3 sm:py-4 text-white">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
              C
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base font-semibold leading-5 truncate">Community Chat</h1>
              <p className="text-xs text-white/80 hidden sm:block">Connect with the community in real-time</p>
            </div>
          </div>
          
          {/* Mobile Actions */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-md bg-white/15 px-2 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              title="Go to Home"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  const key = currentUser ? `chatClearedAt:${currentUser.id}` : 'chatClearedAt';
                  window.localStorage.setItem(key, new Date().toISOString());
                } catch (_e) {}
                setMessages([]);
              }}
              className="rounded-md bg-white/15 px-2 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              title="Clear chat (local)"
            >
              Clear
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              title="Go to Home"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  const key = currentUser ? `chatClearedAt:${currentUser.id}` : 'chatClearedAt';
                  window.localStorage.setItem(key, new Date().toISOString());
                } catch (_e) {}
                setMessages([]);
              }}
              className="rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              title="Clear chat (local)"
            >
              Clear
            </button>
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                  {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium">{currentUser.username}</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[450px] sm:h-[540px] overflow-y-auto bg-gray-50 px-3 py-4 sm:px-5" id="messages-scroll-container" onClick={() => setSelectedMessageId(null)}>
          {messages.length === 0 ? (
            <div className="mt-20 text-center text-gray-500">
              <p>No messages yet. Be the first to say hi 👋</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, i) => {
                const isMine = currentUser && (m.userId?.toString?.() === currentUser.id);
                const thisId = m._id || m.id || String(i);
                const isSelected = isMine && selectedMessageId === thisId;
                return (
                  <div key={thisId} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] sm:max-w-[85%] md:max-w-[70%] items-end gap-2`}>
                      {!isMine && (
                        <div className="hidden h-8 w-8 select-none items-center justify-center rounded-full bg-blue-500 text-white sm:flex">
                          {m.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div
                        className={`group rounded-2xl px-3 py-2 shadow-sm cursor-pointer touch-manipulation ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 border rounded-bl-none'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMine) {
                            setSelectedMessageId((prev) => (prev === thisId ? null : thisId));
                          }
                        }}
                      >
                        <div className="mb-0.5 flex items-baseline gap-2">
                          {!isMine && (
                            <span className="text-xs font-medium text-gray-700">{m.username}</span>
                          )}
                          <span className={`text-[10px] ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>{formatTimestamp(m.timestamp)}</span>
                          {isSelected && (
                            <button
                              type="button"
                              onClick={() => deleteMessage(thisId)}
                              className={`ml-1 sm:ml-2 inline-block rounded px-1.5 sm:px-2 py-0.5 text-[10px] font-medium transition ${isMine ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                              aria-label="Delete message"
                              title="Delete"
                            >
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">×</span>
                            </button>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.message}</p>
                      </div>
                      {isMine && (
                        <div className="hidden h-8 w-8 select-none items-center justify-center rounded-full bg-blue-600 text-white sm:flex">
                          {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="border-t border-red-200 bg-red-50 px-5 py-2">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 border-t bg-white/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70 sm:px-5">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-3 pr-12 text-gray-900 placeholder-gray-500 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Type a message…"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '160px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="absolute bottom-2 right-2 inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                aria-label="Send"
              >
                Send
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Press Enter to send • Shift+Enter for newline</p>
        </div>
      </div>
    </div>
    </div>
  );
}
