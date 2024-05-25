"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { ChevronsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import ClassImage from "@/components/class-image";

interface ClassData {
  classId: string;
  className: string;
  teacherName: string;
  teacherId: string;
  classSubject: string;
}

const RecentClasses = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getClasses = async () => {
      try {
        const res = await axios.get("/api/class/recent");
        const response = res.data;
        setClasses(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recent classes:", error);
        setIsLoading(false);
      }
    };

    getClasses();
  }, []);

  const handleOnClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleOnRedirect = () => {
    router.push("/classes");
  };

  const validClasses = classes.filter(Boolean).slice(0, 3);

  return (
    <div className="flex md:justify-start justify-center md:ml-5 mt-5">
      <Card className="md:w-[90%] w-[95%] h-fit p-3 border-[3px] bg-gray-100 dark:bg-black/70">
        {isLoading ? (
          <div className="flex justify-center items-center w-full">
            <Loader />
          </div>
        ) : (
          <div className="flex justify-center flex-col">
            <div className="mx-auto">
              <h1 className="font-semibold text-3xl">Recent Classes</h1>
            </div>
            {validClasses.length > 0 ? (
              <div className="my-4 w-full">
                <Carousel className="md:relative w-full h-full">
                  <CarouselContent className="flex mx-auto md:mx-0 md:justify-center h-full">
                    {validClasses.map((classItem) => (
                      <CarouselItem
                        key={classItem.classId}
                        className="flex flex-col items-center w-full h-full p-6 md:basis-1/2 lg:basis-1/4"
                      >
                        <div className="transition-all hover:shadow-lg p-10 rounded-xl glass dark:bg-white/10 shadow-lg border-[2px] border-black flex flex-col items-center">
                          {/* Class Icon or Image */}
                          <ClassImage userId={classItem.teacherId} />

                          {/* Class Information */}
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                            {classItem.className}
                          </h2>
                          <p className="text-md text-gray-600 mt-2 dark:text-white/50">
                            Class ID: {classItem.classId}
                          </p>
                          <p className="text-md text-gray-600 dark:text-white/50">
                            Class Subject: {classItem.classSubject}
                          </p>

                          {/* Additional Information (e.g., teacher name, schedule, etc.) */}
                          <p className="text-sm text-gray-500 mt-2 dark:text-white/50">
                            Taught by: {classItem.teacherName}
                          </p>

                          {/* Call-to-Action */}
                          <button
                            onClick={() => handleOnClick(classItem.classId)}
                            className="mt-10 bg-primary text-white dark:text-black py-2 px-4 rounded-full transition hover:bg-primary-dark hover:translate-y-[2px]"
                          >
                            View Class
                          </button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 md:hidden bg-gray-200 dark:text-black dark:hover:bg-white/50 p-2 rounded-full" />
                  <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 md:hidden bg-gray-200 dark:text-black dark:hover:bg-white/50 p-2 rounded-full" />
                </Carousel>
              </div>
            ) : (
              <div className="rounded-xl p-3 w-fit mx-auto mt-2">
                <div className="flex justify-center items-center">
                  <Image
                    width={350}
                    height={350}
                    src="/empty.png"
                    alt="Not Found"
                    className="grayscale"
                  />
                </div>
                <div className="flex justify-center items-center">
                  <p className="font-semibold text-2xl">
                    No recent classes found
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-5">
              <Button
                onClick={handleOnRedirect}
                className={cn(
                  "w-[95%] rounded-3xl bg-black text-white transition-all font-semibold gap-x-1",
                  "hover:translate-y-[5%] hover:text-opacity-70 hover:bg-black dark:text-black dark:bg-white",
                  {
                    hidden: validClasses.length === 0,
                  }
                )}
              >
                View More <ChevronsDownIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecentClasses;
