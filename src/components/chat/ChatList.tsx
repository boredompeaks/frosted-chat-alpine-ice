import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassCard, GlassBadge, GlassInput, GlassButton } from "@/components/ui/glassmorphism";
import { Bell, LogOut, Plus, Search, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatPreview {
  id: string;
  username: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  status?: string;
}

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for chat list
    const mockChats: ChatPreview[] = [
      {
        id: "1",
        username: "Alice",
        lastMessage: "Hey, how are you doing?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unread: 2,
        status: "Just saw a beautiful sunset!"
      },
      {
        id: "2",
        username: "Bob",
        lastMessage: "Can we meet tomorrow?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        unread: 0,
      },
      {
        id: "3",
        username: "Charlie",
        lastMessage: "I'll send you the documents later",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        unread: 1,
        status: "Busy with work"
      }
    ];
    
    setChats(mockChats);
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("briar-user");
    toast({
      title: "Logged out",
      description: "You have successfully logged out",
    });
    navigate("/login");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than a day, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If less than a week, show day
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <GlassContainer className="w-full max-w-md h-full max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">Secure Chats</h1>
        <div className="flex gap-2">
          <GlassButton
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </GlassButton>
          <GlassButton
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} />
          </GlassButton>
          <GlassButton
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </GlassButton>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
          <GlassInput 
            placeholder="Search contacts" 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <GlassCard 
                key={chat.id}
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-ice-dark/50 border border-ice-accent/30 flex items-center justify-center text-lg font-medium">
                    {chat.username.charAt(0)}
                  </div>
                  {chat.status && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-ice-dark"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{chat.username}</h3>
                    <span className="text-white/70 text-xs">{formatTime(chat.timestamp)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-white/70 text-sm truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <GlassBadge variant="success" className="ml-2">
                        {chat.unread}
                      </GlassBadge>
                    )}
                  </div>
                  
                  {chat.status && (
                    <p className="text-ice-accent text-xs mt-1 truncate">
                      {chat.status}
                    </p>
                  )}
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-white/60">No chats found</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <GlassButton
          className="w-full bg-ice-accent/20 hover:bg-ice-accent/40 flex items-center justify-center gap-2"
          onClick={() => navigate("/new-chat")}
        >
          <Plus size={18} />
          <span>New Secure Chat</span>
        </GlassButton>
      </div>
    </GlassContainer>
  );
};

export default ChatList;
