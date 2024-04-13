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

const HomeTable = () => {
  const { user } = useUser();
  const router = useRouter();
  const { role, isLoading } = useUserRole();

  const handleOnClick = () => {
    router.push("/settings");
  };

  return (
    <div className="w-full h-full pb-5">
      {isLoading ? (
        <div className="flex justify-center items-center mt-[20%] h-full">
          <Loader />
        </div>
      ) : role === null || role === "null" || role === "null" ? (
        <RoleChooser />
      ) : (
        <div>
          <div>
            <div className="md:flex md:justify-between mt-2 mb-5">
              <h1 className="font-semibold text-[30px] ml-2">
                Welcome Back, {user?.firstName || "User"}
              </h1>
              <div className="p-1 ml-2 mt-2 md:mt-0 md:ml-0 bg-foreground/30 gap-x-2 md:w-fit w-fit h-15 rounded-md flex justify-between items-center mr-2">
                {role === "Student" && (
                  <>
                    <h1 className="ml-2 font-bold">{role}</h1>
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
                    <h1 className="ml-2 font-bold">{role}</h1>
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
                className="md:w-[20%] md:h-[20%] w-[50%] rounded-[50%]"
              />
              <AvatarFallback>UL</AvatarFallback>
            </Avatar>
            <div className="w-full flex justify-center mt-7">
              <Button
                className="md:w-[50%] w-[80%] mb-10 hover:bg-black hover:scale-[101%] bg-black transition-all font-semibold rounded-3xl"
                onClick={handleOnClick}
              >
                Edit Your Profile
              </Button>
            </div>
          </div>
          {role === "Teacher" ? (
            <>
              <h1 className="ml-5 text-2xl font-semibold text-black/70">
                Get Started Here:
              </h1>
              <div className="pb-5">
                <TeacherTable />
              </div>
            </>
          ) : role === "Student" ? (
            <>
              <h1 className="ml-5 text-2xl font-semibold text-black/70">
                Get Started Here:
              </h1>
              <div className="pb-5">
                <StudentTable />
              </div>
            </>
          ) : null}
          <div className="ml-2">
            <RecentClasses />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTable;
