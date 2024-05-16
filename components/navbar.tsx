"use client";

import { cn } from "@/lib/utils";
import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Book,
  BookA,
  Hammer,
  Home,
  Settings,
  ShoppingBasket,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { userId } = useAuth();
  const special = "user_2cvQymq0ODUUtDr4VQ8AlCgKDyN";

  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
    },
    {
      icon: Book,
      href: "/classes",
      label: "Classes",
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Settings",
    },
  ];

  if (userId === special) {
    routes.push({
      icon: Hammer,
      href: "/special", // adjust the href to your desired route
      label: "Developer",
    });
  }

  const onNavigate = (url: string) => {
    return router.push(url);
  };

  return (
    <div className="w-full h-15 bg-primary/10 p-2 flex justify-between rounded-bl-lg rounded-br-lg border-2">
      <h1 className="font-bold text-xl flex justify-center items-center gap-x-1">
        <Image src="/logo.png" width={25} height={30} alt="logo" />
        TeachCO
      </h1>
      <div className="text-lg flex">
        {routes.map((route) => (
          <div
            onClick={() => onNavigate(route.href)}
            key={route.href}
            className={cn(
              "mt-0 mr-20 justify-center flex text-muted-foreground text-xl p-1 w-full font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-xl transition",
              pathName === route.href && "bg-primary/10 text-primary"
            )}
          >
            <div className="flex items-center">
              <route.icon className="h-5 w-5 mr-2" />
              <h1 className="text-[12px] font-bold">{route.label}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-x-10">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
