import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadDir, { recursive: true });
  const fullPath = path.join(uploadDir, filename);
  await writeFile(fullPath, buffer);

  return NextResponse.json({
    filename,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    path: `uploads/${filename}`
  }, { status: 201 });
}
