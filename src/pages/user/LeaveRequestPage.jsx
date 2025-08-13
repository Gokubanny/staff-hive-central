import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Using existing AuthContext
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ... other imports ...

export default function LeaveRequestPage() {
  // Access both auth and UI context from the same hook
  const { 
    user, 
    logout, 
    theme, 
    toggleTheme,
    sidebarOpen,
    toggleSidebar
  } = useAuth();

  // ... rest of your existing leave request code ...

  return (
    <div className="space-y-6">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request Leave</h1>
          <p className="text-muted-foreground mt-2">
            Submit a new leave request for approval
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? '◄ Hide Sidebar' : '► Show Sidebar'}
          </Button>
        </div>
      </div>

      {/* ... rest of your leave request form ... */}
    </div>
  );
}