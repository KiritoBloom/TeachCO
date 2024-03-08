import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const { userId } = auth();
    const user = await currentUser();
  
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const { classId } = await req.json();
      const userName = user?.firstName || "User";
      const userIdValue = userId;
  
      const existingClass = await prismadb.class.findUnique({
        where: {
          classId: classId.toString(),
        },
        include: {
          students: true,
        },
      });
  
      if (!existingClass) {
        console.error("Class not found");
        return new NextResponse("Class not found", { status: 404 });
      }
  
      const updatedClass = await prismadb.class.update({
        where: {
          classId: classId.toString(),
        },
        data: {
          students: {
            create: [
              {
                name: userName.toString(),
                id: userIdValue.toString(),
              },
            ],
          },
        },
      });
  
      const updatedUser = await prismadb.user.update({
        where: {
          userId: userIdValue,
        },
        data: {
          joinedClasses: {
            // Use the array spread operator to add the new classId to the existing joinedClasses array
            set: [classId.toString()],
          },
        },
      });
  
      console.log("Class updated successfully with new student", updatedClass);
      console.log("User updated successfully with joined class", updatedUser);
  
      return new NextResponse(`Success`, { status: 200 });
    } catch (error) {
      console.error("Error updating class:", error);
      return new NextResponse("Internal Error POST", { status: 500 });
    }
  }
  

  export async function GET(req: Request, res: Response) {
    const { userId } = await auth();
  
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const joinedClasses = await prismadb.user
        .findUnique({
          where: {
            userId: userId,
          },
          select: {
            joinedClasses: true,
          },
        })
        .then((user) => {
          return user?.joinedClasses || [];
        });
  
      const classes = await prismadb.class.findMany({
        where: {
          classId: {
            in: joinedClasses,
          },
        },
      });
  
      console.log("Joined classes:", classes);
  
      return new NextResponse(JSON.stringify(classes), { status: 200 });
    } catch (error) {
      console.error("Error retrieving joined classes:", error);
      return new NextResponse("Internal Error GET", { status: 500 });
    }
  }
  