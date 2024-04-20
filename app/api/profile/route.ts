import prismadb from "@/lib/prismadb";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//PATCH
export async function PATCH(req: Request, res: Response) {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { inputValue, updatedRole } = await req.json();

        if (!inputValue || !updatedRole) {
            return new NextResponse(`Name and role are required ${inputValue} ${updatedRole}`, { status: 400 });
        }

        await prismadb.user.update({
            where: { userId },
            data: { userName: inputValue.toString(), role: updatedRole.toString() }
        });

        const params = { firstName: inputValue };

        await clerkClient.users.updateUser(userId, params);
        

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.error("Internal Error PATCH:", error); // Log error
        return new NextResponse("Internal Error PATCH", { status: 500 });
    }
}


//DELETE 
interface ClassItem {
    classId: string;
}

export async function DELETE(req: Request, res: Response) {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prismadb.user.delete({
            where: {
                userId: userId
            }
        });

        const teacherClasses: ClassItem[] = await prismadb.class.findMany({
            where: {
                teacherId: userId
            },
            select: {
                classId: true
            }
        });

        if (teacherClasses.length === 0) {
            return new NextResponse("No classes found for the teacher", { status: 404 });
        }

        const classIds = teacherClasses.map(classItem => classItem.classId);

        await prismadb.class.deleteMany({
            where: {
                classId: {
                    in: classIds
                }
            }
        });

        await prismadb.student.deleteMany({
            where: {
                classId: {
                    in: classIds
                }
            }
        });

        return new NextResponse(`Success ${classIds}`, { status: 200 });
    } catch (error) {
        console.error("Internal Error DELETE:", error);
        return new NextResponse(`Internal Error DELETE`, { status: 500 });
    }
}
