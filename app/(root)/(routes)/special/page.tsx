"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import RoleChooser from "@/components/role-chooser";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import TeacherTable from "@/components/teacher-table";
import StudentTable from "@/components/student-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RecentClasses from "@/components/recent-classes";
import useUserRole from "@/hooks/role";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Wand2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import UserCard from "@/components/user-card";
import { SparklesIcon } from "@heroicons/react/24/outline";

const HomeTable = () => {
  const { user } = useUser();
  const { userId } = useAuth();
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
                  Welcome, {user?.firstName || "User"}
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center">
                <UserCard
                  userId={userId ?? ""}
                  userName={user?.firstName || "User"}
                  userRole={role}
                  userEmail={user?.emailAddresses[0]?.emailAddress || ""}
                />
                <Button
                  className="mb-10 w-[60%] md:w-[20%] font-semibold rounded-full"
                  onClick={() => handleOnClick()}
                >
                  Edit Profile <SparklesIcon className="w-4 h-4 ml-2" />
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
