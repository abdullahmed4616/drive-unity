import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, driveId, minSize, maxSize } = body;

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

    const whereClause: any = {
      userId: userId,
      googleDriveAccountId: driveId,
    };

    if (minSize !== undefined || maxSize !== undefined) {
      whereClause.fileSize = {};
      if (minSize !== undefined) {
        whereClause.fileSize.gte = BigInt(minSize);
      }
      if (maxSize !== undefined) {
        whereClause.fileSize.lte = BigInt(maxSize);
      }
    }

    const files = await db.googleDriveFile.findMany({
      where: whereClause,
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
        fileSize: "desc",
      },
    });

    const sizeDistribution = {
      tiny: 0,    // < 1MB
      small: 0,   // 1MB - 10MB
      medium: 0,  // 10MB - 100MB
      large: 0,   // 100MB - 1GB
      huge: 0,    // > 1GB
    };

    files.forEach((file) => {
      const size = Number(file.fileSize || 0);
      if (size < 1024 * 1024) {
        sizeDistribution.tiny++;
      } else if (size < 10 * 1024 * 1024) {
        sizeDistribution.small++;
      } else if (size < 100 * 1024 * 1024) {
        sizeDistribution.medium++;
      } else if (size < 1024 * 1024 * 1024) {
        sizeDistribution.large++;
      } else {
        sizeDistribution.huge++;
      }
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
      count: files.length,
      files: files.map((file) => ({
        ...file,
        fileSize: file.fileSize ? Number(file.fileSize) : null,
      })),
      filter: {
        minSize: minSize || null,
        maxSize: maxSize || null,
        minSizeFormatted: minSize ? formatFileSize(minSize) : null,
        maxSizeFormatted: maxSize ? formatFileSize(maxSize) : null,
      },
      statistics,
      sizeDistribution,
    });
  } catch (error) {
    console.error("Failed to filter by file size:", error);
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
