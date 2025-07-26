import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Key, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Lock,
  AlertTriangle,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  matchUpdates: boolean;
  weeklyDigest: boolean;
  newFeatures: boolean;
}

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    matchUpdates: true,
    weeklyDigest: true,
    newFeatures: false,
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsUpdating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Notification preference updated",
      description: "Your notification settings have been saved",
    });
  };

  const handleDataExport = () => {
    toast({
      title: "Data export started",
      description: "Your data export will be ready shortly and sent to your email",
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences, security, and privacy settings</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-gray-600">Choose how you'd like to be notified about updates and activities</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive important updates via SMS</p>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Types</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Security Alerts</Label>
                  <p className="text-sm text-gray-600">Important security-related notifications</p>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Match Updates</Label>
                  <p className="text-sm text-gray-600">Notifications when new matches are found</p>
                </div>
                <Switch
                  checked={notifications.matchUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('matchUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Weekly Digest</Label>
                  <p className="text-sm text-gray-600">Weekly summary of your activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Product updates and promotional content</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">New Features</Label>
                  <p className="text-sm text-gray-600">Announcements about new platform features</p>
                </div>
                <Switch
                  checked={notifications.newFeatures}
                  onCheckedChange={(checked) => handleNotificationChange('newFeatures', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <p className="text-sm text-gray-600">Manage your account security and privacy preferences</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Change */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </h4>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Not Enabled
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>

          <Separator />

          {/* Session Management */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Active Sessions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-gray-600">Chrome on macOS • Last active now</p>
                </div>
                <Badge variant="secondary">Current</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              <Lock className="mr-2 h-4 w-4" />
              Sign Out All Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <p className="text-sm text-gray-600">Manage your data and privacy preferences</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Data Export</Label>
                <p className="text-sm text-gray-600">Download a copy of your data</p>
              </div>
              <Button variant="outline" onClick={handleDataExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-base font-medium text-red-600 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Delete Account
                  </Label>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleAccountDeletion}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}