"use client"

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const role = userRole?.replace("Success", "")
  .replace(/"role":/g, "")
  .replace(/[{}"]/g, "")
  .trim();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get("/api/role");
        setUserRole(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
        setIsLoading(false)
      }
    };

    if (userId) {
      getUserRole();
    }
  }, [userId]);

  return {role, isLoading}
};

export default useUserRole;
