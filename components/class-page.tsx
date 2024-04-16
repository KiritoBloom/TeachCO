"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "./loader";
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

const ClassPage = () => {
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [students, setStudents] = useState<any>("");
  const pathName = usePathname();
  const classId = pathName.split("/").pop();
  const { role, isLoading } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassInformation = async () => {
      try {
        const res = await axios.get(`/api/class/class-info?classId=${classId}`);
        setClassInfo(res.data);
        setIsClassLoading(false);
      } catch (error) {
        console.log(error, "Something went wrong CLASSINFO");
      }
    };

    if (classId) {
      fetchClassInformation();
    }
  }, [classId]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `/api/class/class-info/students?classId=${classId}`
        );
        setStudents(res.data);
        setIsClassLoading(false);
      } catch (error) {
        console.log(error, "Something went wrong STUDENTFETCH");
      }
    };

    fetchStudents(); // Call the fetchStudents function to initiate the API request
  }, [classId]); // Make sure to include classId in the dependency array to trigger the effect when it changes

  const onCopy = (content: string) => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast({
      description: "Copied to clipboard",
      variant: "success",
    });
  };

  return isLoading || isClassLoading ? (
    <div className="flex justify-center items-center mt-[20%] h-full">
      <Loader />
    </div>
  ) : (
    <div className="mt-6 flex justify-center">
      {classInfo && (
        <div className="w-[95%] bg-white rounded-lg shadow-lg p-6 border-[2px]">
          <div className="flex justify-between">
            <h1 className="font-semibold text-5xl mb-4">
              {classInfo.className}
            </h1>
            <Card className="w-fit p-2 border-[3px]">
              <CardTitle className="text-lg">Class ID</CardTitle>
              <div className="flex mt-1 justify-center items-center">
                <CardDescription className="text-black text-xl mr-2">
                  {classId}
                </CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        onClick={() => classId && onCopy(classId)}
                        className="opacity-100 group-hover:opacity-100 transition-all ease-in-out"
                        size="icon"
                        variant="ghost"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          </div>
          <p className="text-gray-600 text-lg mb-2">{classInfo.teacherName}</p>
          <p className="text-gray-600 text-md mb-2">
            Teacher ID: {classInfo.teacherId}
          </p>
          <div className="font-bold text-xl">
            <h2>Students</h2>
            {students?.length === 0 ? (
              <div className="text-gray-600 mt-2">No students found</div>
            ) : (
              students?.map((student: any) => (
                <div key={student.id} className="border-2 mt-2 p-2">
                  {student.name}
                  <p>In Class ID: {student.id}</p>
                  <p>User ID: {student.userId}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
