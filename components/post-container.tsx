import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ClassImage from "./class-image";
import { Divider } from "@nextui-org/divider";
import axios from "axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useToast } from "./ui/use-toast";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { CircleEllipsis } from "lucide-react";
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
} from "./ui/alert-dialog";

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
    } catch (error) {
      console.log(error);
      toast({
        title: "Something Went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="md:max-w-[340px] max-w-[280px] mx-auto">
      <CardHeader className="flex gap-3">
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
        <Dropdown>
          <DropdownTrigger>
            <Button variant="ghost" className="border-none">
              <CircleEllipsis />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">Edit Post</DropdownItem>
            <DropdownItem>
              <AlertDialog>
                <AlertDialogTrigger>Delete</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <Divider />
      <CardBody>{title}</CardBody>
      <Divider />
      <CardBody className="max-h-[150px]">{description}</CardBody>
      <Divider />
      <CardFooter>Created At: {formattedDate}</CardFooter>
    </Card>
  );
};

export default PostContainer;
