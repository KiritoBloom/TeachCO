"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleChooser from "./role-chooser";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";
import TeacherTable from "./teacher-table";
import StudentTable from "./student-table";

const HomeTable = () => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userRole !== null || userRole !== "Success null") {
      const getUserRole = async () => {
        try {
          const response = await axios.get("/api/role");
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } finally {
          setIsLoading(false);
          router.refresh();
        }
      };
      getUserRole();
    } else {
      setIsLoading(false); // Set loading to false if userRole is null or "Success null"
    }
  }, [userId, userRole]);

  return (
    <div className="w-full h-full">
      {
        isLoading ? (
          <div className="flex justify-center items-center mt-[20%] h-full">
            <Loader />
          </div>
        ) : userRole === null || userRole === "Success null" ? (
          <RoleChooser />
        ) : userRole === 'Success {"role":"Teacher"}' ? (
          <TeacherTable />
        ) : userRole === `Success {"role":"Student"}` ? (
          <div>
            <StudentTable />
          </div>
        ) : null /* Add your desired fallback here, e.g., display nothing or show an error message */
      }
    </div>
  );
};

export default HomeTable;
