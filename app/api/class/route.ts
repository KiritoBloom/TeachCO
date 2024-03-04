import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//POST REQUEST
export async function POST(req: Request, res: Response) {
    const { userId } = auth();

    try {
        // Assuming className, subject, and classId are properties of the JSON payload
        const { className, subject, classId } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the classId already exists in the database
        const existingClass = await prismadb.class.findUnique({
            where: { classId: classId.toString() },
        });

        if (existingClass) {
            // If the classId exists, return an error response
            return new NextResponse("Class ID already exists", { status: 400 });
        }

        // Create the class if the classId doesn't exist
        await prismadb.class.create({
            data: {
                className: className.toString(),
                classSubject: subject.toString(),
                classId: classId.toString(),
                teacherId: userId,
            },
        });

        return new NextResponse("Class Created", { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
