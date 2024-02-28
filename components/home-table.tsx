"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleChooser from "./role-chooser";
import { useRouter } from "next/navigation";
import { Loader } from "./loader";

const HomeTable = () => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get("/api/role");
        setIsLoading(true);
        setUserRole(response.data);
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function to fetch user role
    getUserRole();
  }, [userId]);

  return (
    <div className="overflow-y-auto w-full h-full">
      {/* Display loading message while userRole is being fetched */}
      {isLoading && (
        <div className="flex justify-center items-center mt-[20%] h-full">
          <Loader />
        </div>
      )}
      {!isLoading && (userRole === null || userRole === "Success null") && (
        <RoleChooser />
      )}
      {!isLoading && userRole !== null && userRole !== "Success null" && (
        <div>
          <p>
            User Role is:{" "}
            {userRole
              ?.replace(/[{}"]/g, "")
              .replace("role", "")
              .replace("Success :", "")}
          </p>
          <p>User ID: {userId}</p>
        </div>
      )}
    </div>
  );
};

export default HomeTable;
