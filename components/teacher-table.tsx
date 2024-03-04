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
  const router = useRouter();
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
    <div className="flex justify-center mt-5">
      <Card className="w-[95%]">
        <CardHeader>
          <CardTitle>Create a class</CardTitle>
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
          <Button className="w-full" onClick={handleOnClick}>
            Create Class
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherTable;
