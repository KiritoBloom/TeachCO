"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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

export default function Page() {
  const { user } = useUser();
  const { userId } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [updatedRole, setUpdatedRole] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userRole !== null || userRole !== "Success null") {
      const getUserRole = async () => {
        try {
          const response = await axios.get("/api/role");
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } finally {
          setIsLoading(false);
          router.refresh();
        }
      };
      getUserRole();
    } else {
      setIsLoading(false); // Set loading to false if userRole is null or "Success null"
    }
  }, [userRole]);

  const cleanedUserRole = userRole
    ?.replace("Success", "")
    .replace(/"role":/g, "")
    .replace(/[{}"]/g, "")
    .trim();

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
      console.log("Something went Wrong");
    }
  };

  const handleOnSubmit = async () => {
    try {
      if (inputValue && updatedRole) {
        await axios.patch("/api/profile", {
          inputValue,
          updatedRole,
        });
        await toast({
          title: "Profile has been edited ✔️",
          variant: "success",
        });
        router.refresh();
      } else {
        await toast({
          title: "Input a new Name and assign a new Role to proceed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error, "Something Went Wrong");
      await toast({
        title: "Something Went Wrong ❌",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleOnDelete = async () => {
    try {
      await axios.delete("/api/profile");
      router.push("/");
    } catch (error) {
      console.log(error, "Something went Wrong ❌");
      await toast({
        title: "Something Went Wrong ❌",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center mt-[20%] h-full">
      <Loader />
    </div>
  ) : !cleanedUserRole ? (
    <RoleChooser />
  ) : (
    <div className="ml-2 mt-2">
      <h1 className="font-semibold text-3xl">Edit Your Profile:</h1>
      <Avatar className="w-full h-full flex justify-center items-center mt-5">
        <AvatarImage
          src={user?.imageUrl}
          className="w-[20%] h-[20%] rounded-[50%]"
        />
        <AvatarFallback>UL</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-lg font-semibold mt-5 flex items-center gap-x-1">
          <Mail className="w-5 h-5" /> Email:
        </h1>
        <div className="flex justify-start items-center">
          <Input
            placeholder={
              user?.primaryEmailAddress?.toString() ||
              "Enter your Email Address"
            }
            className="transition-all duration-150 mt-2 w-[95%] flex justify-start items-start"
            readOnly
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() =>
                    user?.primaryEmailAddress &&
                    onCopy(user?.primaryEmailAddress?.toString())
                  }
                  className="opacity-100 group-hover:opacity-100 transition-all ease-in-out mt-2 ml-2"
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
          <User className="w-5 h-5" /> UserID:
        </h1>
        <div className="flex justify-start items-center">
          <Input
            placeholder={
              userId ? userId.toString() : "Enter your Email Address"
            }
            className="transition-all duration-150 mt-2 w-[95%] flex justify-start items-start"
            readOnly
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => userId && onCopy(userId.toString())}
                  className="opacity-100 group-hover:opacity-100 transition-all ease-in-out mt-2 ml-2"
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
          <CircleUserRound className="w-5 h-5" /> Username:
        </h1>
        <div className="flex-col justify-start items-center">
          <Input
            placeholder={user?.firstName || "Enter your first name"}
            className={cn(
              "transition-all duration-150 mt-2 w-[95%] flex justify-start items-start",
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
        <h1 className="text-lg font-semibold mt-5">Role:</h1>
        <RadioGroup
          defaultValue={
            cleanedUserRole === "Student" ? "option-one" : "option-two"
          }
          className="flex-col items-center pb-5"
        >
          <Label htmlFor="student" className="cursor-pointer">
            <div
              className="flex items-center space-x-5 border-2 border-black/30 transition-all w-[95%] cursor-pointer p-3 rounded-md"
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
              className="flex items-center space-x-2 transition-all border-2 border-black/30 w-[95%] cursor-pointer p-3 rounded-md"
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
        <Button
          className="mb-5 hover:scale-[110%] transition-all"
          onClick={handleOnSubmit}
        >
          Confirm <Check className="ml-2" />
        </Button>
        <Button
          className="mb-5 ml-5 bg-red-500 hover:scale-[110%] hover:bg-red-500 transition-all"
          onClick={handleOnDelete}
        >
          Delete Account <Trash className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
