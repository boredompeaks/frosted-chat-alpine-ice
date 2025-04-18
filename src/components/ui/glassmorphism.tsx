
import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
  children: React.ReactNode;
}

export const GlassContainer = ({
  className,
  variant = "light",
  children,
  ...props
}: GlassContainerProps) => {
  return (
    <div
      className={cn(
        variant === "light" ? "glass" : "glass-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const GlassButton = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: GlassButtonProps) => {
  return (
    <button
      className={cn(
        "glass-button flex items-center justify-center font-medium",
        {
          "border-none": variant === "ghost",
          "border-white/30": variant === "outline",
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassCard = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("glass-card", className)} {...props}>
      {children}
    </div>
  );
};

export const GlassInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "glass w-full px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-ice-accent/50",
        className
      )}
      {...props}
    />
  );
};

export const GlassTextarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={cn(
        "glass w-full px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-ice-accent/50 resize-none",
        className
      )}
      {...props}
    />
  );
};

interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "destructive" | "success";
  children: React.ReactNode;
}

export const GlassBadge = ({
  className,
  variant = "default",
  children,
  ...props
}: GlassBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "glass": variant === "default",
          "border border-white/30 bg-transparent": variant === "outline",
          "bg-destructive/80 backdrop-blur-md": variant === "destructive",
          "bg-green-500/80 backdrop-blur-md": variant === "success",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  );
};

interface DisappearingMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  duration: number; // Duration in seconds
  onDisappear?: () => void;
  children: React.ReactNode;
}

export const DisappearingMessage = ({
  className,
  duration,
  onDisappear,
  children,
  ...props
}: DisappearingMessageProps) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onDisappear) onDisappear();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onDisappear]);

  return (
    <div 
      className={cn("disappearing-message", className)}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};
