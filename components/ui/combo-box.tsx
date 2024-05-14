"use client";

import * as React from "react";
import { Calendar, MoreHorizontal, PenBoxIcon, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useToast } from "./use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { useRouter } from "next/navigation";

interface ComboBoxInterface {
  classId: string;
}

export function ComboboxDropdownMenu({ classId }: ComboBoxInterface) {
  const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleOnDelete = async (classId: string) => {
    try {
      await axios.delete(`/api/class`, {
        data: {
          classId,
        },
      });
      toast({
        title: "Class Deleted",
        description: "The class has been successfully deleted.",
        variant: "success",
      });
      router.push("/classes");
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleOnEdit = (classId: string) => {
    router.push(`/classes/${classId}/edit`);
  };

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md sm:flex-row sm:items-center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleOnEdit(classId)}>
              <PenBoxIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              Set due date...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger className="text-red-600 hover:bg-gray-200/50 w-full justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-5">
                <Trash className="mr-2 h-4 w-4" />
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your class and all students associated
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl transition-all hover:translate-y-[3px]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleOnDelete(classId)}
                    className="z-100 bg-gray-200 hover:bg-gray-200 hover:translate-y-[3px] rounded-2xl w-fit flex items-center gap-x-2 text-black transition-all duration-100"
                  >
                    Delete Class <Trash className="w-4 h-4" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
