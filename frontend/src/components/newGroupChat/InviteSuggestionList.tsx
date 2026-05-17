import type { Friend } from "@/type/user";
import UserAvatar from "../chat/UserAvatar";

interface InViteSuggestionListProps {
  filteredFriends: Friend[];
  onSelect: (friend: Friend) => void;
}

const InviteSuggestionList = ({
  filteredFriends,
  onSelect,
}: InViteSuggestionListProps) => {
  if (filteredFriends.length === 0) {
    return null;
  }

  return (
    <div className="border border-border/50 rounded-lg mt-2 max-h-[180px] overflow-y-auto divide-y">
      {filteredFriends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted transition border-border/50"
          onClick={() => onSelect(friend)}
        >
          <UserAvatar
            type="chat"
            name={friend.displayName}
            avatarUrl={friend.avatarUrl}
           />
          <span className="font-medium">{friend.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default InviteSuggestionList;
