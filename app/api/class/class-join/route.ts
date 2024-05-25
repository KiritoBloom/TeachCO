import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const {userId} = auth();
  const user = await currentUser();
  
  if (!userId) {
    return new NextResponse("Unauthorized", {status: 401})
  }

  try {
    const {classId} = await req.json();
    const userName = user?.firstName || "User";
    
    if (!classId) {
      return new NextResponse("Class Id Not found", {status: 404})
    }

    const generateUniqueId = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let uniqueId = '';
    
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueId += characters.charAt(randomIndex);
      }
    
      return uniqueId;
    };

    const uniqueId = generateUniqueId();

    const isClassFound = await prismadb.class.findUnique({
      where: {
        classId: classId
      }
    })

    if (!isClassFound) {
      return new NextResponse("Class is not found", {status: 404})
    }
    
    const isStudentInClass = await prismadb.student.findFirst({
      where: {
        userId: userId,
        classId: classId
      },
      select: {
        classId: true,
      }
    });
    
    if (isStudentInClass && isStudentInClass.classId === classId) {
      return new NextResponse("User has already joined this class", { status: 500 });
    }
    
    await prismadb.student.create({
      data: {
        name: userName.toString(),
        id: uniqueId,
        userId: userId.toString(),
        classId: classId.toString(),
      },
    })

    const updatedUser = await prismadb.user.update({
      where: {
        userId: userId?.toString()
      }, 
      data: {
          joinedClasses: {
            push: classId.toString() 
          }
      }
    })



    return new NextResponse(`Success`, { status: 200 });
  } catch(error) {
    console.error("Error:", error);
    return new NextResponse("Internal Error POST", {status: 500})
  }
}


export async function GET(req: Request, res: Response) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prismadb.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        role: true,
        userId: true,
        userName: true,
        userEmail: true,
        joinedClasses: true,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", {status: 400})
    }

    const joinedClasses = user?.joinedClasses || [];

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

export async function DELETE(req: Request, res: Response) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { classId } = await req.json();

    if (!classId) {
      return new NextResponse("No Class Id", { status: 404 });
    }

    const student = await prismadb.student.findFirst({
      where: {
        userId: userId,
        classId: classId
      }, 
      select: {
        id: true
      }
    });

    if (!student) {
      return new NextResponse("Student not found", { status: 404 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        userId: userId
      }, 
      select: {
        joinedClasses: true,
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Remove the classId from joinedClasses array
    const updatedJoinedClasses = user.joinedClasses.filter((id: string) => id !== classId);

    // Update the user's joinedClasses in the database
    await prismadb.user.update({
      where: {
        userId: userId
      },
      data: {
        joinedClasses: updatedJoinedClasses
      }
    });

    await prismadb.student.delete({
      where: {
        id: student?.id
      }
    })

    return new NextResponse("Class left successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error DELETE", { status: 500 });
  }
}
``
