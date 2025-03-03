"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.video.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      // Invalidate the query to refetch the data
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(
        error.message
          ? error.message
          : "An error occurred while creating the video"
      );
    }
  });

  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};

export default StudioUploadModal;
