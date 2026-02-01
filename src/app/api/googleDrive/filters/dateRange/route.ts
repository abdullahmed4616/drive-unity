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
        fileCreatedTime: true,
      },
      orderBy: {
        fileCreatedTime: "asc",
      },
    });

    if (files.length === 0) {
      return NextResponse.json({
        success: true,
        dateRanges: null,
        totalFiles: 0,
      });
    }

    const oldestDate = files[0].fileCreatedTime;
    const newestDate = files[files.length - 1].fileCreatedTime;

    return NextResponse.json({
      success: true,
      dateRanges: {
        oldest: oldestDate.toISOString().split("T")[0],
        newest: newestDate.toISOString().split("T")[0],
        oldestFormatted: oldestDate.toLocaleDateString(),
        newestFormatted: newestDate.toLocaleDateString(),
      },
      totalFiles: files.length,
    });
  } catch (error) {
    console.error("Failed to fetch date range:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, driveId, startDate, endDate } = body;

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

    if (startDate || endDate) {
      whereClause.fileCreatedTime = {};
      if (startDate) {
        whereClause.fileCreatedTime.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        whereClause.fileCreatedTime.lte = endDateTime;
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
        fileCreatedTime: "desc",
      },
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const groupedByPeriod = {
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      lastMonth: 0,
      older: 0,
    };

    files.forEach((file) => {
      const fileDate = new Date(file.fileCreatedTime);
      if (fileDate >= today) {
        groupedByPeriod.today++;
      } else if (fileDate >= yesterday) {
        groupedByPeriod.yesterday++;
      } else if (fileDate >= lastWeek) {
        groupedByPeriod.lastWeek++;
      } else if (fileDate >= lastMonth) {
        groupedByPeriod.lastMonth++;
      } else {
        groupedByPeriod.older++;
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
      oldestFile: files.length > 0 ? {
        date: files[files.length - 1].fileCreatedTime.toISOString(),
        formatted: files[files.length - 1].fileCreatedTime.toLocaleDateString(),
      } : null,
      newestFile: files.length > 0 ? {
        date: files[0].fileCreatedTime.toISOString(),
        formatted: files[0].fileCreatedTime.toLocaleDateString(),
      } : null,
    };

    return NextResponse.json({
      success: true,
      count: files.length,
      files: files.map((file) => ({
        ...file,
        fileSize: file.fileSize ? Number(file.fileSize) : null,
      })),
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        daysInRange: startDate && endDate
          ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      },
      statistics,
      groupedByPeriod,
      filesByMonth: [],
    });
  } catch (error) {
    console.error("Failed to filter by date range:", error);
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
