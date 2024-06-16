
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";


import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL || "http://localhost";

export async function GET(req: Request, res: Response) {
   const { userId } = auth();

   const url = new URL(req.url, BASE_URL);
   const role = url.searchParams.get("role"); // Get "Role" from query parameters

   if (!userId) {
    return new NextResponse("Unauthorized", { status: 401})
   }

   try {

    if (role === "Teacher") {
        const userData = await prismadb.class.findMany({
            where: {
              teacherId: userId,
            },
            select: {
              classId: true
            }
          });
          
          if (!userData || userData.length === 0) {
            return new NextResponse("No Created Classes Found", {status: 404});
          }
          
          const classesData = await Promise.all(
            userData.map(async (classItem) => {
              return prismadb.class.findUnique({
                where: {
                  classId: classItem.classId.toString()
                }
              });
            })
          );
          
          return new NextResponse(JSON.stringify(classesData), {status: 200});
          
    } else {
        const userData = await prismadb.user.findUnique({
            where: {
                userId
            },
            select: {
                joinedClasses: true
            }
        });
    
        if (!userData) {
            return new NextResponse("No Joined Classes Found", { status: 404 });
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
    }
   } catch(error) {
    console.error("Error fetching classes:", error);
    return new NextResponse("Internal ERROR GET RECENT", { status: 500 });
   }
}
