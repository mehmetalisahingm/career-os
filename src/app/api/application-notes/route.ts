import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createNoteSchema } from "@/features/applications/detail-validation";
import { createNote } from "@/features/applications/service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz not verisi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const note = await createNote(session.user.id, parsed.data);
    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Not oluşturulamadı." },
      { status: 400 }
    );
  }
}
