import { destroyAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await destroyAdminSession();
  return NextResponse.json({ ok: true });
}
