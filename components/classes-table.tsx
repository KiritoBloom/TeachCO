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
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ClassImage from "@/components/class-image";

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
              <div className="pb-20">
                <div className="flex justify-center">
                  <h1 className="mt-2 font-semibold text-3xl">
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
                        <Card className="text-center mr-3 mt-10 w-[80%] sm:w-full md:w-[90%] lg:w-fit xl:w-[80%] h-full transition-all hover:shadow-lg border-2 p-5 rounded-xl bg-white shadow-md flex flex-col items-center justify-center">
                          {" "}
                          <div className="flex flex-col items-center justify-center">
                            {/* Class Icon or Image */}
                            <ClassImage
                              userId={classItem.teacherId}
                              className="w-[70px]"
                            />

                            {/* Class Information */}
                            <h2 className="text-2xl font-bold text-gray-900 text-center">
                              {classItem.className}
                            </h2>
                            <p className="text-md text-gray-600 mt-2">
                              Class ID: {classItem.classId}
                            </p>
                            <p className="text-md text-gray-600">
                              Class Subject: {classItem.classSubject}
                            </p>

                            {/* Additional Information */}
                            <p className="text-sm text-gray-500 mt-2">
                              Taught by: {classItem.teacherName}
                            </p>
                            {/* Call-to-Action */}
                            <Button
                              onClick={() => handleOnClick(classItem.classId)}
                              className="mt-6 bg-primary text-white py-2 px-4 rounded-full transition hover:bg-primary-dark hover:translate-y-[2px]"
                            >
                              View Class
                            </Button>
                            <div className="flex justify-center mt-5 gap-x-4 w-full">
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation(); // Add this line
                                  handleOnEdit(classItem.classId);
                                }}
                                className="bg-black hover:bg-black hover:translate-y-[2px] rounded-3xl w-fit  flex items-center justify-end gap-x-2 transition-all duration-100"
                              >
                                Edit <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>
                                  ) => event.stopPropagation()}
                                >
                                  <Button className="z-100 bg-gray-200 hover:bg-gray-200 hover:translate-y-[2px] rounded-3xl w-fit flex items-center gap-x-2 text-black transition-all duration-100">
                                    Delete Class <Trash className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="w-[90%] rounded-2xl">
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
                                    <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[2px]">
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
              <div className="pb-20">
                <div className="flex justify-center">
                  <h1 className="mt-2 font-semibold text-3xl">
                    Joined Classes
                  </h1>
                </div>
                {studentClasses.length > 0 ? (
                  <div className="-mt-5 flex flex-wrap justify-center">
                    {studentClasses.map((classItem) => (
                      <div
                        key={classItem.classId}
                        className="flex justify-center w-full md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/4 px-2 mt-5"
                      >
                        <Card className="text-center mr-3 mt-10 w-[75%] sm:w-full md:w-[90%] lg:w-[90%] xl:w-[80%] h-full transition-all hover:shadow-lg border-2 p-10 rounded-xl bg-white shadow-md flex flex-col items-center justify-center">
                          {" "}
                          <div className="flex flex-col items-center justify-center">
                            {/* Class Icon or Image */}
                            <ClassImage
                              userId={classItem.teacherId}
                              className="w-[70px]"
                            />

                            {/* Class Information */}
                            <h2 className="text-2xl font-bold text-gray-900">
                              {classItem.className}
                            </h2>
                            <p className="text-md text-gray-600 mt-2">
                              Class ID: {classItem.classId}
                            </p>
                            <p className="text-md text-gray-600">
                              Class Subject: {classItem.classSubject}
                            </p>

                            {/* Additional Information */}
                            <p className="text-sm text-gray-500 mt-2">
                              Taught by: {classItem.teacherName}
                            </p>
                            {/* Call-to-Action */}
                            <Button
                              onClick={() => handleOnClick(classItem.classId)}
                              className="mt-6 bg-primary text-white py-2 px-4 rounded-full transition hover:bg-primary-dark hover:translate-y-[2px]"
                            >
                              View Class
                            </Button>
                            <div className="flex justify-center mt-5 gap-x-4 w-full">
                              <Button className="z-100 bg-gray-200 hover:bg-gray-200 hover:translate-y-[2px] rounded-3xl w-fit flex items-center gap-x-2 text-black transition-all duration-100">
                                Leave Class{" "}
                                <ArrowUpLeftFromSquareIcon className="w-4 h-4" />
                              </Button>
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
        )}
      </div>
    </>
  );
};

export default ClassesTable;
