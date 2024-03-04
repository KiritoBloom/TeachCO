import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//GET REQUEST
export async function GET(req: Request, res: Response) {
   const {userId} = auth();
 
   try {
     if (!userId) {
       return new NextResponse("Unauthorized", { status: 401 });
     }
 
      const res = await prismadb.user.findUnique({
      where: {
         userId: userId.toString()
      },
      select: {
         role: true
      }
     })
     
     console.log(JSON.stringify(res));

     if (JSON.stringify(res) === "null") {
      return new NextResponse("Role Not Found", {status: 500})
     }
 
     return new NextResponse(`Success ${JSON.stringify(res)}`, { status: 200 });
   } catch (error) {
     console.error("Error fetching user role:", error);
     return new NextResponse("Internal Error GET", { status: 500 });
   }
 }
 
 
 
//POST REQUEST
export async function POST(req: Request, res: Response) {
   const user = await currentUser();
   const { userId } = auth();
   const primaryEmailAddress = user?.emailAddresses[0]?.emailAddress;
   const { role } = await req.json();

   if (!user?.firstName || !userId || !primaryEmailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
   }

   try {
      const userEmail = primaryEmailAddress

      await prismadb.user.create({
         data: {
            userId: userId?.toString(),
            userName: user?.firstName,
            userEmail: userEmail.toString(),
            role: role.toString(),
         },
      });
   
      console.log("User created successfully");
      return new NextResponse("Success", { status: 200 });
   } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse("Internal Error POST", { status: 500 });
   }
}

