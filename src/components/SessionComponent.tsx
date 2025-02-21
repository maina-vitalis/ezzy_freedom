import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardHeader } from "./ui/card";
import Image from "next/image";
import image from "./../assets/signup-image.jpg";
import { cn } from "@/lib/utils";

interface SessionComponentProps {
  item: {
    badge2: string;
    className?: string;
    title: string;
    text: string;
  };
}

function SessionComponent({ item }: SessionComponentProps) {
  return (
    <Card className={cn(" w-full bg-opacity-40", item.className)}>
      <CardHeader className="space-y-4 z-10">
        <div className="flex gap-3">
          <Badge className="rounded-full bg-background text-foreground hover:white ">
            {item.badge2}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="md:text-2xl text-xl font-semibold text-start">
            {item.title}
          </h2>
          <p className="text-xs">{item.text}</p>
        </div>
      </CardHeader>
      <div className="relative h-52">
        <Image
          src={image}
          alt="couple session"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </Card>
  );
}

export default SessionComponent;
