import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
   const { userId } = auth();

   if (!userId) {
    return new NextResponse("Unauthorized", { status: 401})
   }

   try {
    const userData = await prismadb.user.findUnique({
        where: {
            userId
        },
        select: {
            joinedClasses: true
        }
    });

    if (!userData) {
        return new NextResponse("User not found", { status: 404 });
    }

    const classIds = userData.joinedClasses;

    const classesData = await Promise.all(
        classIds.map(async (classId) => {
            return prismadb.class.findUnique({
                where: {
                    classId: classId.toString()
                }
            });
        })
    );

    return new NextResponse(JSON.stringify(classesData), { status: 200 });
   } catch(error) {
    console.error("Error fetching classes:", error);
    return new NextResponse("Internal ERROR GET RECENT", { status: 500 });
   }
}
