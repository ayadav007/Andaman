import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function saveUploadedFile(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Only image uploads are allowed (jpg, png, webp, gif, svg).");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large (max 8MB).");
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/gif"
            ? "gif"
            : "svg";

  const filename = `${Date.now()}-${nanoid(8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return {
    filename,
    url: `/uploads/${filename}`,
  };
}
