import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL || "http://localhost";

export async function POST(req: Request) {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { title, description, imageUrl, posterId, classId } = await req.json();

        const res = await prismadb.assignment.create({
            data: {
                title: title,
                description: description,
                posterId: posterId,
                posterName: user?.firstName || "User",
                src: imageUrl,
                classId: classId,
                dueDate: new Date("2029-02-01"), // Ensure this date format
            }
        });

        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error CLASSWORK POST", { status: 500 });
    }
}

export async function GET(req: Request) {
    const {userId} = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    const url = new URL(req.url, BASE_URL);
    const classId = url.searchParams.get("classId"); // Get "classId" from query parameters

    try {
     const res = await prismadb.assignment.findMany({
        where: {
            classId: classId?.toString()
        }, select: {
            assignmentId: true,
            title: true,
            description: true,
            posterId: true,
            posterName: true,
            createdAt: true,
            dueDate: true,
            src: true
        }
      })


    return new NextResponse(JSON.stringify(res), {status: 200})
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error ClASSWORK GET", {status: 500});
    }
}