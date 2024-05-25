"use client";

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
import { Pin, WandIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import PostContainer from "./post-container";

interface HomePathProps {
  classId: string;
}

interface Post {
  title: string;
  description: string;
  isPinned: boolean;
  postId: string;
  createdAt: Date;
  posterId: string;
  posterName: string;
}

const HomePath = ({ classId }: HomePathProps) => {
  const [isPinned, setIsPinned] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);

  const handleOnClick = () => {
    setIsPinned(!isPinned);
  };

  const handleOnConfirm = async () => {
    try {
      await axios.post(`/api/class/posts`, {
        title,
        description,
        isPinned,
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [classId]);

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
              <div className="flex justify-between items-center">
                <AlertDialogTitle className="flex items-center">
                  Create New Post <SparklesIcon className="w-5 h-5 ml-2" />
                </AlertDialogTitle>
                <div className="flex items-center">
                  <Button
                    className="dark:text-white dark:hover:bg-black/90 flex items-center p-2 bg-transparent text-black border border-gray-300 hover:bg-gray-100 transition-all"
                    onClick={handleOnClick}
                  >
                    Pin Post <Pin className="w-5 h-5 ml-2" />{" "}
                    <div className="ml-3" onClick={() => handleOnClick()}>
                      <input
                        type="checkbox"
                        id="cbx2"
                        style={{ display: "none" }}
                      />
                      <label htmlFor="cbx2" className="check cursor-pointer">
                        <svg
                          width="18px"
                          height="18px"
                          viewBox="0 0 18 18"
                          className="fill-current text-gray-400"
                        >
                          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                          <polyline
                            points="1 9 7 14 15 4"
                            className="stroke-current text-gray-400"
                          ></polyline>
                        </svg>
                      </label>
                    </div>
                  </Button>
                </div>
              </div>
              <AlertDialogDescription>
                <h2 className="text-black/80">Post title</h2>
                <Input
                  className="transition-all mt-1 mb-2"
                  placeholder="eg. ClassWork for today is:"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <h2>Post Description</h2>
                <Textarea
                  className="mt-2 transition-all"
                  placeholder="The classwork for today is: Page 64 of your extended math's book"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOnConfirm}>
                Create <WandIcon className="w-5 h-5 ml-2" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <div className="flex flex-wrap gap-x-10">
          {posts.map((post) => (
            <div className="flex mt-1">
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
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePath;
