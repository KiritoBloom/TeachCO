"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleChooser from "./role-chooser";

const HomeTable = () => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get("/api/role");
        setIsLoading(true);
        setUserRole(response.data);
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
    <div className="overflow-y-auto">
      {/* Display RoleChooser if userRole is null or has the value "Success null" */}
      {!isLoading && (userRole === null || userRole === "Success null") && (
        <RoleChooser />
      )}

      {/* Display userRole if it is not null and not "Success null" */}
      {!isLoading && userRole !== null && userRole !== "Success null" && (
        <div>
          {/* Display userRole information */}
          <p>
            User Role is:{" "}
            {userRole
              ?.replace(/[{}"]/g, "")
              .replace("role", "")
              .replace("Success :", "")}
          </p>

          {/* Display userId information */}
          <p>User ID: {userId}</p>
        </div>
      )}

      {/* Display loading message while userRole is being fetched */}
      {isLoading && <h1>Loading...</h1>}
    </div>
  );
};

export default HomeTable;
