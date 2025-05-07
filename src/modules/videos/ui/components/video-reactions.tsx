import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const VideoReactions = () => {
  let viewerReaction = "like"; //TODO: Properly add feature viewer's reaction
  viewerReaction = "dislike";

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};
