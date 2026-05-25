import { useState } from "react";
import { MoreVertical, UserPlus, Users, Trash2, UserMinus } from "lucide-react";
import { useFriendStore } from "@/stores/useFriendStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/type/chat";
import type { Friend } from "@/type/user";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import SelectedUsersList from "../newGroupChat/SelectedUsersList";
import UserAvatar from "./UserAvatar";

const GroupMemberActions = ({ chat }: { chat: Conversation }) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);

  const { friends, getFriend } = useFriendStore();
  const { addMembers, removeMember, deleteConvo, loading } = useChatStore();
  const { user } = useAuthStore();

  const currentMemberIds = chat.participants.map((p) => p._id);
  const isCreator = chat.group?.createdBy === user?._id;

  const handleOpenAdd = async () => {
    setAddOpen(true);
    await getFriend();
    setInvitedUsers([]);
    setSearch("");
  };

  const filterFriends = friends.filter(
    (friend) =>
      friend.displayName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      !currentMemberIds.includes(friend._id) &&
      !invitedUsers.some((u) => u._id === friend._id),
  );

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleAddMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invitedUsers.length === 0) {
      toast.warning("Bạn chưa chọn thành viên nào");
      return;
    }

    await addMembers(
      chat._id,
      invitedUsers.map((u) => u._id),
    );

    setAddOpen(false);
    setInvitedUsers([]);
    setSearch("");
    toast.success("Đã thêm thành viên mới");
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?")) return;
    await removeMember(chat._id, memberId);
    toast.success("Đã xóa thành viên khỏi nhóm");
  };

  const handleDeleteConversation = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ cuộc hội thoại này? Hành động này không thể hoàn tác.")) return;
    await deleteConvo(chat._id);
    toast.success("Đã xóa cuộc hội thoại");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-sidebar-accent transition-smooth">
            <MoreVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setViewOpen(true)} className="cursor-pointer">
            <Users className="size-4 mr-2" />
            Xem thành viên
          </DropdownMenuItem>
          {isCreator && (
            <DropdownMenuItem onClick={handleOpenAdd} className="cursor-pointer">
              <UserPlus className="size-4 mr-2" />
              Thêm thành viên
            </DropdownMenuItem>
          )}
          {isCreator && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeleteConversation} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="size-4 mr-2" />
                Xóa cuộc hội thoại
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Xem thành viên */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thành viên nhóm ({chat.participants.length})</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {chat.participants.map((p) => (
              <div key={p._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <UserAvatar type="chat" name={p.displayName || "User"} avatarUrl={p.avatarUrl || undefined} />
                  <span className="font-medium text-sm flex flex-col">
                    {p.displayName}
                    {chat.group?.createdBy === p._id && (
                      <span className="text-xs text-muted-foreground">(Trưởng nhóm)</span>
                    )}
                  </span>
                </div>
                {isCreator && chat.group?.createdBy !== p._id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(p._id)}
                    disabled={loading}
                    title="Xóa thành viên"
                  >
                    <UserMinus className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Thêm thành viên */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm thành viên</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddMembers}>
            <div className="space-y-2">
              <Label htmlFor="invite" className="text-sm font-semibold">
                Mời bạn bè
              </Label>
              <Input
                id="invite"
                placeholder="Tìm theo tên hiển thị..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass border-border/50 focus:border-primary/50 transition-smooth"
              />

              {/* Danh sách gợi ý */}
              {search && filterFriends.length > 0 && (
                <InviteSuggestionList
                  filteredFriends={filterFriends}
                  onSelect={handleSelectFriend}
                />
              )}

              {/* danh sách user đã chọn */}
              <SelectedUsersList
                invitedUsers={invitedUsers}
                onRemove={handleRemoveFriend}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth">
                {loading ? (
                  <span>Đang thêm...</span>
                ) : (
                  <>
                    <UserPlus className="size-4 mr-2" />
                    Thêm thành viên
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupMemberActions;
