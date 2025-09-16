"use client";
import React, { useState, useEffect } from "react";

export default function TagsModal({
  open,
  initialTags = "",
  onConfirm,
  onCancel,
  loading = false,
  title = "Add tags",
  description = "Add comma-separated tags to help people discover your post.",
}) {
  const [value, setValue] = useState(initialTags || "");

  useEffect(() => {
    setValue(initialTags || "");
  }, [initialTags, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={loading ? undefined : onCancel} />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="px-5 py-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            placeholder="e.g. react, nextjs, tips"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <p className="text-xs text-gray-500 mt-2">Separate multiple tags with commas. Keep it short and relevant.</p>
        </div>
        <div className="px-5 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(value.trim())}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
