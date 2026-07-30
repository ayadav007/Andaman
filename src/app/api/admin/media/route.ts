import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }
    const alt = String(form.get("alt") || file.name);
    const saved = await saveUploadedFile(file);
    const media = await prisma.media.create({
      data: {
        filename: saved.filename,
        url: saved.url,
        alt,
      },
    });
    return NextResponse.json({ ok: true, media });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await req.json();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ ok: false }, { status: 404 });
  try {
    await unlink(path.join(process.cwd(), "public", media.url.replace(/^\//, "")));
  } catch {
    // file may already be gone
  }
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
