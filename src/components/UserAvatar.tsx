import Image from "next/image";
import avatarPlaceholder from "./../assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface AvatarProps {
  size?: number;
  className?: string;
  imageUrl?: string;
}

function UserAvatar({ className, size, imageUrl }: AvatarProps) {
  return (
    <Image
      src={imageUrl || avatarPlaceholder}
      alt="user avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}

export default UserAvatar;
