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
  ArchiveBoxXMarkIcon,
  BookOpenIcon,
  HomeIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Tabs, Tab } from "@nextui-org/tabs";
import themeHook from "@/hooks/theme";
import HomePath from "./home-path";

const ClassPage = () => {
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>("");
  const [students, setStudents] = useState([]); // Ensure this starts as an empty array
  const pathName = usePathname();
  const classId = pathName.split("/").pop();
  const { role, isLoading } = useUserRole();
  const { toast } = useToast();
  const { userId } = useAuth();

  const resolvedTheme = themeHook();

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!classInfo) {
    return null;
  }

  return (
    <div
      className={cn("flex justify-center md:py-10 pt-5 pb-5 bg-wavy z-back", {
        "dark-wavy": resolvedTheme === "dark",
      })}
    >
      <div className="md:w-[80%] bg-gray-100/10 dark:bg-black/70 dark:border-black/10 backdrop-blur rounded-2xl shadow-xl w-[90%] p-5 md:p-10 border border-gray-200">
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
          <Card className="flex flex-col items-start bg-gray-300/40 dark:bg-black/90 p-3 rounded-lg border w-fit">
            <CardTitle className="text-lg text-gray-700 dark:text-white text-start">
              Class ID
            </CardTitle>
            <div className="flex items-center">
              <CardDescription className="text-gray-800 dark:text-white/60 text-xl p-1 rounded-lg">
                {classId}
              </CardDescription>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => classId && onCopy(classId)}
                      className="ml-4 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300"
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
          <div className="flex w-full flex-col">
            <Tabs
              size="lg"
              aria-label="Options"
              className="md:w-fit mx-auto md:mx-0 mb-5"
              radius="full"
            >
              <Tab
                key="Home"
                title={
                  <div className="flex flex-col md:flex-row items-center gap-x-2">
                    <HomeModernIcon className="w-4 h-4" />
                    <span className="text-sm">Home</span>
                  </div>
                }
              >
                <div className="p-3">
                  <HomePath classId={classId} />
                </div>
              </Tab>
              <Tab
                key="students"
                title={
                  <div className="flex flex-col md:flex-row  items-center gap-x-2">
                    <AcademicCapIcon className="w-5 h-5" />
                    <span className="text-sm">Students</span>
                  </div>
                }
              >
                <div>
                  <div className="flex gap-x-10 flex-wrap">
                    {Array.isArray(students) && students.length > 0 ? (
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
                    )}
                  </div>
                </div>
              </Tab>
              <Tab
                key="classwork"
                title={
                  <div className="flex flex-col md:flex-row items-center gap-x-2">
                    <BookOpenIcon className="w-5 h-5" />
                    <span className="text-sm">ClassWork</span>
                  </div>
                }
              >
                <div>
                  <div>ClassWorks</div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
