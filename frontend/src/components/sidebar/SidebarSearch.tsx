import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { useAuthStore } from "@/stores/useAuthStore";
import UserAvatar from "../chat/UserAvatar";
import GroupChatAvatar from "../chat/GroupChatAvatar";

export const SidebarSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { conversations, setActiveConversation, messages, fetchMessages, createConversation } = useChatStore();
  const { friends, getFriend } = useFriendStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Load friend list so that search has items to filter
    getFriend();
  }, [getFriend]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectGroup = async (convoId: string) => {
    setActiveConversation(convoId);
    if (!messages[convoId]) {
      await fetchMessages(convoId);
    }
    setQuery("");
    setIsOpen(false);
  };

  const handleSelectFriend = async (friendId: string) => {
    if (!user) return;
    
    // Find if a direct conversation already exists
    const existingConvo = conversations.find(
      (convo) =>
        convo.type === "direct" &&
        convo.participants.some((p) => p._id === friendId)
    );

    if (existingConvo) {
      setActiveConversation(existingConvo._id);
      if (!messages[existingConvo._id]) {
        await fetchMessages(existingConvo._id);
      }
    } else {
      // Create new direct conversation and select it
      await createConversation("direct", "", [friendId]);
    }
    
    setQuery("");
    setIsOpen(false);
  };

  const normalizedQuery = query.toLowerCase().trim();

  // Filter groups
  const matchedGroups = normalizedQuery
    ? conversations.filter(
        (convo) =>
          convo.type === "group" &&
          convo.group?.name?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // Filter friends
  const matchedFriends = normalizedQuery
    ? friends.filter(
        (friend) =>
          friend.displayName?.toLowerCase().includes(normalizedQuery) ||
          friend.username?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const hasResults = matchedGroups.length > 0 || matchedFriends.length > 0;

  return (
    <div ref={containerRef} className="relative px-3 py-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm nhóm hoặc bạn bè..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-9 pr-8 h-9 glass border border-border/40 focus-visible:ring-1 focus-visible:ring-primary/40 bg-background/50 hover:bg-background/80 transition-smooth rounded-lg text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground transition-smooth cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Popup kết quả tìm kiếm */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-3 right-3 mt-2 z-50 rounded-xl border border-border/50 glass-strong shadow-soft max-h-80 overflow-y-auto beautiful-scrollbar p-2 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          {!hasResults ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Không tìm thấy kết quả
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mục Nhóm chat */}
              {matchedGroups.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nhóm chat ({matchedGroups.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedGroups.map((convo) => (
                      <button
                        key={convo._id}
                        onClick={() => handleSelectGroup(convo._id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-smooth text-left cursor-pointer"
                      >
                        <GroupChatAvatar participants={convo.participants} type="chat" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate text-foreground">
                            {convo.group?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {convo.participants.length} thành viên
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mục Bạn bè */}
              {matchedFriends.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bạn bè ({matchedFriends.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedFriends.map((friend) => (
                      <button
                        key={friend._id}
                        onClick={() => handleSelectFriend(friend._id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-smooth text-left cursor-pointer"
                      >
                        <UserAvatar
                          type="chat"
                          name={friend.displayName}
                          avatarUrl={friend.avatarUrl}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate text-foreground">
                            {friend.displayName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            @{friend.username}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarSearch;
