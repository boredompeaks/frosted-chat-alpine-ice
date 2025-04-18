
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassContainer, GlassInput, GlassButton } from "@/components/ui/glassmorphism";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, username);
      toast({
        title: "Success",
        description: "Your account has been created. Please check your email for confirmation.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassContainer className="w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
            Username
          </label>
          <GlassInput
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
            Confirm Password
          </label>
          <GlassInput
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="pt-2">
          <GlassButton
            type="submit"
            className="w-full bg-ice-accent/20 hover:bg-ice-accent/40"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register"}
          </GlassButton>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/login")}
            className="text-ice-accent hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </GlassContainer>
  );
};

export default RegisterForm;
