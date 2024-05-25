import { PlusCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
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

const HomePath = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Posts</h2>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="p-4 rounded-md bg-white text-black font-semibold w-fit hover:bg-gray-400 transition-all">
              Add Post <PlusCircleIcon className="w-5 h-5 ml-1" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                Create New Post <SparklesIcon className="w-5 h-5 ml-2" />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <h2 className="text-black/80">Post title</h2>
                <Input
                  className="transition-all mt-1 mb-2"
                  placeholder="eg. ClassWork for today is:"
                />
                <h2>Post Description</h2>
                <Textarea
                  className="mt-2 transition-all"
                  placeholder="The classwork for today is: Page 64 of your extended math's book"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default HomePath;
