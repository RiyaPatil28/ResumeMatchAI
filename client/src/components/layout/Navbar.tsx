import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Brain, User, LogOut, Settings, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New candidate match",
      message: "John Doe has a 95% match for Frontend Developer position",
      time: "2 minutes ago",
      read: false,
      type: "success"
    },
    {
      id: "2",
      title: "Resume processed",
      message: "Jane Smith's resume has been analyzed successfully",
      time: "1 hour ago",
      read: false,
      type: "info"
    },
    {
      id: "3",
      title: "Job posting updated",
      message: "Backend Developer requirements have been modified",
      time: "3 hours ago",
      read: true,
      type: "info"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Job Postings", path: "/jobs" },
    { name: "Candidates", path: "/candidates" },
    { name: "Analytics", path: "/analytics" },
  ];

  const isActiveTab = (path: string) => {
    if (path === "/" && (location === "/" || location === "/dashboard")) return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🎉";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Brain className="text-primary text-2xl mr-3" />
              <span className="text-xl font-semibold text-gray-900">ResumeMatch AI</span>
            </Link>
            
            {/* Navigation Tabs */}
            <nav className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors ${
                    isActiveTab(item.path)
                      ? "text-primary border-primary"
                      : "text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary">{unreadCount} new</Badge>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          notification.read 
                            ? "bg-gray-50 border-gray-200" 
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t">
                    <Button variant="ghost" className="w-full text-sm">
                      View all notifications
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || 'User'
                    }
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm text-gray-700">
                  <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  {user?.company && (
                    <div className="text-xs text-gray-500">{user.company}</div>
                  )}
                </div>
                <div className="border-t border-gray-100" />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <div className="border-t border-gray-100" />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}