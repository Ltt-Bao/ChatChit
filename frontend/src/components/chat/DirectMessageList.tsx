
import {useChatStore} from '@/stores/useChatStore'
import DirectMessageCard from './DirectMessageCard';

const DirectMessageList = () => {
  const { conversations } = useChatStore();  
  if (!conversations) return null;

  const directConversations = conversations.filter(
    (convo) => convo.type === 'direct').slice(0, 5);
  return (
    <div className="space-y-2 p-1">
      {
        directConversations.map((convo) => (
        <DirectMessageCard 
          convo={convo}
          key={convo._id}
        />
      ))
    }
    </div>
  )
}

export default DirectMessageList
