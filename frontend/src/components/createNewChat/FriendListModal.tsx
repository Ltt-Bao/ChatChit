import { useFriendStore } from "@/stores/useFriendStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MessageCircleMore, Users, MoreHorizontal, UserMinus } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/useChatStore";

const FriendListModal = () => {
  const { friends, unfriend } = useFriendStore();
  const { createConversation } = useChatStore();

  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
  };

  const handleUnfriend = async (e: React.MouseEvent, friendId: string) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn hủy kết bạn với người này?")) return;
    
    await unfriend(friendId);
    toast.success("Đã hủy kết bạn");
  };

  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize">
          <MessageCircleMore className="size-5" />
          Bắt đầu hội thoại mới
        </DialogTitle>
      </DialogHeader>

      {/* friends list */}
      <div className="space-y-4">
        <h1 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Danh sách bạn bè
        </h1>

        <div className="space-y-2 mã-h-60 overflow-y-auto">
          {friends.map((friends) => (
            <Card
              key={friends._id}
              onClick={() => handleAddConversation(friends._id)}
              className="p-3 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard"
            >
              <div className="flex items-center gap-3">
                {/* avatar */}
                <div className="relative">
                  <UserAvatar
                    type="sidebar"
                    name={friends.displayName}
                    avatarUrl={friends.avatarUrl}
                  />
                </div>
                {/* info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h2 className="font-semibold text-sm truncate">
                    {friends.displayName}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    @{friends.username}
                  </span>
                </div>
                {/* action */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <div className="p-1 hover:bg-muted rounded-md opacity-0 group-hover/friendCard:opacity-100 transition-opacity">
                      <MoreHorizontal className="size-4 text-muted-foreground hover:size-5 transition-smooth" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => handleUnfriend(e, friends._id)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <UserMinus className="size-4 mr-2" />
                      Hủy kết bạn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
          {friends.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="size-12 mx-auto mb-3 opacity-50" />
              Chưa có bạn bè. Thêm bạn bè để bắt đầu cuộc trò chuyện
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
