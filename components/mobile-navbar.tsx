"use client";

import { Book, Home, Menu, Settings, X } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";

const MobileNavbar = () => {
  const router = useRouter();
  const pathName = usePathname();

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

  const onNavigate = (url: string) => {
    return router.push(url);
  };

  return (
    <div className="w-full h-15 bg-primary/10 p-2 flex justify-between rounded-bl-lg rounded-br-lg border-2 dark:bg-[#18181B]">
      <h1 className="font-bold text-xl flex justify-center items-center gap-x-1">
        <Image src="/logo.png" width={25} height={30} alt="logo" />
        TeachCO
      </h1>
      <div className="flex gap-x-5">
        <Drawer>
          <DrawerTrigger>
            <Menu />
          </DrawerTrigger>
          <DrawerContent className="dark:bg-[#18181B]">
            <DrawerHeader>
              <DrawerDescription>
                <div className="text-lg flex-col justify-center items-center">
                  {routes.map((route) => (
                    <div
                      onClick={() => onNavigate(route.href)}
                      key={route.href}
                      className={cn(
                        "mt-3 mr-20 justify-center flex text-muted-foreground text-xl w-full p-3 font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-xl transition",
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
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <div className="flex justify-end items-center gap-x-2">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
