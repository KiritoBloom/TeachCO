"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "./loader";
import { Card, CardDescription, CardTitle } from "./ui/card";
import RoleChooser from "./role-chooser";
import Image from "next/image";
import { Button } from "./ui/button";
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
import { useToast } from "./ui/use-toast";
import useUserRole from "@/hooks/role";

const ClassesTable = () => {
  const { role, isLoading } = useUserRole();
  const [teacherClasses, setTeacherClasses] = useState<Array<any>>([]);
  const [studentClasses, setStudentClasses] = useState<Array<any>>([]);
  const { toast } = useToast();
  const router = useRouter();

  const [isTeacherClassesLoading, setIsTeacherClassesLoading] = useState(true);
  const [isStudentClassesLoading, setIsStudentClassesLoading] = useState(true);

  useEffect(() => {
    const fetchedClasses = async () => {
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

    fetchedClasses();
  }, []);

  useEffect(() => {
    const fetchedClasses = async () => {
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

    fetchedClasses();
  }, []);

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
        data: {
          classId,
        },
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

  return (
    <>
      <div className="ml-2">
        {isLoading || isTeacherClassesLoading || isStudentClassesLoading ? (
          <div className="flex justify-center items-center mt-[20%] h-full">
            <Loader />
          </div>
        ) : !role ? (
          <RoleChooser />
        ) : (
          <div>
            {role === "Teacher" ? (
              <div>
                <h1 className="mt-2 font-bold text-3xl">Created Classes</h1>
                {teacherClasses.length > 0 ? (
                  <div className="mt-5 flex flex-wrap justify-center gap-y-3">
                    {teacherClasses.map((classItem) => (
                      <div
                        key={classItem.classId}
                        className="w-full md:w-1/2 px-2 mb-4"
                      >
                        <Card
                          className="hover:translate-x-1 cursor-pointer transition-all p-4 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black/20"
                          onClick={() => handleOnClick(classItem.classId)}
                        >
                          <CardTitle>{classItem.className}</CardTitle>
                          <CardTitle className="mb-2 mt-1 text-foreground/100 text-lg">
                            {classItem.teacherName}
                          </CardTitle>
                          <CardDescription className="mb-2 mt-2">
                            Class Subject: {classItem.classSubject}
                          </CardDescription>
                          <CardDescription>
                            Class Code: {classItem.classId}
                          </CardDescription>
                          <div className="flex mt-3 gap-x-4 w-full">
                            <Button
                              onClick={(event) => {
                                event.stopPropagation(); // Add this line
                                handleOnEdit(classItem.classId);
                              }}
                              className="bg-black hover:bg-black hover:scale-[102%] rounded-2xl w-fit  flex items-center justify-end gap-x-2 transition-all duration-100"
                            >
                              Edit <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger
                                onClick={(
                                  event: React.MouseEvent<HTMLButtonElement>
                                ) => event.stopPropagation()}
                              >
                                <Button className="z-100 bg-gray-200 hover:bg-gray-200 hover:scale-[102%] rounded-2xl w-fit flex items-center gap-x-2 text-black transition-all duration-100">
                                  Delete Class <Trash className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your class and all
                                    students associated
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[3px]">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) =>
                                      handleOnDelete(classItem.classId, e)
                                    }
                                    className="z-100 bg-gray-200 hover:bg-gray-200 hover:translate-y-[3px] rounded-2xl w-fit flex items-center gap-x-2 text-black transition-all duration-100"
                                  >
                                    Delete Class <Trash className="w-4 h-4" />
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
              <div>
                <h1 className="mt-2 font-bold text-3xl">Joined Classes</h1>
                {studentClasses.length > 0 ? (
                  <div className="mt-5 flex flex-wrap justify-center">
                    {studentClasses.map((classItem) => (
                      <div
                        key={classItem.classId}
                        className="w-full md:w-1/2 px-2 mb-4"
                      >
                        <Card
                          className="hover:translate-x-1 mt-5 cursor-pointer transition-all mb-4 ml-0 mx-auto p-4 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black/20"
                          onClick={() => handleOnClick(classItem.classId)}
                        >
                          <CardTitle>
                            Class Name: {classItem.className}
                          </CardTitle>
                          <CardTitle className="mb-2 mt-1 text-foreground/100 text-lg">
                            Teacher Name: {classItem.teacherName}
                          </CardTitle>
                          <CardDescription className="mb-2 mt-2">
                            Class Subject: {classItem.classSubject}
                          </CardDescription>
                          <CardDescription>
                            Class Code: {classItem.classId}
                          </CardDescription>
                          <div className="flex mt-3 gap-x-4 w-full">
                            <Button
                              onClick={(e) =>
                                handleOnDelete(classItem.classId, e)
                              }
                              className="z-100 bg-gray-200 hover:bg-gray-200 hover:scale-[102%] rounded-2xl w-fit flex items-center gap-x-2 text-black transition-all duration-100"
                            >
                              Leave Class{" "}
                              <ArrowUpLeftFromSquareIcon className="w-4 h-4" />
                            </Button>
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
        )}
      </div>
    </>
  );
};

export default ClassesTable;
