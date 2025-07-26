import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/not-found";

// Lazy load pages for better performance
const JobPostings = lazy(() => import("@/pages/job-postings"));
const Candidates = lazy(() => import("@/pages/candidates"));
const Analytics = lazy(() => import("@/pages/analytics"));
const ProfileSettings = lazy(() => import("@/pages/profile-settings"));
const AccountSettings = lazy(() => import("@/pages/account-settings"));
const Support = lazy(() => import("@/pages/support"));

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/jobs" component={JobPostings} />
          <Route path="/candidates" component={Candidates} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/profile-settings" component={ProfileSettings} />
          <Route path="/account-settings" component={AccountSettings} />
          <Route path="/support" component={Support} />
          <Route path="/" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
