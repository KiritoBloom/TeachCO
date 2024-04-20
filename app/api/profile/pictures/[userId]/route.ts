import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the expected type for params
type Params = {
  userId: string; // The dynamic path parameter
};

// Explicitly pass the expected structure for context
export async function GET(req: Request, context: { params: Params }) {
  const { userId: authUserId } = auth();

  if (!authUserId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Extract the userId from the path parameter
    const { userId } = context.params;

    if (!userId) {
      return new NextResponse("User ID not found in the path parameters.", { status: 400 });
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
