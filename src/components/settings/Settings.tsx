
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassButton, GlassCard } from "@/components/ui/glassmorphism";
import { ArrowLeft, Moon, Sun, Clock, Bell, BellOff, Trash, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onThemeChange: (theme: "light" | "dark") => void;
  currentTheme: "light" | "dark";
}

const Settings: React.FC<SettingsProps> = ({ onThemeChange, currentTheme }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [disappearingTime, setDisappearingTime] = useState(30); // in seconds
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user from localStorage
    const userJson = localStorage.getItem("briar-user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUsername(user.username || "");
    }
  }, []);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    
    toast({
      title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      description: notificationsEnabled 
        ? "You will not receive notification alerts" 
        : "You will now receive notification alerts",
    });
  };

  const handleSetDisappearingTime = (seconds: number) => {
    setDisappearingTime(seconds);
    
    toast({
      title: "Default timer updated",
      description: `Messages will disappear after ${seconds} seconds`,
    });
  };

  const handleClearAllChats = () => {
    toast({
      title: "Chats cleared",
      description: "All your chat history has been deleted",
    });
  };

  const handleSaveProfile = () => {
    if (username.trim()) {
      const userJson = localStorage.getItem("briar-user");
      if (userJson) {
        const user = JSON.parse(userJson);
        localStorage.setItem("briar-user", JSON.stringify({
          ...user,
          username,
        }));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
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
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium text-white mb-3 flex items-center">
              <User size={18} className="mr-2" />
              Profile
            </h2>
            <GlassCard className="p-4">
              <div className="mb-4">
                <label className="block text-white/80 text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ice-accent/50"
                />
              </div>
              <GlassButton
                className="w-full bg-ice-accent/20 hover:bg-ice-accent/40"
                onClick={handleSaveProfile}
              >
                Save Profile
              </GlassButton>
            </GlassCard>
          </section>
          
          <section>
            <h2 className="text-lg font-medium text-white mb-3 flex items-center">
              <Lock size={18} className="mr-2" />
              Privacy
            </h2>
            <GlassCard className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {notificationsEnabled ? <Bell size={18} className="mr-2" /> : <BellOff size={18} className="mr-2" />}
                    <span className="text-white">Notifications</span>
                  </div>
                  <GlassButton
                    size="sm"
                    className={notificationsEnabled ? "bg-ice-accent/20" : "bg-white/10"}
                    onClick={handleToggleNotifications}
                  >
                    {notificationsEnabled ? "On" : "Off"}
                  </GlassButton>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Clock size={18} className="mr-2" />
                  <span className="text-white">Default disappearing messages</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10, 30, 60, 300, 3600].map((seconds) => (
                    <GlassButton
                      key={seconds}
                      size="sm"
                      className={disappearingTime === seconds ? "bg-ice-accent/30" : "bg-white/10"}
                      onClick={() => handleSetDisappearingTime(seconds)}
                    >
                      {seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
                    </GlassButton>
                  ))}
                </div>
              </div>
            </GlassCard>
          </section>
          
          <section>
            <h2 className="text-lg font-medium text-white mb-3">Appearance</h2>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Theme</span>
                <div className="flex gap-2">
                  <GlassButton
                    size="sm"
                    className={currentTheme === "light" ? "bg-ice-accent/30" : "bg-white/10"}
                    onClick={() => onThemeChange("light")}
                  >
                    <Sun size={16} className="mr-1" />
                    Light
                  </GlassButton>
                  <GlassButton
                    size="sm"
                    className={currentTheme === "dark" ? "bg-ice-accent/30" : "bg-white/10"}
                    onClick={() => onThemeChange("dark")}
                  >
                    <Moon size={16} className="mr-1" />
                    Dark
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </section>
          
          <section>
            <h2 className="text-lg font-medium text-white mb-3">Data</h2>
            <GlassCard className="p-4">
              <GlassButton
                className="w-full text-red-400 hover:text-red-300 flex items-center justify-center"
                onClick={handleClearAllChats}
              >
                <Trash size={16} className="mr-2" />
                Clear All Chats
              </GlassButton>
            </GlassCard>
          </section>
        </div>
      </div>
    </GlassContainer>
  );
};

export default Settings;
