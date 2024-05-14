"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useUserRole from "@/hooks/role";
import { Card, CardDescription, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Copy } from "lucide-react";
import { Loader } from "./loader";
import StudentCard from "./student-card";
import { ComboboxDropdownMenu } from "./ui/combo-box";
import ClassImage from "./class-image";
import { useAuth } from "@clerk/nextjs";
import {
  AcademicCapIcon,
  BookOpenIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const ClassPage = () => {
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>("");
  const [students, setStudents] = useState([]); // Ensure this starts as an empty array
  const pathName = usePathname();
  const classId = pathName.split("/").pop();
  const { role, isLoading } = useUserRole();
  const { toast } = useToast();
  const { userId } = useAuth();
  const [currentPath, setCurrentPath] = useState("Home");

  if (!classId) {
    return <div>No Class Id</div>;
  }

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const [classInfoRes, studentsRes] = await Promise.all([
          axios.get(`/api/class/class-info?classId=${classId}`),
          axios.get(`/api/class/class-info/students?classId=${classId}`),
        ]);

        setClassInfo(classInfoRes.data);
        setStudents(studentsRes.data ?? []); // Default to an empty array if data is null/undefined
        setIsClassLoading(false);
      } catch (error) {
        console.error("Something went wrong:", error);
        setIsClassLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  const onCopy = (content: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({
      description: "Copied to clipboard",
      variant: "success",
    });
  };

  if (isLoading || isClassLoading) {
    return (
      <div className="flex justify-center items-center mt-[20%] h-full">
        <Loader />
      </div>
    );
  }

  if (!classInfo) {
    return null;
  }

  const handleOnRouteChange = (value: string) => {
    setCurrentPath(value);
  };

  return (
    <div className="flex justify-center md:py-10 pt-5 pb-5">
      <div className="md:w-[80%] bg-gray-100 rounded-2xl shadow-xl w-[90%] p-5 md:p-10 border border-gray-200">
        <div className="flex flex-col items-center mb-6 mt-10">
          <ClassImage
            className="w-[200px] h-[200px] rounded-full shadow-lg"
            skeletonStyle="mb-4 w-[200px] h-[200px] rounded-full"
            width={800}
            height={800}
            userId={classInfo.teacherId}
          />
        </div>
        <div className="flex flex-col md:flex md:flex-row md:justify-between md:items-center mb-6">
          <div className="flex flex-row-reverse justify-center mx-auto md:mx-0 md:justify-end mb-10 md:mb-0">
            {userId === classInfo.teacherId ? (
              <div
                className={cn(
                  "md:hidden flex ml-[80%] items-start text-center",
                  {
                    "ml-[20%]": classInfo.className.length >= "20",
                  }
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <ComboboxDropdownMenu classId={classId} />
                    </TooltipTrigger>
                    <TooltipContent>Class Actions</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex flex-col justify-center">
              <h1 className="scroll-m-20 border-b pb-1 text-4xl font-bold tracking-tight first:mt-0 flex justify-center ">
                {classInfo.className}
              </h1>
              <p className="scroll-m-20 border-b pb-0 mt-1 text-md font-semibold tracking-tight first:mt-0 flex justify-center">
                Taught by: {classInfo.teacherName}
              </p>
            </div>
          </div>
          {userId === classInfo.teacherId ? (
            <div className="hidden md:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ComboboxDropdownMenu classId={classId} />
                  </TooltipTrigger>
                  <TooltipContent>Class Actions</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex justify-end">
          <Card className="flex flex-col items-start bg-gray-300/40 p-3 rounded-lg border w-fit">
            <CardTitle className="text-lg text-gray-700 text-start">
              Class ID
            </CardTitle>
            <div className="flex items-center">
              <CardDescription className="text-gray-800 text-xl p-1 rounded-lg">
                {classId}
              </CardDescription>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => classId && onCopy(classId)}
                      className="ml-4 hover:bg-gray-200 transition-all duration-300"
                      size="icon"
                      variant="ghost"
                    >
                      <Copy className="w-5 h-5 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </div>
        <div className="mt-10">
          <div className="flex justify-between font-semibold text-sm md:text-lg p-2 md:p-3 mb-2 rounded-xl border-black bg-gray-300/30">
            <h1
              className={cn(
                "cursor-pointer bg-gray-300/60 p-1 md:p-2 rounded-lg border border-black/20 flex items-center transition-all hover:scale-105",
                {
                  "scale-105": currentPath === "Home",
                }
              )}
              onClick={() => handleOnRouteChange("Home")}
            >
              <HomeIcon className="w-3 h-3 mr-1 md:w-5 md:h-5 md:mr-2" />
              Home
            </h1>
            <h1
              className={cn(
                "cursor-pointer bg-gray-300/60 p-1 md:p-2 rounded-lg border border-black/20 flex items-center transition-all hover:scale-105",
                {
                  "scale-105": currentPath === "Students",
                }
              )}
              onClick={() => handleOnRouteChange("Students")}
            >
              <AcademicCapIcon className="w-3 h-3 mr-1 md:w-5 md:h-5 md:mr-2" />
              Students
            </h1>
            <h1
              className={cn(
                "cursor-pointer bg-gray-300/60 p-1 md:p-2 rounded-lg border border-black/20 flex items-center transition-all hover:scale-105",
                {
                  "scale-105": currentPath === "ClassWork",
                }
              )}
              onClick={() => handleOnRouteChange("ClassWork")}
            >
              <BookOpenIcon className="w-3 h-3 mr-1 md:w-5 md:h-5 md:mr-2" />
              Class Work
            </h1>
          </div>
          {currentPath === "Home" ? (
            <p>Home</p>
          ) : currentPath === "Students" ? (
            Array.isArray(students) && students.length > 0 ? (
              students.map((student: any) => (
                <StudentCard
                  key={student.id}
                  studentId={student.id}
                  studentName={student.name}
                  userId={student.userId}
                />
              ))
            ) : (
              <p className="text-gray-600 mt-2">No students found</p>
            )
          ) : currentPath === "ClassWork" ? (
            <p>Classwork</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
