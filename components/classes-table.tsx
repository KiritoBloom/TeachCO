"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpLeftFromSquareIcon, Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useUserRole from "@/hooks/role";
import { Loader } from "@/components/loader";
import RoleChooser from "@/components/role-chooser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ClassImage from "@/components/class-image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const ClassesTable = () => {
  const { role, isLoading } = useUserRole();
  const [teacherClasses, setTeacherClasses] = useState<Array<any>>([]);
  const [studentClasses, setStudentClasses] = useState<Array<any>>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [bgClass, setBgClass] = useState("bg-wavy");
  const [isTeacherClassesLoading, setIsTeacherClassesLoading] = useState(true);
  const [isStudentClassesLoading, setIsStudentClassesLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Determine the appropriate background class based on the theme
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setBgClass(currentTheme === "dark" ? "dark-wavy" : "bg-wavy");
  }, [theme, resolvedTheme]);

  useEffect(() => {
    // Fetch teacher classes
    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get("/api/class");
        const responseData = response.data;

        const classesData = responseData.includes("Success")
          ? JSON.parse(responseData.replace("Success", ""))
          : responseData;

        if (Array.isArray(classesData)) {
          setTeacherClasses(classesData);
        } else {
          console.error("Invalid response format for classes:", classesData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setIsTeacherClassesLoading(false);
      }
    };

    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    // Fetch student classes
    const fetchStudentClasses = async () => {
      try {
        const response = await axios.get("/api/class/class-join");
        const responseData = response.data;

        const classesData = responseData.includes("Success")
          ? JSON.parse(responseData.replace("Success", ""))
          : responseData;

        if (Array.isArray(classesData)) {
          setStudentClasses(classesData);
        } else {
          console.error("Invalid response format for classes:", classesData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setIsStudentClassesLoading(false);
      }
    };

    fetchStudentClasses();
  }, []);

  const handleOnLeave = async (classId: string) => {
    try {
      await axios.delete("/api/class/class-join", {
        data: { classId },
      });
    } catch (error) {
      toast({
        title: "Cannot Leave Class",
        variant: "destructive",
      });
      console.error("Error leaving class:", error);
    }
  };

  const handleOnClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleOnEdit = (classId: string) => {
    router.push(`/classes/${classId}/edit`);
  };

  const handleOnDelete = async (
    classId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // Prevent event propagation
    try {
      await axios.delete(`/api/class`, {
        data: { classId },
      });
      toast({
        title: "Class Deleted",
        description: "The class has been successfully deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (
    isLoading ||
    isTeacherClassesLoading ||
    isStudentClassesLoading ||
    !isMounted
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!role) {
    return <RoleChooser />;
  }

  return (
    <div className={cn("z-back", bgClass)}>
      {role === "Teacher" ? (
        <div className="pb-[30vh] h-full">
          <div className="flex justify-center">
            <h1 className="md:mt-4 mt-5 font-semibold text-3xl">
              Created Classes
            </h1>
          </div>
          {teacherClasses.length > 0 ? (
            <div className="-mt-5 flex flex-wrap justify-center">
              {teacherClasses.map((classItem) => (
                <div
                  key={classItem.classId}
                  className="flex justify-center w-full md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/4 px-2 mt-5"
                >
                  <Card className="text-center mr-3 mt-10 w-[85%] sm:w-[45%] md:w-[75%] lg:w-[85%] xl:w-[75%] h-full transition-all hover:shadow-lg border-2 p-10 rounded-xl bg-white/40 dark:bg-black/60 backdrop-blur-sm shadow-md flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClassImage
                        userId={classItem.teacherId}
                        className="w-[70px]"
                        skeletonStyle="w-[70px] h-[70px] rounded-full mb-4"
                      />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        {classItem.className}
                      </h2>
                      <p className="text-md text-gray-600 dark:text-white/50 mt-2">
                        Class ID: {classItem.classId}
                      </p>
                      <p className="text-md text-gray-600 dark:text-white/50">
                        Class Subject: {classItem.classSubject}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-white/50 mt-2">
                        Taught by: {classItem.teacherName}
                      </p>
                      <Button
                        onClick={() => handleOnClick(classItem.classId)}
                        className="mt-6 bg-primary text-white dark:text-black py-2 px-4 rounded-full transition hover:bg-primary-dark hover:translate-y-[2px]"
                      >
                        View Class
                      </Button>
                      <div className="flex justify-center mt-5 gap-x-4 w-full">
                        <Button
                          onClick={() => handleOnEdit(classItem.classId)}
                          className="bg-black dark:border-white hover:bg-black dark:text-white hover:translate-y-[2px] rounded-3xl w-fit flex items-center justify-end gap-x-2 transition-all duration-100"
                        >
                          Edit <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button className="z-100 bg-gray-200 dark:bg-white dark:text-black hover:bg-gray-200 hover:translate-y-[2px] rounded-3xl w-fit flex items-center gap-x-2 text-black transition-all duration-100">
                              Delete Class <Trash className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[90%] rounded-2xl dark:border-[#3A3A3D] dark:bg-[#18181C]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your class and all students
                                associated.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[2px] bg-transparent dark:border-[#3A3A3D]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) =>
                                  handleOnDelete(classItem.classId, e)
                                }
                                className="w-full md:w-fit hover:translate-y-[2px] z-100 bg-gray-200 hover:bg-gray-200 rounded-2xl flex items-center gap-x-2 text-black transition-all duration-100"
                              >
                                Delete Class <Trash className="w-4 h-4" />
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center">
                <Image
                  src="/empty.png"
                  width={400}
                  height={400}
                  alt="Empty"
                  className="grayscale"
                />
              </div>
              <p className="flex justify-center font-semibold text-4xl">
                No Classes Found
              </p>
            </>
          )}
        </div>
      ) : role === "Student" ? (
        <div className="pb-[30vh]">
          <div className="flex justify-center">
            <h1 className="mt-2 font-semibold text-3xl">Joined Classes</h1>
          </div>
          {studentClasses.length > 0 ? (
            <div className="-mt-5 flex flex-wrap justify-center">
              {studentClasses.map((classItem) => (
                <div
                  key={classItem.classId}
                  className="flex justify-center w-full md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/4 px-2 mt-5"
                >
                  <Card className="text-center mr-3 mt-10 w-[85%] sm:w-[45%] md:w-[75%] lg:w-[85%] xl:w-[75%] h-full transition-all hover:shadow-lg border-2 p-10 rounded-xl bg-white/40 dark:bg-black/60 backdrop-blur-sm shadow-md flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClassImage
                        userId={classItem.teacherId}
                        className="w-[70px]"
                      />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        {classItem.className}
                      </h2>
                      <p className="text-md text-gray-600 dark:text-white/50 mt-2">
                        Class ID: {classItem.classId}
                      </p>
                      <p className="text-md text-gray-600 dark:text-white/50">
                        Class Subject: {classItem.classSubject}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-white/50 mt-2">
                        Taught by: {classItem.teacherName}
                      </p>
                      <Button
                        onClick={() => handleOnClick(classItem.classId)}
                        className="mt-6 bg-primary text-white dark:border-white/40 dark:border-2 dark:bg-black py-2 px-4 rounded-full transition hover:bg-primary-dark hover:translate-y-[2px]"
                      >
                        View Class
                      </Button>
                      <div className="flex justify-center mt-5 gap-x-4 w-full">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button className="z-100 bg-gray-200 hover:bg-gray-200 hover:translate-y-[2px] rounded-3xl w-fit flex items-center gap-x-2 text-black transition-all duration-100">
                              Leave Class{" "}
                              <ArrowUpLeftFromSquareIcon className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[90%] rounded-2xl dark:border-[#3A3A3D] dark:bg-[#18181C]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will make you
                                leave this class, you will need to rejoin if you
                                leave.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[2px] bg-transparent dark:border-[#3A3A3D]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleOnLeave(classItem.classId)}
                                className="w-full md:w-fit hover:translate-y-[2px] z-100 bg-gray-200 hover:bg-gray-200 rounded-2xl flex items-center gap-x-2 text-black transition-all duration-100"
                              >
                                Leave Class{" "}
                                <ArrowUpLeftFromSquareIcon className="w-4 h-4" />
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center">
                <Image
                  src="/empty.png"
                  width={400}
                  height={400}
                  alt="Empty"
                  className="grayscale"
                />
              </div>
              <p className="flex justify-center font-semibold text-4xl">
                No Classes Found
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src="/empty.png"
              width={400}
              height={400}
              alt="Empty"
              className="grayscale"
            />
          </div>
          <p className="flex justify-center font-semibold text-4xl">
            No Classes Found
          </p>
        </>
      )}
    </div>
  );
};

export default ClassesTable;
