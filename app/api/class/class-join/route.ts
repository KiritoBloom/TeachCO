import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
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

    // Update the user's joinedClasses array
    const updatedUser = await prismadb.user.update({
      where: {
        userId: userId?.toString()
      }, 
      data: {
          joinedClasses: {
            push: classId.toString() // Using push to add the new classId to the array
          }
      }
    })

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
    

    // Create a new student entry
    await prismadb.student.create({
      data: {
        name: userName.toString(),
        id: uniqueId,
        userId: userId.toString(),
        classId: classId.toString(),
      },
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
      return new NextResponse("Unauthorized", {status: 500})
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
