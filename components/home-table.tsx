"use client";

import { currentUser, useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleChooser from "./role-chooser";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";
import TeacherTable from "./teacher-table";
import StudentTable from "./student-table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";

const HomeTable = () => {
  const { userId } = useAuth();
  const { user } = useUser();
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

  const cleanedUserRole = userRole
    ?.replace("Success", "")
    .replace(/"role":/g, "")
    .replace(/[{}"]/g, "")
    .trim();

  const handleOnClick = () => {
    router.push("/settings");
  };

  return (
    <div className="w-full h-full pb-5">
      {isLoading ? (
        <div className="flex justify-center items-center mt-[20%] h-full">
          <Loader />
        </div>
      ) : userRole === null ||
        userRole === "Success null" ||
        cleanedUserRole === "null" ? (
        <RoleChooser />
      ) : (
        <div>
          <div>
            <div className="flex justify-between mt-5 mb-5">
              <h1 className="font-semibold text-[30px] ml-5">
                Welcome Back, {user?.firstName}
              </h1>
              <div className="bg-foreground/30 w-[9%] h-15 rounded-md flex justify-between items-center mr-2">
                {cleanedUserRole === "Student" && (
                  <>
                    <h1 className="ml-2 font-bold">{cleanedUserRole}</h1>
                    <Image
                      src="/student.png"
                      className="bg-white rounded-[50%] p-1 mr-2 border-[1px] border-black"
                      width={40}
                      height={30}
                      alt="logo"
                    />
                  </>
                )}
                {cleanedUserRole === "Teacher" && (
                  <>
                    <h1 className="ml-2 font-bold">{cleanedUserRole}</h1>
                    <Image
                      src="/teacher.png"
                      className="bg-white rounded-[50%] p-1 mr-2 border-[1px] border-black"
                      width={40}
                      height={30}
                      alt="logo"
                    />
                  </>
                )}
              </div>
            </div>
            <Avatar className="w-full h-full flex justify-center items-center">
              <AvatarImage
                src={user?.imageUrl}
                className="w-[20%] h-[20%] rounded-[50%]"
              />
              <AvatarFallback>UL</AvatarFallback>
            </Avatar>
            <div className="w-full flex justify-center mt-7">
              <Button
                className="w-[50%] mb-10 hover:bg-foreground/80 bg-black transition-all font-semibold"
                onClick={handleOnClick}
              >
                Edit Your Profile
              </Button>
            </div>
          </div>
          {cleanedUserRole === "Teacher" ? (
            <>
              <h1 className="ml-5 text-2xl font-semibold text-black/70">
                Get Started Here:
              </h1>
              <div className="pb-5">
                <TeacherTable />
              </div>
            </>
          ) : cleanedUserRole === "Student" ? (
            <>
              <h1 className="ml-5 text-2xl font-semibold text-black/70">
                Get Started Here:
              </h1>
              <div className="pb-5">
                <StudentTable />
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default HomeTable;
