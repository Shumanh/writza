"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

export function DeleteBlogs({ id }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true); // open by default on delete page
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/blogs/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Blog deleted successfully!");
        // Redirect to view blogs after short delay
        setTimeout(() => router.push("/blogs/view"), 900);
      } else {
        setMessage(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("An error occurred while deleting the blog");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ConfirmModal
        open={open}
        title="Delete this blog?"
        description="This action cannot be undone. The blog will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Fallback message area */}
      {message && (
        <div className="mt-4 text-center text-sm text-gray-600">{message}</div>
      )}
    </div>
  );
}
