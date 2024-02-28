"use client";

import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { usePathname, useRouter } from "next/navigation";

const RoleChooser = () => {
  const [role, setRole] = useState(
    "No Role Selected" || "Teacher" || "Student"
  );

  const { toast } = useToast();

  const handleOnClick = async () => {
    if (role === "Teacher" || role === "Student") {
      try {
        await axios.post("api/role", { role });
        toast({
          title: "Role Chosen",
          description: `Your designated role is ${role}`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error sending role to API:", error);
        toast({
          title: "It's not you it's Us",
          description: `Something has gone wrong!`,
          variant: "destructive",
        });
      }
    } else {
      // Handle the case where an invalid role is selected
      console.error("Invalid role selected");
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Who are you?</AlertDialogTitle>
            <AlertDialogDescription className="font-semibold">
              Select your designated role:
            </AlertDialogDescription>
            <div className="flex justify-around">
              <div
                className={cn(
                  "cursor-pointer hover:bg-foreground/10 hover:scale-110 rounded-md p-3 transition-all duration-150 border-2 border-black/10 mt-5",
                  role === "Teacher" && "bg-primary/10 scale-110"
                )}
                onClick={() => setRole("Teacher")}
              >
                <AlertDialogDescription>
                  <Image
                    src="/teacher.png"
                    alt="teacher-logo"
                    className="rounded-[50%] p-1 border-2 border-black/10 w-20 h-20"
                    width={500}
                    height={500}
                  />
                  <h1 className="flex justify-center items-center mt-2">
                    Teacher
                  </h1>
                </AlertDialogDescription>
              </div>
              <div
                className={cn(
                  "cursor-pointer hover:bg-foreground/10 hover:scale-110 rounded-md p-3 transition-all duration-150 border-2 border-black/10 mt-5",
                  role === "Student" && "bg-primary/10 scale-110"
                )}
                onClick={() => setRole("Student")}
              >
                <AlertDialogDescription>
                  <Image
                    src="/student.png"
                    alt="student-logo"
                    className="rounded-[50%] p-2 border-2 border-black/10 w-20 h-20"
                    width={200}
                    height={200}
                  />
                  <h1 className="flex justify-center items-center mt-2">
                    Student
                  </h1>
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {role === "Teacher" || role === "Student" ? (
              <AlertDialogAction onClick={handleOnClick}>
                Continue
              </AlertDialogAction>
            ) : (
              <AlertDialogAction className="cursor-not-allowed opacity-50">
                Continue
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoleChooser;
