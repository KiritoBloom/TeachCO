"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const ClassJoin = () => {
  const [classId, setClassId] = useState("");
  const { toast } = useToast();

  const handleOnClick = async () => {
    try {
      if (!classId) {
        toast({
          title: "Please Input Class ID ❌",
          variant: "destructive",
        });
        return;
      }
      await axios.post("/api/class/class-join", { classId });
      toast({
        title: "Joined Class",
        description: "Check out your joined classes in the classes tab ✔️",
        variant: "success",
      });
    } catch (error) {
      console.log(error, "Error has occurred, CLASS JOIN POST");
      toast({
        title: "It's not you its Us ❌",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="md:ml-5 mx-auto mt-5 w-[95%] md:w-[40%] lg:w-[30%] h-full border-[2px] dark:bg-black/50 border-black/10 bg-slate-200 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Join a class</CardTitle>
          <CardDescription>Enter a valid class code</CardDescription>
        </CardHeader>
        <CardContent className="flex-col">
          <Input
            placeholder="ex. 283608"
            className="transition-all duration-150"
            onChange={(e) => setClassId(e.target.value)}
            type="text"
            pattern="[0-9]*"
            maxLength={6 as number}
          />
          <Button
            className="bg-black hover:bg-black dark:bg-white dark:hover:bg-white hover:scale-[101%] w-full rounded-lg p-1 mt-2 transition-all duration-150"
            onClick={handleOnClick}
          >
            <h1 className="font-semibold dark:text-black">Join</h1>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassJoin;
