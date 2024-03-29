import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const classIdWithQueryParams = req.url; // Get the entire URL including query parameters
        const classIdMatch = classIdWithQueryParams.match(/\d+$/); // Extract numbers from the end of the string

        console.log("Received classId:", classIdMatch?.[0]);

        if (!classIdMatch) {
            return new NextResponse(`No Class Id Found ${classIdMatch}`, { status: 400 });
        }

        const classId = classIdMatch[0]; // Extracted classId

        const classInfo = await prismadb.class.findUnique({
            where: {
                classId: classId.toString(), // Ensure classId is a string
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

        console.log("Class Info:", classInfo);

        return new NextResponse(JSON.stringify(classInfo), { status: 200 });
    } catch (error) {
        console.error("Error fetching class information:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
