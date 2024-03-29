"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "./loader";

const ClassPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>(null);
  const pathName = usePathname();
  const classId = pathName.split("/").pop();

  useEffect(() => {
    const fetchClassInformation = async () => {
      try {
        const res = await axios.get(`/api/class/class-info?classId=${classId}`);
        setClassInfo(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error, "Something went wrong");
      }
    };

    if (classId) {
      fetchClassInformation();
    }
  }, [classId]);

  // Render teacherId only when classInfo is not null
  return isLoading ? (
    <div className="flex justify-center items-center mt-[20%] h-full">
      <Loader />
    </div>
  ) : (
    <div className="ml-2">
      {classInfo && classInfo.teacherId && <div>{classInfo.teacherId}</div>}
    </div>
  );
};

export default ClassPage;
