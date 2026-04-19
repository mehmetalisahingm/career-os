import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getCompaniesByOwner } from "@/features/applications/queries";
import { createCompany as createCompanyService } from "@/features/applications/service";
import { createCompanySchema } from "@/features/applications/validation";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const companies = await getCompaniesByOwner(session.user.id);
  return NextResponse.json({ success: true, companies });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createCompanySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz şirket verisi.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const company = await createCompanyService(session.user.id, parsed.data);
    return NextResponse.json({ success: true, company }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Şirket oluşturulamadı.",
      },
      { status: 400 }
    );
  }
}
