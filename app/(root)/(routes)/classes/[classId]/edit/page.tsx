"use client";

import ClassImage from "@/components/class-image";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useUserRole from "@/hooks/role";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Check, Microscope, School, Trash, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const pathname = usePathname();
  const { role, isLoading } = useUserRole();
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>("");
  const { userId } = useAuth();
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [classSubject, setClassSubject] = useState("");
  const { toast } = useToast();

  const classId = pathname.split("/").filter(Boolean).slice(-2, -1)[0];

  const teacherId = classInfo.teacherId;

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classInfoRes = await axios.get(
          `/api/class/class-info?classId=${classId}`
        );
        setClassInfo(classInfoRes.data);
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

  if (isLoading || isClassLoading) {
    return (
      <div className="flex justify-center items-center mt-[20%]">
        <Loader />
      </div>
    );
  }

  if (!classInfo) {
    return <div>No Class Data to edit</div>;
  }

  if (userId !== classInfo.teacherId) {
    router.push("/");
    return (
      <div>
        <h1>User Unauthorized</h1>
      </div>
    );
  }

  const handleOnEdit = async () => {
    try {
      // Check if className or classSubject are missing
      if (!className || !classSubject) {
        toast({
          description: "Must change className and subject to edit",
          variant: "destructive",
        });

        return;
      }

      await axios.patch(`/api/class/class-info?classId=${classId}`, {
        classSubject,
        className,
        teacherId,
      });

      toast({
        title: "Successfully edited!",
        variant: "success",
      });
      console.log("Clicked");
    } catch (error) {
      // If an error occurs, show the destructive toast
      toast({
        description: "An error occurred",
        variant: "destructive",
      });

      console.error(error); // Log the error for debugging
    }
  };

  return (
    <div className="p-4 text-gray-800">
      <div className="flex justify-center mb-3">
        <h1 className="font-bold text-2xl">Edit your class</h1>
      </div>
      {classInfo && (
        <div className="flex flex-col items-center w-full">
          <div className="mx-auto w-full flex flex-col items-center">
            <ClassImage
              userId={classInfo.teacherId}
              className="border-[4px] p-1"
              width={300}
              height={1000}
            />
          </div>
          <div className="w-full sm:w-2/3 lg:w-1/2 mt-6">
            <div className="mb-5">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-gray-500 mr-1" />
                <h2 className="text-gray-600">Teacher Name</h2>
              </div>
              <Input
                className="cursor-not-allowed w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={classInfo.teacherName}
                readOnly
              />
            </div>
            <div>
              <div className="flex items-center mb-2 mt-10">
                <School className="w-5 h-5 text-gray-500 mr-1" />
                <h2 className="text-gray-600">Class Name</h2>
              </div>
              <Input
                className={cn(
                  "w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                )}
                placeholder={classInfo.className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center mb-2 mt-10">
                <Microscope className="w-5 h-5 text-gray-500 mr-1" />
                <h2 className="text-gray-600">Subject</h2>
              </div>
              <Input
                className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={classInfo.classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center pt-20">
        <Button
          className="mb-5 hover:translate-x-1 transition-all bg-black hover:bg-black rounded-3xl"
          onClick={() => handleOnEdit()}
        >
          Confirm <Check className="ml-2" />
        </Button>
        <Button className="mb-5 ml-5 bg-gray-200 hover:translate-x-1 hover:bg-gray-200 transition-all text-black rounded-3xl">
          Delete Class <Trash className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
