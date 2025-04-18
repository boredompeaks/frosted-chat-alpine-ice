
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassInput, GlassButton } from "@/components/ui/glassmorphism";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // This is where you would normally connect to a backend API
    // For now, we'll simulate a login
    setTimeout(() => {
      localStorage.setItem("briar-user", JSON.stringify({ username }));
      setIsLoading(false);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      if (onSuccess) onSuccess();
      navigate("/chats");
    }, 1500);
  };

  return (
    <GlassContainer className="w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Secure Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
            Username
          </label>
          <GlassInput
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
            Password
          </label>
          <GlassInput
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="pt-2">
          <GlassButton
            type="submit"
            className="w-full bg-ice-accent/20 hover:bg-ice-accent/40"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </GlassButton>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          Don't have an account?{" "}
          <button 
            onClick={() => navigate("/register")}
            className="text-ice-accent hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </GlassContainer>
  );
};

export default LoginForm;
