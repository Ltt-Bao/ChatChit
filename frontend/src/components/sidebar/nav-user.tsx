"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/type/user";
import {
  ChevronsUpDownIcon,
  UserIcon,
  Bell,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { useNavigate } from "react-router";

import { useState } from "react";
import FriendRequestDialog from "@/components/friendRequest/FriendRequestDialog";
import ProfileDialog from "../profile/ProfileDialog";
import ChangePasswordDialog from "../auth/ChangePasswordDialog";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const { hasNewRequest, setHasNewRequest } = useFriendStore();

  const handleOpenNotifications = () => {
    setFriendRequestOpen(true);
    setHasNewRequest(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback className="rounded-lg">
                    {user.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.displayName}</span>
                  <span className="truncate text-xs">{user.username}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="rounded-lg">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.displayName}
                    </span>
                    <span className="truncate text-xs">{user.username}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <UserIcon className="text-muted-foreground dark:group-focus:text-accent-foreground!" />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleOpenNotifications}
                >
                  <div className="relative flex items-center justify-center">
                    <Bell className="text-muted-foreground dark:group-focus:text-accent-foreground!" />
                    {hasNewRequest && (
                      <span className="absolute -top-0.5 -right-0.5 flex size-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  Thông báo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setChangePasswordOpen(true)}
                >
                  <KeyRound className="text-muted-foreground dark:group-focus:text-accent-foreground!" />
                  Đổi mật khẩu
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <FriendRequestDialog
        open={friendRequestOpen}
        setOpen={setFriendRequestOpen}
      />

      <ProfileDialog
        open={profileOpen}
        setOpen={setProfileOpen}
      />

      <ChangePasswordDialog
        open={changePasswordOpen}
        setOpen={setChangePasswordOpen}
      />
    </>
  );
}
