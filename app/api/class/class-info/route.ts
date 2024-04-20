import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Use an environment variable to determine the base URL
const BASE_URL = process.env.BASE_URL || "http://localhost";

export async function GET(req: Request) {
  try {
    // Use the environment variable to construct the full URL
    const url = new URL(req.url, BASE_URL);
    const classId = url.searchParams.get("classId"); // Get "classId" from query parameters

    if (!classId) {
      return new NextResponse("No Class Id Found", { status: 400 });
    }

    const classInfo = await prismadb.class.findUnique({
      where: {
        classId: classId.toString(),
      },
      select: {
        teacherId: true,
        teacherName: true,
        className: true,
        classSubject: true,
      },
    });

    if (!classInfo) {
      return new NextResponse("Class not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(classInfo), { status: 200 });
  } catch (error) {
    console.error("Error fetching class information:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
