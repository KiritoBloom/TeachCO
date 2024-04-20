import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const {userId} = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", {status: 401})
  }

  try {
    // Extracting the full URL
    const url = new URL(req.url);

    // Getting query parameters
    const userId = url.searchParams.get("userId"); // Retrieving the "userId" parameter

    if (!userId) {
      // Handling cases where "userId" parameter doesn't exist
      throw new Error("User ID not found in the query parameters.");
    }

    console.log("User ID:", userId);

    const user = await clerkClient.users.getUser(userId)

    const imgUrl = user.imageUrl

    // Return a successful response
    return new NextResponse(`${imgUrl}`, {status: 200})
  } catch (error) {
    console.error("Error in GET request:", error);

    // Return an appropriate error response with status 500
    return new NextResponse(
      "Internal Error GET", {status: 500}
    );
  }
}
