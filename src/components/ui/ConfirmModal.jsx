"use client";

import React from "react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700 text-white",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={loading ? undefined : onCancel} />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="px-5 py-4 text-gray-600">
          <p>{description}</p>
        </div>
        <div className="px-5 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md ${confirmButtonClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
