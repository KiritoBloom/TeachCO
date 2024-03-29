"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "./loader";
import { Card, CardDescription, CardTitle } from "./ui/card";
import RoleChooser from "./role-chooser";
import Image from "next/image";

const ClassesTable = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teacherClasses, setTeacherClasses] = useState<Array<any>>([]);
  const [studentClasses, setStudentClasses] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const cleanedUserRole = userRole
    ?.replace("Success", "")
    ?.replace(/"role":/g, "")
    ?.replace(/[{}"]/g, "")
    ?.trim();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get("/api/role");
        setUserRole(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, [router]);

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
          setIsLoading(false);
        } else {
          console.error("Invalid response format for classes:", classesData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setIsLoading(false);
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
          setIsLoading(false);
        } else {
          console.error("Invalid response format for classes:", classesData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setIsLoading(false);
      }
    };

    fetchedClasses();
  }, []);

  const handleOnClick = (classId: string) => {
    router.push(`/classes/${classId}`);
    setIsLoading(true);
  };

  return (
    <>
      <div className="ml-2">
        {isLoading ? (
          <div className="flex justify-center items-center mt-[20%] h-full">
            <Loader />
          </div>
        ) : !cleanedUserRole ? (
          <RoleChooser />
        ) : (
          <div>
            {cleanedUserRole === "Teacher" ? (
              <div>
                <h1 className="mt-2 font-bold text-3xl">Created Classes</h1>
                {teacherClasses.length > 0 ? (
                  <div className="mt-5">
                    {teacherClasses.map((classItem) => (
                      <Card
                        key={classItem.classId}
                        className="cursor-pointer hover:scale-[102%] transition-all mb-4 ml-0 mx-auto w-[90%] p-4 bg-slate-200 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black"
                        onClick={() => handleOnClick(classItem.classId)}
                      >
                        <CardTitle>Class Name: {classItem.className}</CardTitle>
                        <CardTitle className="mb-2 mt-1 text-foreground/100 text-lg">
                          Teacher Name: {classItem.teacherName}
                        </CardTitle>
                        <CardDescription className="mb-2 mt-2">
                          Class Subject: {classItem.classSubject}
                        </CardDescription>
                        <CardDescription>
                          Class Code: {classItem.classId}
                        </CardDescription>
                      </Card>
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
            ) : cleanedUserRole === "Student" ? (
              <div>
                <h1 className="mt-2 font-bold text-3xl">Joined Classes</h1>
                {studentClasses.map((classItem) => (
                  <Card
                    key={classItem.classId}
                    className="mt-5 cursor-pointer hover:scale-[102%] transition-all mb-4 ml-0 mx-auto w-[90%] p-4 bg-slate-200 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black"
                    onClick={() => handleOnClick(classItem.classId)}
                  >
                    <CardTitle>Class Name: {classItem.className}</CardTitle>
                    <CardTitle className="mb-2 mt-1 text-foreground/100 text-lg">
                      Teacher Name: {classItem.teacherName}
                    </CardTitle>
                    <CardDescription className="mb-2 mt-2">
                      Class Subject: {classItem.classSubject}
                    </CardDescription>
                    <CardDescription>
                      Class Code: {classItem.classId}
                    </CardDescription>
                  </Card>
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
        )}
      </div>
    </>
  );
};

export default ClassesTable;
