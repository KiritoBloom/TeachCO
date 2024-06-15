"use client";

import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      variant: "success",
      title: "Hello",
      description: "Hello",
    });
  };

  return (
    <div>
      <button onClick={showToast}>Show Toast</button>
    </div>
  );
};

export default Page;
