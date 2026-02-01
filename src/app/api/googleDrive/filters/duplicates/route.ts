import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


function serializeBigInt<T>(data: T): T {
  return JSON.parse(
      JSON.stringify(data, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
      )
  );
}


export async function POST(request: NextRequest) {
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
        md5Checksum: { not: null },
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
    });

    const checksumMap = new Map<string, typeof files>();

    files.forEach((file) => {
      if (file.md5Checksum) {
        if (!checksumMap.has(file.md5Checksum)) {
          checksumMap.set(file.md5Checksum, []);
        }
        checksumMap.get(file.md5Checksum)!.push(file);
      }
    });

    const duplicateGroups = Array.from(checksumMap.entries())
        .filter(([_, groupFiles]) => groupFiles.length > 1)
        .map(([checksum, groupFiles]) => ({
          md5Checksum: checksum,
          count: groupFiles.length,
          files: groupFiles,
        }));

    const duplicateFiles = duplicateGroups.flatMap((group) => group.files);

    const totalSavingsBytes = duplicateGroups.reduce((total, group) => {
      const filesToDelete = group.files.slice(1);
      const groupSavings = filesToDelete.reduce((sum, file) => {
        return sum + (file.fileSize ? Number(file.fileSize) : 0);
      }, 0);
      return total + groupSavings;
    }, 0);

    const totalSavingsGB = totalSavingsBytes / (1024 * 1024 * 1024);

    const safeDuplicateFiles = serializeBigInt(duplicateFiles);
    const safeDuplicateGroups = serializeBigInt(duplicateGroups);

    return NextResponse.json({
      success: true,
      data: safeDuplicateFiles,
      count: safeDuplicateFiles.length,
      duplicateGroups: safeDuplicateGroups,
      totalSavingsGB: Number(totalSavingsGB.toFixed(2)),
      totalSavingsBytes: totalSavingsBytes,
    });
  } catch (error) {
    console.error("Failed to check duplicates:", error);
    return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
    );
  }
}