import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardHeader } from "./ui/card";
import Image from "next/image";
import image from "./../assets/signup-image.jpg";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Service } from "@prisma/client";

interface SessionComponentProps {
  item: Service;
}

function SessionComponent({ item }: SessionComponentProps) {
  return (
    <Card className={cn("w-full bg-opacity-40")}>
      <CardHeader className="z-10 space-y-4">
        <div className="flex gap-3">
          <Badge className="rounded-full bg-primary text-white">
            {item.bannerText}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-start text-lg font-semibold md:line-clamp-1">
            {item.name}
          </h2>
          <p className="line-clamp-3 text-xs">{item.overview}</p>
        </div>
      </CardHeader>
      <div className="relative min-h-52">
        <Image
          src={image}
          alt="couple session"
          fill
          className="rounded-lg object-cover"
        />
        <Button
          asChild
          variant={"ghost"}
          className="absolute bottom-2 left-4 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-inherit hover:text-white hover:shadow-md"
        >
          <Link href={`/service-details/${item.slug}`} className="text-white">
            Learn More
            <ArrowRight className="text-white" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default SessionComponent;
