import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import axios from "axios";
import ClassImage from "./class-image";

interface PostProps {
  title: string;
  description: string;
  isPinned: boolean;
  postId: string;
  createdAt: Date;
  posterId: string;
  posterName: string;
}

const PostContainer = ({
  title,
  description,
  isPinned,
  postId,
  createdAt,
  posterId,
  posterName,
}: PostProps) => {
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSrc = async () => {
      try {
        const res = await axios.get(
          `/api/profile/pictures/${posterId}?userId=${posterId}`
        );
        setSrc(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchSrc();
  }, [posterId]);

  return (
    <div className="flex justify-center md:justify-start">
      <Card className="max-w-[400px] border p-2 rounded-md">
        <CardHeader className="flex gap-3">
          <ClassImage
            userId={posterId}
            width={40}
            height={40}
            className="mb-0"
            skeletonStyle="mb-0 rounded-3xl h-[40px] w-[40px]"
          />
          <div className="flex flex-col">
            <p className="text-md">{posterName}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{description}</p>
        </CardBody>
        <Divider />
        <CardFooter>
          Created At: {new Date(createdAt).toLocaleString()}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostContainer;
