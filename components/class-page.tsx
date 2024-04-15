"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "./loader";
import useUserRole from "@/hooks/role";

const ClassPage = () => {
  const [isClassLoading, setIsClassLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<any>(null);
  const pathName = usePathname();
  const classId = pathName.split("/").pop();
  const { role, isLoading } = useUserRole();

  useEffect(() => {
    const fetchClassInformation = async () => {
      try {
        const res = await axios.get(`/api/class/class-info?classId=${classId}`);
        setClassInfo(res.data);
        setIsClassLoading(false);
      } catch (error) {
        console.log(error, "Something went wrong");
      }
    };

    if (classId) {
      fetchClassInformation();
    }
  }, [classId]);

  // Render teacherId only when classInfo is not null
  return isLoading || isClassLoading ? (
    <div className="flex justify-center items-center mt-[20%] h-full">
      <Loader />
    </div>
  ) : (
    <div className="mt-2 flex justify-center">
      {classInfo && (
        <div className="w-[95%] border-2 rounded-md p-3">
          <h1 className="font-bold text-3xl">{classInfo.className}</h1>
          <p>{classInfo.teacherId}</p>
          <p>{classInfo.teacherName}</p>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
