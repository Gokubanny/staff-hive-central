import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/employees" element={
            <DashboardLayout>
              <Employees />
            </DashboardLayout>
          } />
          <Route path="/companies" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Companies</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/payroll" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Payroll</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/applicants" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Applicants</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/resources" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Knowledge Base</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/reports" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Reports</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Settings</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
