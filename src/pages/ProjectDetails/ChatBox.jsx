import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input'
import { Button } from "../../components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchChatByProject, fetchChatMessages, sendMessage } from '../../Redux/Chat/Action';

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { chat, auth } = useSelector(store => store);
  const { chatData, messages } = chat || {};
  const { user } = auth || {};

  useEffect(() => {
    if (projectId) {
      console.log("Fetching project chat for ID:", projectId);
      dispatch(fetchChatByProject(projectId));
      
      // Load stored messages immediately
      const storedMessages = JSON.parse(localStorage.getItem(`project_${projectId}_messages`) || '[]');
      setLocalMessages(storedMessages);
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (chatData?.id) {
      console.log("Fetching chat messages for chat ID:", chatData.id);
      dispatch(fetchChatMessages(chatData.id));
    }
  }, [dispatch, chatData]);

  // Auto-refresh messages every 1 second for real-time chat
  useEffect(() => {
    const interval = setInterval(() => {
      if (projectId) {
        const storageKey = `project_${projectId}_messages`;
        const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const lastUpdate = localStorage.getItem(`${storageKey}_updated`);
        
        // Force update if messages changed or timestamp updated
        if (JSON.stringify(storedMessages) !== JSON.stringify(localMessages) || lastUpdate) {
          console.log("🔄 Refreshing chat messages for cross-account sync");
          console.log("📨 Messages found:", storedMessages.length);
          setLocalMessages(storedMessages);
          
          // Clear the update flag
          if (lastUpdate) {
            localStorage.removeItem(`${storageKey}_updated`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId, localMessages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    
    // Get current user data for real-time team chat
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Generate unique ID for message with timestamp and user info
    const uniqueId = `msg_${Date.now()}_${currentUser?.id || 'anon'}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create message with comprehensive user data
    const newMessage = {
      id: uniqueId,
      content: message.trim(),
      sender: {
        id: currentUser.id,
        fullName: currentUser.fullName || currentUser.name,
        name: currentUser.name || currentUser.fullName,
        email: currentUser.email
      },
      user: {
        id: currentUser.id,
        fullName: currentUser.fullName || currentUser.name,
        name: currentUser.name || currentUser.fullName,
        email: currentUser.email
      },
      senderId: currentUser.id,
      userId: currentUser.id,
      timeStamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      projectId: projectId
    };
    
    console.log("=== SENDING TEAM CHAT MESSAGE ===");
    console.log("Message:", message.trim());
    console.log("Sender Name:", currentUser.fullName || currentUser.name || 'Unknown');
    console.log("Sender ID:", currentUser.id);
    console.log("Message ID:", uniqueId);
    console.log("Project ID:", projectId);
    
    // Store in localStorage for cross-account visibility
    const storageKey = `project_${projectId}_messages`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add message if it doesn't already exist
    const messageExists = existingMessages.some(msg => msg.id === uniqueId);
    if (!messageExists) {
      existingMessages.push(newMessage);
      localStorage.setItem(storageKey, JSON.stringify(existingMessages));
      console.log("✅ Message stored for ALL team members to see");
      console.log("✅ Storage key:", storageKey);
      console.log("✅ Total messages in storage:", existingMessages.length);
    }
    
    setMessage("");
    
    // Force refresh of messages by updating localStorage timestamp
    localStorage.setItem(`${storageKey}_updated`, Date.now().toString());
    
    // Also try to send to backend if chat exists
    if (chatData?.id) {
      const messageData = {
        content: newMessage.content,
        chatId: chatData.id,
        senderId: currentUser?.id
      };
      
      try {
        await dispatch(sendMessage(messageData));
        console.log("Message sent to backend successfully");
      } catch (error) {
        console.error("Backend message send failed:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSendMessage();
    }
  };

  return (
    <div className="sticky">
      <div className="border rounded-lg">
        <h5 className="border-b p-3 sm:p-5 flex items-center gap-2">
          <span className="text-sm sm:text-base">Team Chat</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Chat"></div>
        </h5>

        <ScrollArea className="h-[20rem] sm:h-[28rem] lg:h-[32rem] w-full p-3 sm:p-5 flex gap-3 flex-col">
          {/* Show messages for ALL team members - owner and invited members */}
          {(() => {
            // Remove sample messages - use only real messages for effective team chat
            const sampleMessages = [];
            
            // Get user mapping for proper name display
            const getUserInfo = (msg) => {
              // Try to get user info from message sender/user fields
              const sender = msg.sender || msg.user;
              if (sender?.fullName || sender?.name) {
                return {
                  name: sender.fullName || sender.name,
                  id: sender.id,
                  email: sender.email
                };
              }
              
              // Fallback: try to get from localStorage if only senderId is available
              if (msg.senderId) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (currentUser.id === msg.senderId) {
                  return {
                    name: currentUser.fullName || currentUser.name || 'You',
                    id: currentUser.id,
                    email: currentUser.email
                  };
                }
              }
              
              // Additional fallback: check if message has any user identifier
              if (msg.userId) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (currentUser.id === msg.userId) {
                  return {
                    name: currentUser.fullName || currentUser.name || 'You',
                    id: currentUser.id,
                    email: currentUser.email
                  };
                }
              }
              
              return { name: 'Team Member', id: null, email: null };
            };
            
            // PRIMARY: Load messages from localStorage (cross-account storage)
            const storageKey = `project_${projectId}_messages`;
            const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // SECONDARY: Load from localMessages state (current session)
            const sessionMessages = localMessages || [];
            
            // TERTIARY: Load from Redux (backend messages)
            const reduxMessages = (messages && Array.isArray(messages) ? messages : []);
            
            console.log("=== CHAT MESSAGE SOURCES ===");
            console.log("🗄️ localStorage messages:", storedMessages.length);
            console.log("💾 Session messages:", sessionMessages.length);
            console.log("🌐 Redux messages:", reduxMessages.length);
            
            // Create comprehensive message map for deduplication
            const messageMap = new Map();
            
            // Add all message sources with priority: localStorage > session > redux
            [...reduxMessages, ...sessionMessages, ...storedMessages].forEach(msg => {
              if (msg && msg.content && msg.content.trim()) {
                const msgId = msg.id || `fallback_${msg.content}_${msg.timeStamp || msg.createdAt}`;
                messageMap.set(msgId, { ...msg, userInfo: getUserInfo(msg) });
              }
            });
            
            // Convert to sorted array
            const allMessages = Array.from(messageMap.values())
              .sort((a, b) => new Date(a.timeStamp || a.createdAt) - new Date(b.timeStamp || b.createdAt));
            
            console.log("=== FINAL CHAT STATE ===");
            console.log("📊 Total unique messages:", allMessages.length);
            console.log("🔑 Storage key:", storageKey);
            
            // Debug each message
            allMessages.forEach((msg, i) => {
              console.log(`📝 Message ${i + 1}: "${msg.content}" from: ${msg.userInfo.name} (ID: ${msg.userInfo.id || 'no-id'})`);
            });
            
            return allMessages.length > 0 ? (
              allMessages.map((msg) => {
                // Generate unique key for React rendering
                const uniqueKey = msg.id || `${msg.content}_${msg.timeStamp || msg.createdAt}_${msg.userInfo.id || 'anon'}`;
                
                // Get current user from localStorage for proper comparison
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const isCurrentUser = msg.sender?.id === currentUser?.id || 
                                    msg.user?.id === currentUser?.id ||
                                    msg.sender?.email === currentUser?.email ||
                                    msg.user?.email === currentUser?.email;
                
              return isCurrentUser ? (
                // Current user's messages (right side)
                <div className="flex gap-2 mb-2 justify-end" key={uniqueKey}>
                  <div className="space-y-1 sm:space-y-2 py-2 px-3 sm:px-5 border rounded-se-2xl rounded-s-xl bg-blue-600/20 max-w-[80%] sm:max-w-[70%]">
                    <p className="text-xs sm:text-sm font-medium">
                      {msg.userInfo.name === 'Team Member' ? 'You' : msg.userInfo.name}
                    </p>
                    <p className="text-gray-300 text-sm sm:text-base break-words">{msg.content}</p>
                    <p className="text-xs text-gray-500">
                      {msg.timeStamp ? new Date(msg.timeStamp).toLocaleTimeString() : 
                       msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'now'}
                    </p>
                  </div>
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white text-xs sm:text-sm">
                      {msg.userInfo.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                // Other team members' messages (left side)
                <div className="flex gap-2 mb-2 justify-start" key={uniqueKey}>
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                    <AvatarFallback className="bg-gray-600 text-white text-xs sm:text-sm">
                      {msg.userInfo.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 sm:space-y-2 py-2 px-3 sm:px-5 border rounded-ss-2xl rounded-e-xl bg-gray-700/20 max-w-[80%] sm:max-w-[70%]">
                    <p className="text-xs sm:text-sm font-medium">
                      {msg.userInfo.name}
                    </p>
                    <p className="text-gray-300 text-sm sm:text-base break-words">{msg.content}</p>
                    <p className="text-xs text-gray-500">
                      {msg.timeStamp ? new Date(msg.timeStamp).toLocaleTimeString() : 
                       msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'now'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center">No messages yet. Start the conversation!</p>
            </div>
          );
        })()}
        </ScrollArea>

        <div className="relative">
          <Input
            placeholder="Type message"
            className="py-4 sm:py-7 border-t outline-none focus:outline-none focus:ring-0 rounded-none border-b-0 border-x-0 text-sm sm:text-base pr-12 sm:pr-14"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSendMessage}
            className="absolute right-2 top-2 sm:top-3 rounded-full w-8 h-8 sm:w-10 sm:h-10"
            size="icon"
            variant="ghost"
          >
            <PaperPlaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
