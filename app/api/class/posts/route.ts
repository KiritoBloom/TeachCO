import prismadb from '@/lib/prismadb';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.BASE_URL || "http://localhost";

export async function POST(req: Request, res: Response) {
  try {
    const {userId} = auth();
    const user  = await currentUser();

    const userName = user?.firstName || "User"

    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    const { title, description, isChecked, classId } = await req.json();

    if (!title || !description) {
      return new NextResponse("No title or description found", { status: 404 });
    }

    const newUuid = uuidv4();
    
   await prismadb.post.create({
    data: {
        title: title,
        description: description,
        isPinned: isChecked,
        postId: newUuid,
        classId: classId,
        posterId: userId,
        posterName: userName
    }
   })

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error POST", { status: 500 });
  }
}

export async function GET(req: Request, res: Response) {

    const url = new URL(req.url, BASE_URL);
    const classId = url.searchParams.get("classId"); // Get "classId" from query parameters
    try {
        const posts = await prismadb.post.findMany({
            where: {
                classId: classId?.toString()
            }, select: {
                title: true,
                description: true,
                isPinned: true,
                createdAt: true,
                postId: true,
                posterId: true,
                posterName: true,
            }
        })

        if (!posts) {
            return new NextResponse("No Posts found", {status: 200})
        }


        return new NextResponse(JSON.stringify(posts), {status: 200})
    }
    catch (error) {
        console.log(error);
        return new NextResponse("Internal Error GET", {status: 500})
    }
}

export async function DELETE(req: Request, res: Response) {
    const {userId} = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    try{
        const {posterId, postId} = await req.json();

        if (posterId !== userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!postId) {
            return new NextResponse("No Post Id found", {status: 404})
        }

        await prismadb.post.delete({
            where: {
                postId: postId.toString(),
                posterId: posterId
            }
        })

        return new NextResponse("Post Deleted", {status: 200})
    }
    catch(error) {
        console.log(error);
        return new NextResponse("Internal Error DELETE", {status: 500})
    }
}

export async function PATCH(req: Request, res: Response) {
    const { userId } = auth();
     
    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401});
    }

    try {
        const { posterId, postId, updatedTitle, updatedDesc } = await req.json();

        if (posterId !== userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const currentPost = await prismadb.post.findUnique({
            where: {
                postId: postId,
                posterId: posterId
            }
        });

        if (!currentPost) {
            return new NextResponse("Post not found", {status: 404});
        }

        const newTitle = updatedTitle !== "" ? updatedTitle : currentPost.title;
        const newDescription = updatedDesc !== "" ? updatedDesc : currentPost.description;

        await prismadb.post.update({
            where: {
                postId: postId,
                posterId: posterId
            }, 
            data: {
                title: newTitle,
                description: newDescription
            }
        });

        return new NextResponse("Post Updated", {status: 200});
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error PATCH", {status: 500});
    }
}
