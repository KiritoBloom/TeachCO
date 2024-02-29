"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Home, Settings, ShoppingBasket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();

  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
    },
    {
      icon: ShoppingBasket,
      href: "/products/all",
      label: "Products",
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
    <div className="w-full h-15 bg-primary/10 p-2 flex justify-between rounded-bl-lg rounded-br-lg border-2">
      <h1 className="font-bold text-lg">TeachCO</h1>
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
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Navbar;
