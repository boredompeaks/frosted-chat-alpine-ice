
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassInput, GlassButton, GlassCard } from "@/components/ui/glassmorphism";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_USERS = [
  { id: "u1", username: "Alice", status: "Active now" },
  { id: "u2", username: "Bob", status: "Last seen 2h ago" },
  { id: "u3", username: "Charlie", status: "Active now" },
  { id: "u4", username: "Diana", status: "Last seen yesterday" },
  { id: "u5", username: "Edward", status: "Active now" },
  { id: "u6", username: "Fiona", status: "Last seen 5m ago" },
];

const NewChat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredUsers = MOCK_USERS.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (userId: string) => {
    toast({
      title: "Chat started",
      description: "You can now start messaging securely",
    });
    
    // For now, we'll navigate to the first mock chat
    navigate(`/chats/1`);
  };

  return (
    <GlassContainer className="w-full max-w-md h-full max-h-[90vh] flex flex-col">
      <div className="flex items-center p-4 border-b border-white/10">
        <GlassButton
          size="sm"
          variant="ghost"
          className="mr-2"
          onClick={() => navigate("/chats")}
        >
          <ArrowLeft size={20} />
        </GlassButton>
        <h1 className="text-xl font-bold text-white">New Secure Chat</h1>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
          <GlassInput 
            placeholder="Search for users" 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <GlassCard 
                key={user.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-ice-dark/50 border border-ice-accent/30 flex items-center justify-center text-lg font-medium">
                    {user.username.charAt(0)}
                  </div>
                  
                  <div className="ml-3">
                    <h3 className="text-white font-medium">{user.username}</h3>
                    <p className="text-white/60 text-sm">{user.status}</p>
                  </div>
                </div>
                
                <GlassButton
                  size="sm"
                  className="bg-ice-accent/20 hover:bg-ice-accent/40"
                  onClick={() => handleStartChat(user.id)}
                >
                  <UserPlus size={18} />
                </GlassButton>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-white/60">No users found</p>
            </div>
          )}
        </div>
      </div>
    </GlassContainer>
  );
};

export default NewChat;
