import { useEffect, useState } from "react";
import {
  faEdit,
  faEllipsis,
  faExclamationCircle,
  faFile,
  faHandPointer,
  faImage,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Input, Textarea } from "@nextui-org/input";
import { CldUploadButton } from "next-cloudinary";
import axios from "axios";

import { DateRangePicker } from "@nextui-org/date-picker";
import { useToast } from "./ui/use-toast";

import Loading from "@/app/(root)/loading";

import ClassworkContainer from "./classwork-container";
import useUserRole from "@/hooks/role";
interface ClassworkProps {
  posterId: string;
  classId: string;
}

interface ClassWorkItem {
  assignmentId: string;
  title: string;
  description: string;
  posterId: string;
  posterName: string;
  createdAt: string | Date;
  dueDate: string | Date;
  src: string;
}

const ClassWork = ({ posterId, classId }: ClassworkProps) => {
  const { role } = useUserRole();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [classWork, setClassWork] = useState<ClassWorkItem[]>([]);
  const [dueDate, setDueDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };

  const handleUploadSuccess = (result: any) => {
    setImageUrl(result.info.secure_url);
    setFileName(result.info.public_id + "." + result.info.format);
  };

  const handleOnCreate = async () => {
    try {
      if (!title || !description || !imageUrl || dueDate) {
        toast({
          title:
            "Must Include title description imageUrl and dueDate to create Assignment",
          variant: "destructive",
        });
      }
      const response = await axios.post("/api/class/classwork", {
        title,
        description,
        imageUrl,
        posterId,
        classId,
        dueDate,
      });
      console.log(response.data);
      onOpenChange(); // Close the modal on success
      toast({
        title: "Assignment Created",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await axios.get(`/api/class/classwork?classId=${classId}`);
        const response = res.data.map((item: ClassWorkItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          dueDate: new Date(item.dueDate),
        }));
        console.log(response); // Verify the structure
        setClassWork(Array.isArray(response) ? response : []);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setClassWork([]); // Default to empty array on error
        setIsLoading(false);
      }
    };

    fetchWork();
  }, [classId]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">ClassWork</h2>
        {role === "Teacher" ? (
          <Button onPress={onOpen}>
            New work <FontAwesomeIcon icon={faPlus} />
          </Button>
        ) : (
          <div></div>
        )}
        <Modal isOpen={isOpen}>
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new work
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Assignment Title"
                  placeholder="Enter your assignment's title"
                  value={title}
                  onChange={handleTitleChange}
                />
                <Textarea
                  type="description"
                  label="Assignment Description"
                  placeholder="Enter your assignment's description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <div onClick={(e) => e.stopPropagation()}>
                  <DateRangePicker />
                </div>
                {/*Upload File*/}
                <CldUploadButton
                  onSuccess={handleUploadSuccess}
                  options={{
                    maxFiles: 1,
                  }}
                  uploadPreset="mqy9rlu4"
                >
                  <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                    {fileName ? (
                      <div className="flex flex-col items-center justify-center w-40 h-40">
                        {fileName.endsWith(".jpg") ||
                        fileName.endsWith(".jpeg") ||
                        fileName.endsWith(".png") ? (
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center"
                          >
                            <FontAwesomeIcon
                              icon={faImage}
                              className="w-full h-[30%] mb-2"
                            />
                            <h2>{fileName}</h2>
                          </a>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faFile}
                              className="w-full h-[60%] mb-2"
                            />
                            <div>{fileName}</div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-40 h-40">
                        <FontAwesomeIcon
                          icon={faHandPointer}
                          className="w-full h-[90%]"
                        />
                        <h2 className="-mr-6 mt-1 font-semibold">
                          Upload File
                        </h2>
                      </div>
                    )}
                  </div>
                </CldUploadButton>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Close
                </Button>
                {!title || !description || !imageUrl || !dueDate ? (
                  <Button
                    color="default"
                    disabled
                    className="cursor-not-allowed"
                  >
                    Create
                  </Button>
                ) : (
                  <Button color="primary" onPress={handleOnCreate}>
                    Create
                  </Button>
                )}
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap justify-between mt-5">
          {classWork.length > 0 ? (
            classWork.map((item) => (
              <ClassworkContainer
                key={item.assignmentId}
                assignmentId={item.assignmentId}
                posterId={item.posterId}
                posterName={item.posterName}
                title={item.title}
                description={item.description}
                src={item.src}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                classId={classId}
              />
            ))
          ) : (
            <div className="mx-auto">
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="text-gray-500 text-6xl mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white/60">
                  No Assignments Found
                </h2>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ClassWork;
