import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "No session found",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Sync failed",
      },
      { status: 500 }
    );
  }
}
