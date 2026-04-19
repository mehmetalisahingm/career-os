import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getApplicationsByOwner } from "@/features/applications/queries";
import { createApplication as createApplicationService } from "@/features/applications/service";
import { createApplicationSchema } from "@/features/applications/validation";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const applications = await getApplicationsByOwner(session.user.id);
  return NextResponse.json({ success: true, applications });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz başvuru verisi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const application = await createApplicationService(session.user.id, parsed.data);
    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Başvuru oluşturulamadı.",
      },
      { status: 400 }
    );
  }
}
