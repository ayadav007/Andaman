import { createAdminSession, verifyAdminPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!verifyAdminPassword(String(password || ""))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
