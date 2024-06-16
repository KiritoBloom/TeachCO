"use client";

import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Pin, WandIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import PostContainer from "@/components/post-container";
import Loading from "@/app/(root)/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button as Button2 } from "@nextui-org/button";
import { Input as Input2 } from "@nextui-org/input";
import { Textarea as TextArea2 } from "@nextui-org/input";

interface HomePathProps {
  classId: string;
  teacherId: string;
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

const HomePath = ({ classId, teacherId }: HomePathProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        {/*New Add Post*/}
        <Button2 onPress={onOpen}>
          New Post <FontAwesomeIcon icon={faPlus} />
        </Button2>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <span>Create New Post</span>
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <Button className="flex items-center bg-transparent border-2 border-indigo-600 text-indigo-400 py-2 px-4 rounded-full shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400 hover:bg-primary/10">
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
                </ModalHeader>
                <ModalBody>
                  <Input2
                    label="Post Title"
                    placeholder="Today's class is cancelled"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextArea2
                    label="Post Description"
                    placeholder="Class Today's class is cancelled due to the personal issues"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter className="flex items-center justify-end gap-2">
                  <Button2 color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button2>
                  <Button2
                    color="primary"
                    onPress={onClose}
                    onClick={handleOnConfirm}
                  >
                    Create <WandIcon className="w-5 h-5 ml-2" />
                  </Button2>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
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
                    teacherId={teacherId}
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
