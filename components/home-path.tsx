"use client";

import {
  CheckCircleIcon,
  HandThumbUpIcon,
  PlusCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
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
import { Pin, WandIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import PostContainer from "./post-container";
import Loading from "@/app/(root)/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

interface HomePathProps {
  classId: string;
}

interface Post {
  title: string;
  description: string;
  isPinned: boolean;
  postId: string;
  createdAt: string; // Use string to match your fetched data type
  posterId: string;
  posterName: string;
}

const HomePath = ({ classId }: HomePathProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    setIsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      console.log(newChecked);
      return newChecked;
    });
  };

  const handleOnConfirm = async () => {
    try {
      await axios.post(`/api/class/posts`, {
        title,
        description,
        isChecked,
        classId,
      });
      toast({
        title: "Post created successfully ✔️",
        variant: "success",
      });
      // Fetch posts again to update the list
      fetchPosts();
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong ❌",
        variant: "destructive",
      });
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/class/posts?classId=${classId}`);
      const res = response.data;
      setPosts(res);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-bold">Posts</h2>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="p-4 rounded-md bg-white dark:bg-[#18181C] dark:text-white dark:hover:bg-primary/10 text-black font-semibold w-fit hover:bg-gray-200 transition-all">
              Add Post <PlusCircleIcon className="w-5 h-5 ml-1" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="dark:bg-[#18181B] dark:border-[#3A3A3D] rounded-lg">
            <AlertDialogHeader>
              <div className="flex justify-between items-center">
                <AlertDialogTitle className="flex items-center">
                  Create New Post <SparklesIcon className="w-5 h-5 ml-2" />
                </AlertDialogTitle>
                <div className="flex items-center justify-between p-6  rounded-xl">
                  <Button className="flex items-center bg-transparent border-2 border-indigo-600 text-indigo-400 py-3 px-5 rounded-full shadow-md  transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400 hover:bg-primary/10">
                    <Pin className="w-5 h-5 mr-2" />
                    Pin Post
                    <div className="flex items-center ml-2">
                      <input
                        type="checkbox"
                        id="cbx2"
                        className="hidden"
                        checked={isChecked}
                        onChange={handleCheckboxClick}
                      />
                      <label
                        htmlFor="cbx2"
                        className="flex items-center cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500 animate-pulse" />
                        ) : (
                          <CheckCircleIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </label>
                    </div>
                  </Button>
                </div>
              </div>
              <AlertDialogDescription>
                <h2 className="flex justify-start">Post title</h2>
                <Input
                  className="transition-all mt-1 mb-2 dark:border-[#3A3A3D] dark:bg-[#18181C]"
                  placeholder="eg. ClassWork for today is:"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <h2 className="flex justify-start">Post Description</h2>
                <Textarea
                  className="mt-2 transition-all dark:border-[#3A3A3D] dark:bg-[#18181C]"
                  placeholder="The classwork for today is: Page 64 of your extended math's book"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent dark:border-[#3A3A3D]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleOnConfirm}>
                Create <WandIcon className="w-5 h-5 ml-2" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <div className="flex flex-wrap justify-between gap-x-2 mt-5">
          {isLoading ? (
            <Loading />
          ) : posts.length === 0 ? (
            <div className="mx-auto">
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="text-gray-500 text-6xl mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white/60">
                  No Posts Found
                </h2>
              </div>
            </div>
          ) : (
            posts
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((post) => (
                <div className="flex justify-center mt-2" key={post.postId}>
                  <PostContainer
                    key={post.postId}
                    title={post.title}
                    description={post.description}
                    postId={post.postId}
                    isPinned={post.isPinned}
                    createdAt={post.createdAt}
                    posterId={post.posterId}
                    posterName={post.posterName}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default HomePath;
