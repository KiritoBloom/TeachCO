import { useEffect, useState } from "react";
import { faHandPointer, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import Image from "next/image";
import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { DateRangePicker } from "@nextui-org/date-picker";
import { useToast } from "./ui/use-toast";
import { Divider } from "@nextui-org/divider";
import ClassImage from "./class-image";
import Loading from "@/app/(root)/loading";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
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
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    setDueDate(range);
  };

  const handleOnCreate = async () => {
    try {
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
        <Button onPress={onOpen}>
          New work <FontAwesomeIcon icon={faPlus} />
        </Button>
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
                <CldUploadButton
                  onSuccess={handleUploadSuccess}
                  options={{
                    maxFiles: 1,
                  }}
                  uploadPreset="mqy9rlu4"
                >
                  <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                    <div className="flex flex-col items-center w-40 h-40">
                      <FontAwesomeIcon
                        icon={faHandPointer}
                        className="w-full h-[90%]"
                      />

                      <h2 className="-mr-6 mt-1 font-semibold">Upload File</h2>
                    </div>
                  </div>
                </CldUploadButton>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Close
                </Button>
                <Button color="primary" onPress={handleOnCreate}>
                  Create
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap justify-between mt-5">
          {classWork.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }
            );

            return (
              <Card
                className="min-w-[320px] max-w-[320px] mb-5"
                key={item.assignmentId}
              >
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
                      <p className="text-md">{item.posterName}</p>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardHeader>{item.title}</CardHeader>
                <Divider />
                <CardBody className="gap-y-5">
                  {item.description}
                  <Divider />
                  {item.src ? (
                    <div>
                      {item.src.endsWith(".jpg") ||
                      item.src.endsWith(".jpeg") ||
                      item.src.endsWith(".png") ? (
                        <a
                          href={item.src}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={item.src || "/placeholder.svg"}
                            alt={item.title}
                            width="200"
                            height="200"
                            className="rounded-lg mx-auto mt-5"
                          />
                        </a>
                      ) : (
                        <a
                          href={item.src}
                          download
                          className="mt-5"
                          target="_blank"
                        >
                          <Button>
                            Download{" "}
                            {item.src?.split(".").pop()?.toUpperCase() ||
                              "File"}
                          </Button>
                        </a>
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
          })}
        </div>
      )}
    </>
  );
};

export default ClassWork;
