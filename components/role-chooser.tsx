"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const RoleChooser = () => {
  const [role, setRole] = useState("No Role Selected");
  const router = useRouter();

  const { toast } = useToast();

  const handleOnClick = async () => {
    try {
      if (role === "Teacher" || role === "Student") {
        await axios.post("api/role", { role });
        toast({
          title: "Role Chosen",
          description: `Your designated role is ${role}`,
          variant: "success",
        });
        router.refresh();
      } else {
        // Handle the case where no role is selected
        toast({
          title: "No Role Selected",
          description: `Please select a role before continuing.`,
          variant: "destructive",
        });
      }
      router.push("/settings");
    } catch (error) {
      console.error("Error sending or fetching role:", error);
      toast({
        title: "It's not you, it's Us",
        description: `Something has gone wrong!`,
        variant: "destructive",
      });
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlertDialog defaultOpen>
        <AlertDialogContent className="w-full max-w-lg p-6 rounded-2xl shadow-xl bg-white dark:bg-[#18181B] dark:border-[#3A3A3D] border-2">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Choose Your Role
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              Please select one of the roles below:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-6 flex justify-around space-x-4">
            <div
              className={`cursor-pointer p-4 rounded-xl transition-transform transform border-2 ${
                role === "Teacher"
                  ? "border-blue-500 scale-105 shadow-lg"
                  : "border-transparent hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setRole("Teacher")}
            >
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                className="w-24 h-24 mx-auto rounded-full"
                width={96}
                height={96}
              />
              <h2 className="mt-2 text-center font-semibold text-gray-900 dark:text-white">
                Teacher
              </h2>
            </div>
            <div
              className={`cursor-pointer p-4 rounded-xl transition-transform transform border-2 ${
                role === "Student"
                  ? "border-blue-500 scale-105 shadow-lg"
                  : "border-transparent hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setRole("Student")}
            >
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="w-24 h-24 mx-auto rounded-full"
                width={96}
                height={96}
              />
              <h2 className="mt-2 text-center font-semibold text-gray-900 dark:text-white">
                Student
              </h2>
            </div>
          </div>
          <AlertDialogFooter className="mt-6 text-center">
            <AlertDialogAction
              onClick={handleOnClick}
              className={`w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 ${
                role === "Teacher" || role === "Student"
                  ? "bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!["Teacher", "Student"].includes(role)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default RoleChooser;
