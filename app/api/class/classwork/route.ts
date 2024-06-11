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

export async function PATCH(req: Request) {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { classId, posterId, updateTitle, updatedDesc, updateSrc, assignmentId } = await req.json();

        if (!assignmentId) {
            console.log("No Id found");
            return new NextResponse("Bad Request: No Id found", { status: 400 });
        }

        // Fetch the existing assignment from the database
        const existingAssignment = await prismadb.assignment.findUnique({
            where: { assignmentId },
        });

        if (!existingAssignment) {
            return new NextResponse("Assignment not found", { status: 404 });
        }

        // Prepare the update data, using existing values as defaults
        const data = {
            ...(updateTitle && { title: updateTitle }),
            ...(updatedDesc && { description: updatedDesc }),
            ...(updateSrc && { src: updateSrc }),
        };

        // Perform the update
        await prismadb.assignment.update({
            where: {
                assignmentId,
                classId,
                posterId,
            },
            data,
        });

        return new NextResponse("Assignment updated successfully", { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error CLASSWORK PATCH", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const {userId} = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    try {
        const {posterId, classId, assignmentId} = await req.json();

        if (posterId !== userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!classId) {
            return new NextResponse("No classId found", {status: 404})
        }

        if (!assignmentId) {
            return new NextResponse("No assignmentId found", {status: 404})
        }

        await prismadb.assignment.delete({
            where: {
                classId,
                assignmentId,
                posterId
            }
        })

        return new NextResponse("Assignment deleted", {status: 200})
    }
    catch (error) {
        console.log(error);
        return new NextResponse("Internal Error CLASSWORK DELETE")
    }
}