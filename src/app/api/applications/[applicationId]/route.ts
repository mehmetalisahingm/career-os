import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { archiveApplication, updateApplicationStatus } from "@/features/applications/service";
import { updateApplicationStatusSchema } from "@/features/applications/validation";

interface RouteContext {
  params: Promise<{ applicationId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateApplicationStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz durum güncellemesi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const application = await updateApplicationStatus(session.user.id, applicationId, parsed.data);
    return NextResponse.json({ success: true, application });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Güncelleme başarısız." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await context.params;

  try {
    const result = await archiveApplication(session.user.id, applicationId);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Arşivleme başarısız." },
      { status: 400 }
    );
  }
}
