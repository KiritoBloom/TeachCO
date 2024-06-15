import prismadb from "@/lib/prismadb";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

//PATCH
export async function PATCH(req: Request) {
    const { userId } = auth();
  
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const { inputValue, updatedRole } = await req.json();
  
      if (!inputValue && !updatedRole) {
        return new NextResponse("Name and role are required", { status: 400 });
      }
  
      // Fetch current user data from the database
      const existingUser = await prismadb.user.findUnique({
        where: { userId }
      });
  
      if (!existingUser) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      // Merge provided data with existing data
      const newUserName = inputValue ? inputValue.toString() : existingUser.userName;
      const newUserRole = updatedRole ? updatedRole.toString() : existingUser.role;
  
      await prismadb.user.update({
        where: { userId },
        data: { userName: newUserName, role: newUserRole }
      });
  
      const params = { firstName: newUserName };
  
      await clerkClient.users.updateUser(userId, params);
  
      return new NextResponse("Success", { status: 200 });
    } catch (error) {
      console.error("Internal Error PATCH:", error);
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
      const { userId } = auth();

      if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
      }

      const teacherClasses: ClassItem[] = await prismadb.class.findMany({
          where: {
              teacherId: userId
          },
          select: {
              classId: true
          }
      });

      const classIds = teacherClasses.map(classItem => classItem.classId);

      await Promise.all([
          prismadb.assignment.deleteMany({
              where: {
                  classId: {
                      in: classIds
                  }
              }
          }),
          prismadb.post.deleteMany({
              where: {
                  classId: {
                      in: classIds
                  }
              }
          }),
          prismadb.class.deleteMany({
              where: {
                  classId: {
                      in: classIds
                  }
              }
          }),
          prismadb.student.deleteMany({
              where: {
                  classId: {
                      in: classIds
                  }
              }
          }),
          prismadb.user.delete({
              where: {
                  userId: userId
              }
          })
      ]);

      return new NextResponse(`Success ${classIds}`, { status: 200 });
  } catch (error) {
      console.error("Internal Error DELETE:", error);
      return new NextResponse(`Internal Error DELETE`, { status: 500 });
  }
}