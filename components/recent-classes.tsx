"use client";

import { Suspense, useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "./ui/card";
import axios from "axios";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronsDownIcon } from "lucide-react";

interface ClassData {
  classId: string;
  className: string;
  teacherName: string;
  classSubject: string;
}

const RecentClasses = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getClasses = async () => {
      try {
        const res = await axios.get("/api/class/recent");
        const response = res.data;
        setClasses(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recent classes:", error);
        setIsLoading(false);
      }
    };

    getClasses();
  }, []);

  const handleOnClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleOnRedirect = () => {
    router.push("/classes");
  };

  return (
    <>
      <div className="flex justify-center">
        <Card className="md:w-[90%] w-[95%] h-fit p-3 border-[3px]">
          <h1 className="font-bold text-2xl">Recent classes</h1>
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
              <Loader />
            </div>
          ) : (
            <>
              {classes.length > 0 ? (
                classes.slice(0, 3).map((classItem) => (
                  <Card
                    key={classItem.classId}
                    className="mt-8 hover:scale-[101%] cursor-pointer transition-all mb-4 ml-0 mx-auto w-[90%] md:w-[40%] p-4 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black/20"
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
                  </Card>
                ))
              ) : (
                <p>No recent classes found</p>
              )}
              <div className="flex justify-center mt-5">
                <Button
                  onClick={() => handleOnRedirect()}
                  className="w-[95%] rounded-3xl bg-gray-200 hover:bg-gray-200 text-black/70 font-bold gap-x-1 hover:scale-[101%] transition-all"
                >
                  View More <ChevronsDownIcon className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default RecentClasses;
