import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: false,
    message: "Manual replies are copy/paste only in v1. No Meta send API is connected.",
  }, { status: 501 });
}
