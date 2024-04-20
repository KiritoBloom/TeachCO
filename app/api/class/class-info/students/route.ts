import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
   const {userId} = auth();

   if (!userId) {
    return new NextResponse("Unauthorized", {status: 401})
   }

  try{
    const classIdWithQueryParams = req.url; // Get the entire URL including query parameters
        const classIdMatch = classIdWithQueryParams.match(/\d+$/); // Extract numbers from the end of the string

        console.log("Received classId:", classIdMatch?.[0]);

        if (!classIdMatch) {
            return new NextResponse(`No Class Id Found ${classIdMatch}`, { status: 400 });
        }

        const classId = classIdMatch[0]; // Extracted classId

        const students = await prismadb.student.findMany({
            where: {
                classId: {
                    in: [classId.toString()] 
                }
            },
            select: {
                id: true,
                name: true,
                userId: true
            }
        });
        
        if (students.length === 0) {
            console.log("No Students found");
            return new NextResponse("No Students found", {status: 200})
        }
        
        console.log(JSON.stringify(students))
        return new NextResponse(JSON.stringify(students), {status: 200})
  }
  catch(error) {
    console.log(error)
    return new NextResponse("Internal Error GET", {status: 500})
  }
}