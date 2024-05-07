import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface ClassImageInterface {
  userId: string;
  className?: string; // Optional class name prop
}

const ClassImage = ({ userId, className = "" }: ClassImageInterface) => {
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSrc = async () => {
      try {
        const res = await axios.get(
          `/api/profile/pictures/${userId}?userId=${userId}`
        );
        setSrc(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchSrc();
  }, [userId]);

  if (isLoading) {
    return <Skeleton className={`h-[45px] w-[45px] rounded-3xl mb-5`} />;
  }

  return (
    <div>
      <Image
        src={src || "/logo.png"} // Example icon, replace with your image or icon
        alt={`Class Icon`}
        className={`mb-4 rounded-full ${className}`}
        width={50}
        height={50}
      />
    </div>
  );
};

export default ClassImage;
