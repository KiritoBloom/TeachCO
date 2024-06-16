"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, CircleUserRound, Copy, Mail, Trash, User } from "lucide-react";
import RoleChooser from "@/components/role-chooser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useTheme } from "next-themes";

export default function Page() {
  const { user } = useUser();
  const { userId } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const { role, isLoading } = useUserRole();
  const [updatedRole, setUpdatedRole] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFirstNameMatch = user?.firstName === inputValue;

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

  const handleOnClick = (role: string) => {
    try {
      setUpdatedRole(role);
      console.log({ updatedRole });
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleOnSubmit = async () => {
    try {
      if (inputValue || updatedRole) {
        await axios.patch("/api/profile", {
          inputValue,
          updatedRole,
        });
        localStorage.setItem("userRole", JSON.stringify(updatedRole));
        toast({
          title: "Profile has been edited ✔️",
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Input a new Name and assign a new Role to proceed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error, "Something went wrong");
      toast({
        title: "Something went wrong ❌",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleOnDelete = async () => {
    try {
      await axios.delete("/api/profile");
      router.push("/sign-up/[[...sign-in]]");
      localStorage.removeItem("userRole");
    } catch (error) {
      console.log(error, "Something went wrong ❌");
      toast({
        title: "Something went wrong ❌",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div
        className={cn("flex justify-center items-center min-h-screen bg-wavy", {
          "dark-wavy": resolvedTheme === "dark",
        })}
      >
        <Loader />
      </div>
    );
  }

  if (!role) {
    return <RoleChooser />;
  }

  return (
    <div
      className={cn("bg-wavy md:min-h-[100vh]", {
        "dark-wavy": resolvedTheme === "dark",
      })}
    >
      <div className={cn("pl-2 pt-2")}>
        <Avatar className="w-full h-full flex justify-center items-center mt-10 md:mt-12">
          <AvatarImage
            src={user?.imageUrl}
            className="md:w-[30%] lg:w-[15%] w-[50%] h-[20%] rounded-[50%]"
          />
          <AvatarFallback className="w-20 h-20 p-[7%] rounded-[50%]">
            UL
          </AvatarFallback>
        </Avatar>
        <div className="flex justify-center items-center mt-5 mb-5">
          <h1 className="font-semibold text-3xl">Edit Your Profile</h1>
        </div>
        <div className="flex flex-col lg:flex-row justify-start gap-x-10">
          <div>
            <h1 className="text-lg font-semibold mt-5 flex items-center">
              Email
            </h1>
            <div className="flex justify-start items-center md:w-[500px] lg:w-[450px] xl:w-[500px] w-[360px]">
              <div className="w-full flex items-center">
                <div className="w-full flex items-center justify-between">
                  <div className="relative w-full">
                    <Input
                      placeholder={
                        user?.primaryEmailAddress?.toString() ||
                        "Enter your Email Address"
                      }
                      className="transition-all duration-150 mt-2 pr-4 py-2 border rounded-xl dark:bg-[#18181B] dark:border-[#3A3A3D]"
                      readOnly
                    />
                    <Mail className="absolute right-2 top-1/2 transform -translate-y-1/4 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() =>
                        user?.primaryEmailAddress &&
                        onCopy(user?.primaryEmailAddress?.toString())
                      }
                      className="opacity-100 group-hover:bg-primary/10 transition-all ease-in-out mt-2 ml-1 mr-1 md:mr-1"
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
          </div>
          <div>
            <h1 className="text-lg font-semibold mt-5 flex items-center gap-x-1">
              UserID
            </h1>
            <div className="flex justify-start items-center md:w-[500px] lg:w-[450px] xl:w-[500px] w-[360px]">
              <div className="w-full flex items-center">
                <div className="w-full flex items-center justify-between">
                  <div className="relative w-full">
                    <Input
                      placeholder={
                        userId ? userId.toString() : "Enter your Email Address"
                      }
                      className="transition-all duration-150 mt-2 flex justify-start items-start rounded-xl dark:bg-[#18181B] dark:border-[#3A3A3D]"
                      readOnly
                    />
                    <User className="absolute top-1/2 right-1 transform -translate-y-1/4 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => userId && onCopy(userId.toString())}
                      className="opacity-100 group-hover:bg-primary/10 transition-all ease-in-out mt-2 ml-1 mr-1 md:mr-1"
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
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold mt-5 flex items-center gap-x-1">
            <CircleUserRound className="w-5 h-5" /> Username
          </h1>
          <div className="flex-col justify-start items-center">
            <Input
              placeholder={user?.firstName || "Enter your first name"}
              className={cn(
                "transition-all duration-150 mt-2 w-[95%] flex justify-start items-start rounded-xl dark:bg-[#18181B] dark:border-[#3A3A3D]",
                {
                  "border-red-500 transition-all": isFirstNameMatch,
                }
              )}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {isFirstNameMatch && (
              <p className="text-red-500 mt-1 animate-enlarge transition-all">
                User name is the same as the input value.
              </p>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold mt-5">Role</h1>
          <RadioGroup
            defaultValue={role === "Student" ? "option-one" : "option-two"}
            className="flex-col items-center pb-5 "
          >
            <Label htmlFor="student" className="cursor-pointer">
              <div
                className="flex items-center space-x-5 border-2 border-black/30 transition-all w-[95%] cursor-pointer p-3 rounded-xl bg-white dark:bg-[#18181B] dark:border-[#3A3A3D]"
                onClick={() => handleOnClick("Student")}
              >
                <RadioGroupItem
                  value="option-one"
                  id="student"
                  className="mr-2"
                />
                Student
              </div>
            </Label>
            <Label htmlFor="teacher" className="cursor-pointer">
              <div
                className="flex items-center space-x-2 transition-all border-2 border-black/30 w-[95%] cursor-pointer p-3 rounded-xl bg-white dark:bg-[#18181B] dark:border-[#3A3A3D]"
                onClick={() => handleOnClick("Teacher")}
              >
                <RadioGroupItem
                  value="option-two"
                  id="teacher"
                  className="mr-2"
                />
                Teacher
              </div>
            </Label>
          </RadioGroup>
          <div className="flex justify-center md:justify-center items-center">
            <Button
              className="mb-5 hover:scale-[103%] transition-all bg-black hover:bg-black dark:text-white rounded-3xl"
              onClick={handleOnSubmit}
            >
              Confirm <Check className="ml-2" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  className="mb-5 ml-5 bg-gray-200 hover:scale-[103%] hover:bg-gray-200 transition-all text-black rounded-3xl"
                  onClick={handleOnDelete}
                >
                  Delete <Trash className="ml-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%] rounded-xl dark:bg-[#18181B] dark:border-[#3A3A3D]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent dark:border-[#3A3A3D] rounded-2xl">
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleOnDelete}
                    className="w-full md:w-fit hover:translate-y-[2px] z-100 bg-gray-200 hover:bg-gray-200 rounded-2xl flex items-center gap-x-2 text-black transition-all duration-100"
                  >
                    Delete <Trash className="w-4 h-4" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
