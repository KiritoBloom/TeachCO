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

const ClassPage = () => {
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [students, setStudents] = useState<any>("");
  const pathName = usePathname();
  const classId = pathName.split("/").pop();
  const { role, isLoading } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const [classInfoRes, studentsRes] = await Promise.all([
          axios.get(`/api/class/class-info?classId=${classId}`),
          axios.get(`/api/class/class-info/students?classId=${classId}`),
        ]);

        setClassInfo(classInfoRes.data);
        setStudents(studentsRes.data);
        setIsClassLoading(false);
      } catch (error) {
        console.error("Something went wrong:", error);
        setIsClassLoading(false);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

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
                <>
                  <StudentCard
                    studentId={student.id}
                    studentName={student.name}
                    userId={student.userId}
                  />
                </>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
