import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locale } = await req.json();
  const value = locale === "hi" ? "hi" : "en";
  const res = NextResponse.json({ ok: true, locale: value });
  res.cookies.set("ae_lang", value, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
