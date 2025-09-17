import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Run this route in the Node runtime. The `@vercel/blob` package uses
// code patterns that are disallowed in the Edge runtime (e.g. code
// generation from strings). Explicitly set `nodejs` so uploads work
// correctly in local and deployed server runtimes.
export const runtime = "nodejs";

export async function POST(req) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.", {
      status: 401,
    });
  }

  // Read body as ArrayBuffer (edge runtime). If body is empty, return 400.
  let file;
  try {
    // If the request has a body stream, use arrayBuffer(); otherwise fallback to empty
    const ab = await req.arrayBuffer?.();
    if (!ab || ab.byteLength === 0) {
      return new Response("No file uploaded", { status: 400 });
    }
    file = new Uint8Array(ab);
  } catch (err) {
    return new Response("Failed to read request body: " + String(err), { status: 400 });
  }

  const filename = req.headers.get("x-vercel-filename") || "file";
  const contentType = req.headers.get("content-type") || "application/octet-stream";
  const fileType = contentType.includes("/") ? `.${contentType.split("/")[1]}` : "";

  // construct final filename based on content-type if not provided
  const finalName = filename.includes(fileType) ? filename : `${filename}${fileType}`;

  try {
    // Use addRandomSuffix to avoid "blob already exists" errors.
    const blob = await put(finalName, file, {
      contentType,
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (err) {
    // If Vercel Blob returns that the blob exists, surface a helpful message
    const msg = err && err.message ? err.message : String(err);
    return new Response(JSON.stringify({ error: "Upload failed", detail: msg }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
