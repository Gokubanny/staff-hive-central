import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Companies from "./pages/Companies";
import Payroll from "./pages/Payroll";
import Applicants from "./pages/Applicants";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/companies" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Companies />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Payroll />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/applicants" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Applicants />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-foreground mb-4">Knowledge Base</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-foreground mb-4">Reports</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-foreground mb-4">Settings</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
