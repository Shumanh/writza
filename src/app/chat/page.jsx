"use client";
import { ChatPage } from "@/components/chat/chatpage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GetChat() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/message");
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return <ChatPage />;
}