"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Skeleton } from "./ui/skeleton";
import { Card, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";

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
      <Card className="p-2 border-2 w-full md:w-[400px] mb-2 bg-gray-100/70">
        <div className="flex justify-start items-center gap-x-2">
          {isLoading ? (
            <Skeleton className="h-[30px] w-[30px] rounded-2xl" />
          ) : (
            <Image
              src={profilePic || "/student.png"}
              alt="Profile"
              width={30}
              height={30}
              className="rounded-2xl"
            />
          )}
          <CardTitle>{studentName}</CardTitle>
        </div>
        <CardDescription>
          <span className="font-semibold">UserId:</span> {userId}
        </CardDescription>
        <CardDescription>
          <span className="font-semibold">ClassId:</span> {studentId}
        </CardDescription>
      </Card>
    </div>
  );
};

export default StudentCard;
