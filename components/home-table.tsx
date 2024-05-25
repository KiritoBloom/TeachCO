"use client";

import { useUser } from "@clerk/nextjs";
import RoleChooser from "./role-chooser";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";
import TeacherTable from "./teacher-table";
import StudentTable from "./student-table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";
import RecentClasses from "./recent-classes";
import useUserRole from "@/hooks/role";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Wand2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const HomeTable = () => {
  const { user } = useUser();
  const router = useRouter();
  const { role, isLoading } = useUserRole();
  const { theme, resolvedTheme } = useTheme();
  const [bgClass, setBgClass] = useState("bg-wavy");

  useEffect(() => {
    // Determine the appropriate class based on the theme
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setBgClass(currentTheme === "dark" ? "dark-wavy" : "bg-wavy");
  }, [theme, resolvedTheme]);

  const handleOnClick = () => {
    router.push("/settings");
  };

  return (
    <div className={cn("z-back", bgClass)}>
      <div className="w-full h-full pb-5">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : role === null ||
          role === "null" ||
          role === "Success null" ||
          !role ? (
          <RoleChooser />
        ) : (
          <div>
            <div>
              <div className="md:flex md:justify-between pt-5 mb-5">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl ml-2">
                  Welcome Back, {user?.firstName || "User"}
                </h1>
                <div className="p-1 ml-2 mt-2 md:mt-0 md:ml-0 bg-gray-300 dark:bg-black/50 gap-x-2 md:w-fit w-fit h-15 rounded-md flex justify-between items-center mr-2">
                  {role === "Student" && (
                    <>
                      <h1 className="ml-2 font-bold dark:text-white">{role}</h1>
                      <Image
                        src="/student.png"
                        className="bg-white rounded-[50%] p-1 mr-2 border-[1px]"
                        width={40}
                        height={30}
                        alt="logo"
                      />
                    </>
                  )}
                  {role === "Teacher" && (
                    <>
                      <h1 className="ml-2 font-bold dark:text-white">{role}</h1>
                      <Image
                        src="/teacher.png"
                        className="bg-white rounded-[50%] p-1 mr-2 border-[1px]"
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
                  className="md:w-[30%] lg:w-[20%] md:h-[20%] w-[50%] rounded-[50%]"
                />
                <AvatarFallback className="w-20 h-20 p-[10%]">
                  UL
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex justify-center mt-7">
                <Button
                  className="mt-10 dark:text-black dark:bg-white md:w-[80%] lg:w-[50%] w-[80%] mb-10 hover:bg-black hover:scale-[101%] bg-black transition-all font-semibold rounded-3xl"
                  onClick={handleOnClick}
                >
                  Edit Your Profile <Wand2Icon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            {role === "Teacher" ? (
              <>
                <h1 className="md:ml-5 ml-3 text-2xl font-semibold text-black/70 dark:text-white/90">
                  Get Started Here:
                </h1>
                <div className="pb-5">
                  <TeacherTable />
                </div>
              </>
            ) : role === "Student" ? (
              <>
                <h1 className="md:ml-5 ml-3 text-2xl font-semibold text-black/70 dark:text-white/90">
                  Get Started Here:
                </h1>
                <div className="pb-5">
                  <StudentTable />
                </div>
              </>
            ) : null}
            <div>
              <RecentClasses />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTable;
