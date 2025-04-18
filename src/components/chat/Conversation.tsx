
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlassContainer, GlassTextarea, GlassButton, GlassBadge, TypingIndicator, DisappearingMessage } from "@/components/ui/glassmorphism";
import { ArrowLeft, Send, Image, Clock, Check, CheckCheck, Eye, Smile, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "me" | "them";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  isDisappearing?: boolean;
  disappearAfter?: number; // in seconds
  reactions?: { emoji: string; by: "me" | "them" }[];
  media?: {
    type: "image";
    url: string;
    oneTimeView?: boolean;
    viewed?: boolean;
  };
}

const MOCK_CONTACTS = {
  "1": { username: "Alice", status: "Just saw a beautiful sunset!" },
  "2": { username: "Bob", status: "" },
  "3": { username: "Charlie", status: "Busy with work" },
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Hey there! How are you doing?",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "read",
    },
    {
      id: "m2",
      content: "I'm good, thanks! How about you?",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
      status: "read",
    },
    {
      id: "m3",
      content: "This is a disappearing message that will self-destruct!",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: "read",
      isDisappearing: true,
      disappearAfter: 30, // 30 seconds
    },
    {
      id: "m4",
      content: "Check out this photo I took yesterday",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: "read",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
        oneTimeView: false,
      },
      reactions: [
        { emoji: "❤️", by: "me" }
      ]
    },
    {
      id: "m5",
      content: "And here's a one-time view image",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      status: "read",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80&w=800",
        oneTimeView: true,
      }
    },
    {
      id: "m6",
      content: "These photos are beautiful!",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m1",
      content: "Can we meet tomorrow?",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: "read",
    },
    {
      id: "m2",
      content: "Sure, what time works for you?",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      status: "delivered",
    },
  ],
  "3": [
    {
      id: "m1",
      content: "I'll send you the documents later",
      sender: "them",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      status: "read",
    },
  ],
};

