import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

interface MetadataResponse {
  status: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
      );
    }

    const userId = session.id;

    const { searchParams } = new URL(request.url);
    const driveId = searchParams.get("driveId");

    if (!driveId) {
      return NextResponse.json(
          { error: "Drive ID is required" },
          { status: 400 }
      );
    }

    const account = await db.googleDriveAccount.findFirst({
      where: {
        id: driveId,
        userId: userId
      },
      select: { id: true }
    });

    if (!account) {
      return NextResponse.json(
          {
            error: "Google Drive account not found",
            details: "No Google Drive account found with this ID for the current user"
          },
          { status: 404 }
      );
    }

    const response = await fetch(
        `${process.env.PYTHON_API_URL}/authenticated/google/drive/metadata/${userId}/${driveId}`,
        {
          method: 'GET',
        }
    );

    if (!response.ok) {
      return NextResponse.json(
          {
            error: "Failed to fetch metadata from Python API",
            details: `Status: ${response.status}`
          },
          { status: response.status }
      );
    }

    const data: MetadataResponse = await response.json();

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Metadata fetch error:", error);

    return NextResponse.json(
        {
          error: "Failed to fetch metadata",
          details: error.message,
        },
        { status: 500 }
    );
  }
}