"use client";
import { logout as logOut } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserNavButton({ userData }: { userData: any }) {
  const [isLogginOut, setIsLogginOut] = useState(false);
  const route = useRouter();
  const logout = async () => {
    setIsLogginOut(true);
    const { error, success } = await logOut();
    if (error) return setIsLogginOut(false);
    route.push("/log-in");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          {isLogginOut ? "Logging out..." : userData?.success?.dbData.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLogginOut} onSelect={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
