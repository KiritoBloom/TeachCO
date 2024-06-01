import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ClassImage from "./class-image";
import { Divider } from "@nextui-org/divider";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import {
  faEdit,
  faEllipsis,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PostProps {
  title: string;
  description: string;
  isPinned: boolean;
  postId: string;
  createdAt: string;
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
  const { toast } = useToast();
  const [updatedDesc, setUpdatedDesc] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const router = useRouter();

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleOnDelete = async () => {
    try {
      await axios.delete(`/api/class/posts`, {
        data: {
          postId,
          posterId,
        },
      });
      toast({
        title: "Post Deleted",
        description: "Post has been deleted successfully",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Something Went wrong",
        variant: "destructive",
      });
      router.refresh();
    }
  };

  const handleOnEdit = async () => {
    try {
      if (!updatedTitle && !updatedDesc) {
        toast({ title: "Must have change title or description to edit" });
      }
      await axios.patch(`/api/class/posts`, {
        posterId,
        postId,
        updatedDesc,
        updatedTitle,
      });
      toast({
        title: "Post Edited succesfully",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something Went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="md:max-w-[340px] md:min-w-[340px] max-w-[280px] min-w-[280px] mx-auto md:ml-0">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-primary/10 p-2 rounded-md transition-all duration-200 flex items-center">
            <FontAwesomeIcon icon={faEllipsis} className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="shadow-md rounded-xl dark:border-[#3A3A3D] mt-2 py-2 bg-white dark:bg-[#18181B]">
            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white/60">
              Post Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-t my-2 dark:border-[#3A3A3D]" />
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div className="gap-2 px-4 py-2 flex items-center text-gray-700 dark:text-white/60 hover:bg-primary/10 transition-colors rounded-md">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="w-4 h-4 text-gray-600"
                  />
                  <span>Edit</span>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-[#18181B] dark:border-[#3A3A3D]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    Edit your Post{" "}
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="w-4 h-4 text-white"
                    />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently change the edit's content
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  placeholder={title}
                  className={"dark:bg-[#18181B] dark:border-[#3A3A3D]"}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <Textarea
                  placeholder={description}
                  className="dark:bg-[#18181B] dark:border-[#3A3A3D]"
                  onChange={(e) => setUpdatedDesc(e.target.value)}
                />
                <AlertDialogFooter className="flex flex-row items-center gap-3">
                  <AlertDialogCancel className="rounded-xl p-5 bg-transparent border-[#3A3A3D] hover:bg-primary/10 mb-2 md:mb-0">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleOnEdit}
                    className={cn(
                      "p-5 rounded-xl text-indigo-500 border-indigo-600 border-2 bg-transparent hover:bg-primary/10",
                      {
                        "cursor-not-allowed": !updatedTitle && !updatedDesc,
                        "opacity-50": !updatedTitle && !updatedDesc, // Optional: Add opacity to show the button is disabled
                      }
                    )}
                    disabled={!updatedTitle && !updatedDesc} // Disable the button when the condition is met
                  >
                    Edit <FontAwesomeIcon icon={faEdit} className="ml-2" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div>
              <AlertDialog>
                <AlertDialogTrigger className="font-semibold gap-2 px-4 py-2 flex items-center text-red-600 hover:bg-primary/10 transition-colors rounded-md w-full mt-1">
                  <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                  <span>Delete</span>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#18181B] dark:border-[#3A3A3D] rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-row items-center gap-3">
                    <AlertDialogCancel className="rounded-xl p-5 bg-transparent border-[#3A3A3D] hover:bg-primary/10 mb-2 md:mb-0">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleOnDelete}
                      className="p-5 rounded-xl text-red-500 border-red-600 border-2 bg-transparent hover:bg-primary/10"
                    >
                      Delete{" "}
                      <FontAwesomeIcon icon={faTrashAlt} className="ml-2" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <Divider />
      <CardBody>{title}</CardBody>
      <Divider />
      <CardBody className="max-h-[150px] p-4">{description}</CardBody>
      <Divider />
      <CardFooter>Created At: {formattedDate}</CardFooter>
    </Card>
  );
};

export default PostContainer;
