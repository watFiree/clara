import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { isUpdateSettingsBody } from "@/lib/types/settings";

export async function GET() {
  try {

    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {

    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const body = await req.json();

    if (!isUpdateSettingsBody(body)) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 },
      );
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...body },
      update: body,
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
