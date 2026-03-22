import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { COOKIE_NAME } from "@/config";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    return NextResponse.json({
      user: { id: user.id, authProvider: user.authProvider },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const user = await getOrCreateUser();

    await prisma.user.delete({ where: { id: user.id } });

    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
