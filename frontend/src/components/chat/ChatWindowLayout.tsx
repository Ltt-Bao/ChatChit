import { useChatStore } from "@/stores/useChatStore"
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeletion from "./ChatWindowSkeletion";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";


const ChatWindowLayout = () => {
  const {activeConversationId, conversations, messageLoading} = useChatStore();

  const selectedConvo = conversations.find((c) => c._id === activeConversationId) ?? null;
  
  if(!selectedConvo){
    return <ChatWelcomeScreen/>;
  }
  
  if(messageLoading){
    return<ChatWindowSkeletion/>
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-sm">
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo}/>
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody/>
      </div>

      {/* Footer */}
      <MessageInput selectedConvo={selectedConvo}/>
    </SidebarInset>
    
  )
}

export default ChatWindowLayout
