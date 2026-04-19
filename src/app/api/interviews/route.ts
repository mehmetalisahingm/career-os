import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createInterviewSchema } from "@/features/applications/detail-validation";
import { createInterview } from "@/features/applications/service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createInterviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz interview verisi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const interview = await createInterview(session.user.id, parsed.data);
    return NextResponse.json({ success: true, interview }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Interview oluşturulamadı." },
      { status: 400 }
    );
  }
}
