"use client";

import AlertsTable from "@/components/alerts";
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
      <AlertsTable variant="Warning" />
    </div>
  );
};

export default Page;
