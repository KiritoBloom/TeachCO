"use client";

import { ArrowBigRight, ArrowBigRightIcon, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ClassJoin = () => {
  return (
    <div>
      <Card className="md:ml-5 mx-auto mt-5 w-[95%] md:w-[30%] h-full border-[2px] border-black/10 bg-slate-200 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Join a class</CardTitle>
          <CardDescription>Enter a valid class code</CardDescription>
        </CardHeader>
        <CardContent className="flex-col">
          <Input
            placeholder="ex. 283608"
            className="transition-all duration-150"
          />
          <Button className="bg-black w-full rounded-lg p-1 mt-2 hover:bg-foreground/80 transition-all duration-150">
            <h1 className="font-semibold">Join</h1>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassJoin;
