
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserAvatarProps = {
  name: string;
};

export function UserAvatar({ name }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className="h-8 w-8 border border-border">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}