import React, { useEffect, useRef } from "react";
import ClassImage from "./class-image";
import { Card } from "./ui/card";
import QRCode from "qrcode.react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toPng } from "html-to-image";

interface UserCardInterface {
  userId: string;
  userName: string;
  userRole: string;
  userEmail: string;
}

const UserCard = ({
  userId,
  userName,
  userRole,
  userEmail,
}: UserCardInterface) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleQRCodeClick = async () => {
    if (cardRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${userName}-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  return (
    <Card
      ref={cardRef}
      className="p-8 mb-10 shadow-2xl border border-gray-300 dark:border-white/20 rounded-3xl bg-white/10 dark:bg-black/60 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex flex-col">
          <ClassImage
            userId={userId}
            className="rounded-full w-32 h-32 border-4 border-gray-300 shadow-lg"
            skeletonStyle="rounded-full w-32 h-32 border-4 border-gray-300 shadow-lg"
            width={128}
            height={128}
          />
          <div className="mt-2 justify-center md:flex hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QRCode
                    value={userId}
                    size={96}
                    bgColor="#f0f0f0"
                    fgColor="#000000"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scan for User ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-white/60">
              Name
            </p>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {userName}
            </h2>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-white/60">
              Email
            </p>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {userEmail}
            </h2>
          </div>
          <span className="text-lg font-semibold bg-blue-100 text-blue-800 py-1 px-4 rounded-full">
            {userRole}
          </span>
        </div>
      </div>
      <div className="mt-6 justify-center md:hidden flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <QRCode
                value={userId}
                size={96}
                bgColor="#f0f0f0"
                fgColor="#000000"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Scan for User ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default UserCard;