const EMOJIS = ["👍", "❤️", "😊", "😂", "😮", "😢", "🎉"];

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<{ username: string; status: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id && MOCK_CONTACTS[id as keyof typeof MOCK_CONTACTS]) {
      setContact(MOCK_CONTACTS[id as keyof typeof MOCK_CONTACTS]);
    }
    
    if (id && MOCK_MESSAGES[id]) {
      setMessages(MOCK_MESSAGES[id]);
    }
    
    // Simulate typing indicator randomly
    const typingInterval = setInterval(() => {
      const shouldType = Math.random() > 0.7;
      if (shouldType) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 10000);
    
    return () => clearInterval(typingInterval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim() && !fileInputRef.current?.files?.length) return;
    
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      content: message,
      sender: "me",
      timestamp: new Date(),
      status: "sent",
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "delivered" } 
            : msg
        )
      );
    }, 1000);
    
    // Simulate message being read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "read" } 
            : msg
        )
      );
    }, 3000);
    
    // Simulate reply if appropriate
    if (Math.random() > 0.3) {
      // Show typing indicator
      setTimeout(() => setIsTyping(true), 2000);
      
      // Send reply
      setTimeout(() => {
        setIsTyping(false);
        
        const replies = [
          "That's interesting!",
          "I see what you mean.",
          "Tell me more about that.",
          "I was just thinking about that!",
          "Good point!",
          "I'm not sure I agree, but I see your perspective."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMessage: Message = {
          id: `new-reply-${Date.now()}`,
          content: randomReply,
          sender: "them",
          timestamp: new Date(),
          status: "delivered",
        };
        
        setMessages(prev => [...prev, replyMessage]);
      }, 4000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the file to storage
    // For now, we'll create a blob URL
    const imageUrl = URL.createObjectURL(file);
    
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      content: "",
      sender: "me",
      timestamp: new Date(),
      status: "sent",
      media: {
        type: "image",
        url: imageUrl,
        oneTimeView: false,
      }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewOneTimeMedia = (messageId: string) => {
    // Mark the media as viewed
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId && msg.media?.oneTimeView
          ? { ...msg, media: { ...msg.media, viewed: true } } 
          : msg
      )
    );
    
    // After a short delay, remove the media
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId
            ? { ...msg, content: "This media has expired", media: undefined }
            : msg
        )
      );
      
      toast({
        title: "Media expired",
        description: "The one-time view media has expired",
      });
    }, 5000);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          // Check if this reaction already exists
          const existingReactionIndex = msg.reactions?.findIndex(
            r => r.emoji === emoji && r.by === "me"
          );
          
          if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
            // Remove the reaction
            const newReactions = [...(msg.reactions || [])];
            newReactions.splice(existingReactionIndex, 1);
            return { ...msg, reactions: newReactions.length ? newReactions : undefined };
          } else {
            // Add the reaction
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, by: "me" }
              ]
            };
          }
        }
        return msg;
      })
    );
    
    setReactingToMessageId(null);
    setShowEmojiPicker(false);
  };

  const handleMessageDisappear = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageStatus = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check size={14} className="text-white/70" />;
      case "delivered":
        return <CheckCheck size={14} className="text-white/70" />;
      case "read":
        return <CheckCheck size={14} className="text-ice-accent" />;
    }
  };

  if (!contact) {
    return (
      <GlassContainer className="w-full max-w-md h-full flex items-center justify-center">
        <p className="text-white">Conversation not found</p>
      </GlassContainer>
    );
  }

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
        
        <div className="flex-1">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-ice-dark/50 border border-ice-accent/30 flex items-center justify-center text-lg font-medium">
              {contact.username.charAt(0)}
            </div>
            
            <div className="ml-3">
              <h2 className="text-white font-medium">{contact.username}</h2>
              {isTyping ? (
                <p className="text-ice-accent text-xs">typing...</p>
              ) : contact.status ? (
                <p className="text-ice-accent text-xs truncate">{contact.status}</p>
              ) : (
                <p className="text-white/60 text-xs">Online</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="relative group">
              {msg.isDisappearing ? (
                <DisappearingMessage
                  className={msg.sender === "me" ? "message-sent" : "message-received"}
                  duration={msg.disappearAfter || 10}
                  onDisappear={() => handleMessageDisappear(msg.id)}
                >
                  <div className="flex items-start">
                    {msg.content && <p>{msg.content}</p>}
                    <Clock size={14} className="ml-1 mt-1 text-white/70" />
                  </div>
                </DisappearingMessage>
              ) : (
                <div className={msg.sender === "me" ? "message-sent" : "message-received"}>
                  {msg.media && (
                    <div className="mb-2 relative">
                      {msg.media.oneTimeView && !msg.media.viewed ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <GlassButton 
                              onClick={() => handleViewOneTimeMedia(msg.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye size={16} />
                              <span>View Once</span>
                            </GlassButton>
                          </div>
                          <img 
                            src={msg.media.url} 
                            alt="One-time view media" 
                            className="w-full rounded-lg opacity-30 max-h-60 object-cover"
                          />
                        </div>
                      ) : msg.media.viewed ? (
                        <div className="bg-black/20 w-full h-40 rounded-lg flex items-center justify-center">
                          <p className="text-white/70">Media expired</p>
                        </div>
                      ) : (
                        <img 
                          src={msg.media.url} 
                          alt="Media" 
                          className="w-full rounded-lg max-h-60 object-cover"
                        />
                      )}
                    </div>
                  )}
                  
                  {msg.content && <p>{msg.content}</p>}
                  
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-white/60 text-xs">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.sender === "me" && renderMessageStatus(msg.status)}
                  </div>
                  
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex mt-1 space-x-1">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index} className="text-sm bg-white/10 px-1 rounded">
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {!msg.isDisappearing && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GlassButton
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setReactingToMessageId(msg.id);
                      setShowEmojiPicker(true);
                    }}
                  >
                    <Smile size={14} />
                  </GlassButton>
                </div>
              )}
              
              {reactingToMessageId === msg.id && showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 glass p-2 rounded-lg flex space-x-2">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className="text-lg hover:bg-white/10 p-1 rounded"
                      onClick={() => handleReaction(msg.id, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message-received w-auto">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end space-x-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </GlassButton>
          
          <GlassTextarea
            placeholder="Type a secure message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 max-h-20"
          />
          
          <GlassButton
            disabled={!message.trim()}
            onClick={handleSendMessage}
            className="bg-ice-accent/20 hover:bg-ice-accent/40"
          >
            <Send size={20} />
          </GlassButton>
        </div>
      </div>
    </GlassContainer>
  );
};

export default Conversation;
