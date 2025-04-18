
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassInput, GlassButton } from "@/components/ui/glassmorphism";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      if (onSuccess) onSuccess();
      navigate("/chats");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassContainer className="w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Secure Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
            Email
          </label>
          <GlassInput
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
