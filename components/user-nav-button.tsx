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
import {
  AArrowDown,
  ArrowBigDown,
  ArrowDown,
  Droplet,
  LogOut,
  Settings,
  SettingsIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

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
        <Button size={"icon"}>
          <SettingsIcon className="w-4 h-4" />
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
        <DropdownMenuSeparator />
        <div className="flex gap-2 p-2">
          <ThemeToggle />
          <p className="text-sm">Dark Mode</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
