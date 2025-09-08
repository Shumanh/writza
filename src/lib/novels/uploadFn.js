import { createImageUpload } from "novel";

const onUpload = async (file) => {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  });
  if (res.status === 200) {
    const { url } = await res.json();
    return url;
  }
  if (res.status === 401) return file; // fallback: local read
  throw new Error("Upload failed");
};

export const uploadFn = createImageUpload({ onUpload });