import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";


import { NextResponse } from "next/server";

// Use an environment variable to determine the base URL
const BASE_URL = process.env.BASE_URL || "http://localhost";

export async function GET(req: Request) {
  const {userId} = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", {status: 401})
  }

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

export async function PATCH(req: Request) {
  const {userId} = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", {status: 401})
  }
  
  try{
    const url = new URL(req.url, BASE_URL);
    const classId = url.searchParams.get("classId"); // Get "classId" from query parameters

    if (!classId) {
      return new NextResponse("No Class Id Found", { status: 400 });
    }

    const {classSubject, className, teacherId} = await req.json();

    if (userId !== teacherId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    if (!classSubject) {
      await prismadb.class.update({
        where: {
          classId: classId
        }, data: {
          className: className
        }
      })
    } else if (!className) {
      await prismadb.class.update({
        where: {
          classId: classId
        }, data: {
          classSubject: classSubject
        }
      })
    } else {
    await prismadb.class.update({
      where: {
        classId: classId
      }, data: {
        classSubject: classSubject,
        className: className
      }
    })
  }

    return new NextResponse("Class Updated", {status: 200});
  }catch(error) {
    console.error("Error updating class information:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}