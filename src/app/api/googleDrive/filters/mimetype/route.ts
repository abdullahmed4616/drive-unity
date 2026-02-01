import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const driveId = searchParams.get("driveId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!driveId) {
      return NextResponse.json(
        { success: false, message: "Drive ID is required" },
        { status: 400 }
      );
    }

    const files = await db.googleDriveFile.findMany({
      where: {
        userId: userId,
        googleDriveAccountId: driveId,
      },
      select: {
        mimeType: true,
      },
      distinct: ["mimeType"],
    });

    const mimeTypeMap = new Map<string, { value: string; label: string; category: string }>();

    files.forEach((file) => {
      if (!mimeTypeMap.has(file.mimeType)) {
        const label = getMimeTypeLabel(file.mimeType);
        const category = getMimeTypeCategory(file.mimeType);
        
        mimeTypeMap.set(file.mimeType, {
          value: file.mimeType,
          label: label,
          category: category,
        });
      }
    });

    const mimeTypes = Array.from(mimeTypeMap.values());

    const groupedByCategory = mimeTypes.reduce((acc, mt) => {
      if (!acc[mt.category]) {
        acc[mt.category] = [];
      }
      acc[mt.category].push(mt);
      return acc;
    }, {} as Record<string, typeof mimeTypes>);

    return NextResponse.json({
      success: true,
      mimeTypes: mimeTypes,
      groupedByCategory: groupedByCategory,
      totalTypes: mimeTypes.length,
    });
  } catch (error) {
    console.error("Failed to fetch MIME types:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getMimeTypeLabel(mimeType: string): string {
  const parts = mimeType.split("/");
  const subType = parts[1] || "";

  if (mimeType.includes("google-apps.document")) return "Google Doc";
  if (mimeType.includes("google-apps.spreadsheet")) return "Google Sheet";
  if (mimeType.includes("google-apps.presentation")) return "Google Slides";
  if (mimeType.includes("google-apps.folder")) return "Folder";

  if (mimeType.includes("pdf")) return "PDF";
  if (subType.includes("word")) return "Word";
  if (subType.includes("excel")) return "Excel";
  if (subType.includes("powerpoint")) return "PowerPoint";

  return subType.toUpperCase().replace(/[^a-zA-Z0-9]/g, " ");
}

function getMimeTypeCategory(mimeType: string): string {
  if (mimeType.includes("image")) return "Images";
  if (mimeType.includes("video")) return "Videos";
  if (mimeType.includes("audio")) return "Audio";
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("word")) return "Documents";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "Spreadsheets";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "Presentations";
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("compressed")) return "Archives";
  if (mimeType.includes("text")) return "Text Files";
  return "Other";
}
