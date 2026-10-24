import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  // ضع هنا منطق تحليل السيرة الذاتية
  return NextResponse.json({ ok: true, received: body });
}

