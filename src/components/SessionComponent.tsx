import { cn } from "@/lib/utils";
import { Service } from "@prisma/client";
import { ArrowRight, Clock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader } from "./ui/card";

interface SessionComponentProps {
  item: Service;
}

function SessionComponent({ item }: SessionComponentProps) {
  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-0 bg-primary/10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={`${item.name} - Mental Health Service`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Banner Badge */}
        <div className="absolute left-3 top-3">
          <Badge className="rounded-full bg-primary/90 text-white shadow-lg backdrop-blur-sm">
            {item.bannerText}
          </Badge>
        </div>

        {/* Floating Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            className="rounded-full bg-white/90 px-4 py-2 text-black shadow-lg hover:bg-white"
            asChild
          >
            <Link
              href={`/service-details/${item.slug}`}
              className="flex items-center gap-2"
            >
              <span className="font-medium">Learn More</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="flex-1 space-y-3 p-6">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-primary">
            {item.name}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.overview}
          </p>
        </div>

        {/* Service Features */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>1-2 hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>Professional</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-current" />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">(4.9)</span>
        </div>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="w-full rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Link
            href={`/service-details/${item.slug}`}
            className="flex items-center justify-center gap-2"
          >
            <span className="font-medium">Learn More</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SessionComponent;
