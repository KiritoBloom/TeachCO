"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import Image from "next/image";

import { Skeleton } from "./ui/skeleton";
import { Card, CardDescription, CardTitle } from "./ui/card";

interface StudentCardProps {
  studentId: string;
  studentName: string;
  userId: string;
}

const StudentCard = ({ studentId, studentName, userId }: StudentCardProps) => {
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const res = await axios.get(
          `/api/profile/pictures/${userId}?userId=${userId}`
        );
        setProfilePic(res.data);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPicture();
  }, [userId]);

  return (
    <div>
      <Card className="p-2 border-2 w-full md:w-[30%] mb-2">
        <div className="flex justify-start items-center gap-x-2">
          {isLoading ? (
            <Skeleton className="h-[30px] w-[30px] rounded-2xl" />
          ) : (
            <Image
              src={profilePic || "/default-pic.png"}
              alt="Profile"
              width={30}
              height={30}
              className="rounded-2xl"
            />
          )}
          <CardTitle>{studentName}</CardTitle>
        </div>
        <CardDescription>{userId}</CardDescription>
        <CardDescription>{studentId}</CardDescription>
      </Card>
    </div>
  );
};

export default StudentCard;
