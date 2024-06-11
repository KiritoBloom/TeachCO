import { Divider } from "@nextui-org/divider";
import ClassImage from "./class-image";
import { Button as Button2 } from "@/components/ui/button";
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
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faFile,
  faHandPointer,
  faImage,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Input, Textarea } from "@nextui-org/input";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Trash } from "lucide-react";

interface ClassContainerProps {
  assignmentId: string;
  title: string;
  description: string;
  posterId: string;
  posterName: string;
  createdAt: string | Date;
  dueDate: string | Date;
  src: string;
  classId: string;
}

const ClassworkContainer = ({
  assignmentId,
  title,
  description,
  posterId,
  posterName,
  createdAt,
  dueDate,
  src,
  classId,
}: ClassContainerProps) => {
  const { toast } = useToast();
  const [updatedDesc, setUpdatedDesc] = useState("");
  const [updateTitle, setUpdatedTitle] = useState("");
  const [updateSrc, setUpdatedSrc] = useState("");
  const [fileName, setFileName] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOnEdit = async (assignmentId: string) => {
    try {
      if (!updateTitle && !updatedDesc && !updateSrc) {
        toast({
          title: "Must change something to update assignment",
          variant: "destructive",
        });
        return; // Early return if nothing to update
      }

      await axios.patch(`/api/class/classwork`, {
        classId,
        posterId,
        updateTitle,
        updatedDesc,
        updateSrc,
        assignmentId,
      });

      toast({
        title: "Assignment Updated",
        variant: "success",
      });
      onOpenChange();
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const hanldeOnDelete = async () => {
    try {
      await axios.delete(`/api/class/classwork`, {
        data: {
          posterId,
          classId,
          assignmentId,
        },
      });
      toast({
        title: "Assignment Deleted",
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

  const updateUpload = (result: any) => {
    setUpdatedSrc(result.info.secure_url);
    setFileName(result.info.public_id + "." + result.info.format);
  };

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card className="min-w-[300px] max-w-[300px] mb-5" key={assignmentId}>
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
        {/* Edit Assignment */}
        <Button2
          onClick={onOpen}
          className="bg-transparent hover:bg-primary/10 flex flex-col w-10"
          size="icon"
        >
          <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-blue-600" />
        </Button2>
        <Modal isOpen={isOpen}>
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  Edit your Post{" "}
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="w-4 h-4 text-white"
                  />
                </div>
                <p className="text-primary/50 text-sm">
                  {" "}
                  This will permanently change the edit&#700;s content
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder={title}
                  label="Assignment Title"
                  className="dark:bg-[#18181B] dark:border-[#3A3A3D]"
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <Textarea
                  placeholder={description}
                  label="Assignment Description"
                  className="dark:bg-[#18181B] dark:border-[#3A3A3D]"
                  onChange={(e) => setUpdatedDesc(e.target.value)}
                />
                <CldUploadButton
                  onSuccess={updateUpload}
                  options={{
                    maxFiles: 1,
                  }}
                  uploadPreset="mqy9rlu4"
                  className="z-[1050]" // Ensure the button has a high z-index
                  onClick={(e: any) => e.stopPropagation()} // Stop event propagation
                >
                  <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                    {fileName ? (
                      <div className="flex flex-col items-center justify-center w-40 h-40">
                        {fileName.endsWith(".jpg") ||
                        fileName.endsWith(".jpeg") ||
                        fileName.endsWith(".png") ? (
                          <a
                            href={src}
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
                <Button
                  color="primary"
                  onClick={() => handleOnEdit(assignmentId)}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>

        {/*Delete Assignment */}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button2
              className="bg-transparent hover:bg-primary/10 flex flex-col w-10 -ml-10"
              size="icon"
            >
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="w-4 h-4 text-red-600"
              />
            </Button2>
          </AlertDialogTrigger>
          <AlertDialogContent className="dark:bg-[#18181B] dark:border-[#3A3A3D]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Assignment and all relevant data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent dark:border-[#3A3A3D] rounded-2xl hover:translate-y-[2px] transition-all trasn">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => hanldeOnDelete()}
                className="w-full md:w-fit hover:translate-y-[2px] z-100 bg-gray-200 hover:bg-gray-200 rounded-2xl flex items-center gap-x-2 text-black transition-all duration-100"
              >
                Delete Class <Trash className="w-4 h-4" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <Divider />
      {/* Assignment INFO */}
      <CardHeader>{title}</CardHeader>
      <Divider />
      <CardBody className="gap-y-5">{description}</CardBody>
      <Divider />
      <CardBody>
        {src ? (
          <div>
            {src.endsWith(".jpg") ||
            src.endsWith(".jpeg") ||
            src.endsWith(".png") ? (
              <a href={src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={title}
                  width="200"
                  height="200"
                  className="rounded-lg mx-auto mt-5"
                />
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faFile} className="w-20 h-20" />
                <a href={src} download className="mt-2" target="_blank">
                  <Button>
                    Download {src?.split(".").pop()?.toUpperCase() || "File"}
                  </Button>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div>Hello</div>
        )}
      </CardBody>
      <Divider />
      <CardFooter>{formattedDate}</CardFooter>
    </Card>
  );
};

export default ClassworkContainer;
