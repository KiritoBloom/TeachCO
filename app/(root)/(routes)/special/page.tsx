"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import RoleChooser from "@/components/role-chooser";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import TeacherTable from "@/components/teacher-table";
import StudentTable from "@/components/student-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RecentClasses from "@/components/recent-classes";
import useUserRole from "@/hooks/role";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Wand2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import UserCard from "@/components/user-card";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { DateRangePicker } from "@nextui-org/date-picker";

const HomeTable = () => {
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const { role, isLoading } = useUserRole();
  const { theme, resolvedTheme } = useTheme();
  const [bgClass, setBgClass] = useState("bg-wavy");

  useEffect(() => {
    // Determine the appropriate class based on the theme
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setBgClass(currentTheme === "dark" ? "dark-wavy" : "bg-wavy");
  }, [theme, resolvedTheme]);

  const handleOnClick = () => {
    router.push("/settings");
  };

  return <DateRangePicker />;
};

export default HomeTable;
