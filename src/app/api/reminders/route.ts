import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createReminderSchema } from "@/features/applications/detail-validation";
import { createReminder } from "@/features/applications/service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createReminderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz reminder verisi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const reminder = await createReminder(session.user.id, parsed.data);
    return NextResponse.json({ success: true, reminder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Reminder oluşturulamadı." },
      { status: 400 }
    );
  }
}
