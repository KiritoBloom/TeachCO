import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Explicitly pass `userId` to avoid using `req.url`
export async function GET(req: Request) {
  const { userId: authUserId } = auth();

  if (!authUserId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Extract `userId` from request query or alternative method
    const userId = new URLSearchParams(req.url.split("?")[1]).get("userId");

    if (!userId) {
      return new NextResponse("User ID not found in the query parameters.");
    }

    console.log("User ID:", userId);

    const user = await clerkClient.users.getUser(userId);
    const imgUrl = user.imageUrl;

    return new NextResponse(imgUrl, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);

    return new NextResponse("Internal Error GET", { status: 500 });
  }
}
