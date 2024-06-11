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
        const roleData = response.data;
        setUserRole(roleData);
        localStorage.setItem("userRole", JSON.stringify(roleData)); // Store role in local storage
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
        setIsLoading(false);
      }
    };

    if (userId) {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setUserRole(JSON.parse(storedRole)); // Use role from local storage
        setIsLoading(false);
      } else {
        getUserRole(); // Fetch role from API if not found in local storage
      }
    }
  }, [userId]);

  return { role, isLoading };
};

export default useUserRole;
