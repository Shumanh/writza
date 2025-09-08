
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Missing BLOB_READ_WRITE_TOKEN", { status: 401 });
  }
  const file = req.body || "";
  const filename = req.headers.get("x-vercel-filename") || "file.bin";
  const contentType = req.headers.get("content-type") || "application/octet-stream";
  const blob = await put(filename, file, { contentType, access: "public" });
  return NextResponse.json(blob);
}