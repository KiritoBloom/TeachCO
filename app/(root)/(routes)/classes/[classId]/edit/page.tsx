"use client";

import ClassImage from "@/components/class-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useUserRole from "@/hooks/role";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { LucidePenBox } from "lucide-react";
import {
  AcademicCapIcon,
  ArrowLeftCircleIcon,
  BeakerIcon,
  CheckIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import Loading from "@/app/(root)/loading";
import themeHook from "@/hooks/theme";

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
  const resolvedTheme = themeHook();

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
      <div
        className={cn("flex justify-center items-center bg-wavy min-h-screen", {
          "dark-wavy": resolvedTheme === "dark",
        })}
      >
        <Loading />
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
      if (!className && !classSubject) {
        toast({
          description: "Must change class name or subject to edit",
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
    } catch (error) {
      toast({
        description: "An error occurred",
        variant: "destructive",
      });

      console.error(error);
    }
  };

  const handleOnDelete = async (classId: string) => {
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

  const handleOnBack = () => {
    router.refresh();
    router.push(`/classes/${classId}`);
  };

  return (
    <div
      className={cn(
        "bg-wavy dark:bg-dark-wavy min-h-screen flex flex-col items-center justify-center p-3 md:p-12 text-gray-800",
        {
          "dark-wavy": resolvedTheme === "dark",
        }
      )}
    >
      {classInfo && (
        <>
          <div className="w-full max-w-4xl bg-white/10 dark:bg-black/70 backdrop-blur rounded-2xl shadow-lg p-8">
            <div
              onClick={() => handleOnBack()}
              className="mb-5 group cursor-pointer flex items-center gap-2 border-2 rounded-xl w-fit p-3 border-black bg-white dark:bg-[#29292f] transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <ArrowLeftCircleIcon className="w-6 h-6 text-black dark:text-white" />
              <span className="font-bold tracking-wide text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                Back to Class
              </span>
            </div>

            <div className="w-full max-w-4xl text-center mb-8 flex justify-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-x-2">
                Edit Your Class
                <LucidePenBox className="w-6 h-6" />
              </h1>
            </div>
            <div className="flex justify-center mb-8">
              <ClassImage
                userId={classInfo.teacherId}
                className="rounded-full shadow-md"
                width={150}
                height={150}
                skeletonStyle="w-[150px] h-[150px] rounded-full mb-4"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center text-gray-600 mb-2">
                <UserIcon className="w-6 h-6 text-gray-500 mr-2 dark:text-white" />
                <span className="text-xl font-medium dark:text-white">
                  Teacher Name
                </span>
              </div>
              <Input
                className="cursor-not-allowed w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder={classInfo.teacherName}
                readOnly
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center text-gray-600 mb-2">
                <AcademicCapIcon className="w-6 h-6 text-gray-500 mr-2 dark:text-white" />
                <span className="text-xl font-medium dark:text-white">
                  Class Name
                </span>
              </div>
              <Input
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder={classInfo.className}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center text-gray-600 mb-2">
                <BeakerIcon className="w-6 h-6 text-gray-500 mr-2 dark:text-white" />
                <span className="text-xl font-medium dark:text-white">
                  Subject
                </span>
              </div>
              <Input
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder={classInfo.classSubject}
                value={classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center mt-12 space-x-6">
        <Button
          className="px-8 py-3 bg-black text-white font-semibold rounded-3xl hover:translate-y-1 hover:bg-black transition-transform transform"
          onClick={handleOnEdit}
        >
          Confirm <CheckIcon className="w-5 h-5 ml-2" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <Button className="px-8 py-3 bg-gray-300 text-gray-700 font-semibold rounded-3xl hover:translate-y-1 hover:bg-gray-300 transition-transform transform">
              Delete Class <TrashIcon className="w-5 h-5 ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[95%] rounded-2xl dark:bg-[#18181B] dark:border-[#3A3A3D]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                class and all students associated
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[2px] bg-transparent dark:border-[#3A3A3D]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleOnDelete(classId)}
                className="w-full md:w-fit hover:translate-y-[2px] z-100 bg-gray-200 hover:bg-gray-200 rounded-2xl flex items-center gap-x-2 text-black transition-all duration-100"
              >
                Delete Class <TrashIcon className="w-4 h-4" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
