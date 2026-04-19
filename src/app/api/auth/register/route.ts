import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signUpSchema } from "@/features/auth/validation";
import { hashPassword } from "@/lib/password";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "local";
  const rateLimit = enforceRateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { success: false, message: "Çok fazla kayıt denemesi. Lütfen biraz sonra tekrar dene." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Geçersiz kayıt verisi.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { email, name, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Bu e-posta zaten kullanımda.",
      },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  return NextResponse.json(
    {
      success: true,
      message: "Kayıt başarılı.",
      user: newUser,
    },
    { status: 201 }
  );
}
