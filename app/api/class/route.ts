import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//POST REQUEST
export async function POST(req: Request, res: Response) {
    const { userId } = await auth();
    const user = await currentUser();

    try {
        const userName = user?.firstName || "User"; 
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
                teacherName: userName
            },
        });

        return new NextResponse("Class Created", { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request, res: Response) {
    const {userId} = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401});
    }

    try {
        const res = await prismadb.class.findMany({
            where: {
               teacherId: userId.toString()
            },
            select: {
               className: true,
               classSubject: true,
               classId: true,
               teacherName: true
            }
           })
           
           console.log(JSON.stringify(res));

           return new NextResponse(`Success ${JSON.stringify(res)}`, { status: 200 });

} catch(error) {
     return new NextResponse("Internal Error", {status: 500})
}
}

export async function DELETE(req: Request, res: Response) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    

    try {
        const { classId } = await req.json(); // Retrieve classId from request body

        const teacher = await prismadb.class.findUnique({
            where: {
                classId
            }, select: {
                teacherId: true
            }
        })

        if (userId !== teacher?.teacherId) {
            return new NextResponse("User is not teacher", {status: 400})
        }
        
        // Retrieve the class to be deleted
        const classToDelete = await prismadb.class.findUnique({
            where: {
                classId: classId.toString(),
            },
            include: {
                students: true, // Include associated students
            },
        });

        if (!classToDelete) {
            return new NextResponse("Class not found", { status: 404 });
        }

        // Delete associated students
        for (const student of classToDelete.students) {
            await prismadb.student.delete({
                where: {
                    id: student.id,
                },
            });
        }

        // Find users who have joined any classes
        const usersToUpdate = await prismadb.user.findMany({
            where: {
                joinedClasses: {
                    hasSome: [],
                },
            },
        });

        // Update each user to remove the classId from joinedClasses array
        await Promise.all(usersToUpdate.map(async (user) => {
            const updatedJoinedClasses = user.joinedClasses.filter(id => id !== classId.toString());
            await prismadb.user.update({
                where: {
                    userId: user.userId,
                },
                data: {
                    joinedClasses: updatedJoinedClasses,
                },
            });
        }));

        // Finally, delete the class
        await prismadb.class.delete({
            where: {
                classId: classId.toString(),
            },
        });
        
        return new NextResponse(`Class Deleted ${teacher?.teacherId}`, { status: 200 });
    } catch(error) {
        console.error(error, "DELETE Internal Error");
        return new NextResponse("Internal Error DELETE", { status: 500 });
    }
}

