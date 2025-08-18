import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Shield, Bell, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Outlet } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: "Profile Settings",
      description: "Update your personal information and preferences",
      icon: <User className="h-6 w-6 text-primary" />,
      path: "profile" // Relative path
    },
    {
      title: "Security",
      description: "Manage passwords, two-factor authentication, and security settings",
      icon: <Shield className="h-6 w-6 text-primary" />,
      path: "security" // Relative path
    },
    {
      title: "Notifications",
      description: "Configure email and system notifications",
      icon: <Bell className="h-6 w-6 text-primary" />,
      path: "notifications" // Relative path
    },
    {
      title: "System Settings",
      description: "Company settings, integrations, and data management",
      icon: <Database className="h-6 w-6 text-primary" />,
      path: "system" // Relative path
    }
  ];

  return (
    <div className="p-6 ml-64">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-600">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(card.path)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {card.icon}
                  {card.title}
                </CardTitle>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{card.description}</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-primary hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  navigate(card.path);
                }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* This renders the nested routes */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}