import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, driveId, query } = body;

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

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Search query is required" },
        { status: 400 }
      );
    }

    const searchTerms = query.toLowerCase().split(" ").filter((term: string) => term.length > 0);

    const files = await db.googleDriveFile.findMany({
      where: {
        userId: userId,
        googleDriveAccountId: driveId,
        OR: [
          { fileName: { contains: query, mode: "insensitive" } },
          { mimeType: { contains: query, mode: "insensitive" } },
          { filePath: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        fileId: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        fileCreatedTime: true,
        viewedByMeTime: true,
        filePath: true,
        webViewLink: true,
        thumbnailLink: true,
        md5Checksum: true,
        userId: true,
        updatedAt: true,
      },
      orderBy: {
        fileCreatedTime: "desc",
      },
    });

    const totalSize = files.reduce((sum, file) => sum + Number(file.fileSize || 0), 0);
    const averageSize = files.length > 0 ? totalSize / files.length : 0;

    const statistics = {
      totalFiles: files.length,
      totalSize: totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      averageSize: averageSize,
      averageSizeFormatted: formatFileSize(averageSize),
    };

    return NextResponse.json({
      success: true,
      query: query,
      count: files.length,
      files: files.map((file) => ({
        ...file,
        fileSize: file.fileSize ? Number(file.fileSize) : null,
      })),
      suggestions: null,
      statistics,
      searchInfo: {
        searchTerms: searchTerms,
        matchedTerms: searchTerms.length,
        hasExactMatch: true,
        topScore: 1.0,
      },
    });
  } catch (error) {
    console.error("Failed to perform smart search:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
