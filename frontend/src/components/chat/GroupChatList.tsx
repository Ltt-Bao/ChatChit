import { useChatStore } from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;

  const groupchats = conversations.filter((convo) => convo.type === "group").slice(0, 5);
  return (
    <div className="space-y-2 p-1">
      {groupchats.map((convo) => (
        <GroupChatCard convo={convo}
        key={convo._id} />
      ))}
    </div>
  );
};

export default GroupChatList;
