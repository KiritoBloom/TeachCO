"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TeacherTable = () => {
  const { toast } = useToast();
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  };

  const handleOnClick = async () => {
    try {
      // Make sure class name and subject are not empty
      if (!className || !subject) {
        toast({
          title: `Please fill in both Class Name and Subject ❌`,
          variant: "destructive",
        });
        return;
      }

      const classId = generateRandomId();

      // Send class name and subject in the request body
      await axios.post("/api/class", { className, subject, classId });

      toast({
        title: `Class Created ✔️`,
        description: `Check out your class at the classes tab`,
        variant: "success",
      });
    } catch (error) {
      console.log("Something went Wrong");
      toast({
        title: `Something went Wrong ❌`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center md:justify-start mt-5 md:ml-5 ml-0">
      <Card className="md:w-[90%] w-[95%] rounded-xl bg-gray-100 dark:bg-black/70 border-[3px]">
        <CardHeader>
          <CardTitle className="dark:text-white">Create a class</CardTitle>
          <CardDescription>Input your classes name and subject</CardDescription>
        </CardHeader>
        <CardContent className="flex-wrap">
          <Input
            placeholder="Class Name"
            className="mt-2 mb-5 transition-all"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <Input
            placeholder="Subject"
            className="transition-all"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-black hover:translate-y-1 rounded-3xl transition-all hover:bg-black dark:text-black dark:font-semibold dark:bg-white"
            onClick={handleOnClick}
          >
            Create Class
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherTable;
