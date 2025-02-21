import Image from "next/image";
import avatarPlaceholder from "./../assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface AvatarProps {
  size?: number;
  className?: string;
}

function UserAvatar({ className, size }: AvatarProps) {
  return (
    <Image
      src={avatarPlaceholder}
      alt="user avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
}

export default UserAvatar;
