import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserLayout } from "@/components/UserLayout";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Employees from "./pages/Employees";
import Companies from "./pages/Companies";
import Payroll from "./pages/Payroll";
import GeneratePayroll from "./pages/GeneratePayroll";
import Applicants from "./pages/Applicants";
import AddApplicant from "./pages/AddApplicant";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AddCompanies from "./components/AddCompanies";
import EditCompany from "./components/EditCompany";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact";
import Knowledge from "./pages/Knowledge";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Payslip from './pages/Payslip';
import AdminPostJob from "./pages/admin/AdminPostJob";

// Import all user pages
import UserLeavePage from "./pages/user/UserLeavePage";
import UserTrainingPage from "./pages/user/UserTrainingPage";
import UserBenefitsPage from "./pages/user/UserBenefitsPage";
import UserJobsPage from "./pages/user/UserJobsPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import LeaveRequestPage from "./pages/user/LeaveRequestPage";
import LeaveBalancePage from "./pages/user/LeaveBalancePage";
import LeaveHistoryPage from "./pages/user/LeaveHistoryPage";
import LeavePoliciesPage from "./pages/user/LeavePoliciesPage";

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
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="companies" element={<Companies />} />
                <Route path="edit-company/:id" element={<EditCompany />} />
                <Route path="employees" element={<Employees />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="payslip/:employeeId" element={<Payslip />} />
                <Route path="generate-payroll" element={<GeneratePayroll />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="add-applicant" element={<AddApplicant />} />
                <Route path="post-job" element={<AdminPostJob />} />
                <Route path="knowledge" element={<Knowledge />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* User routes */}
              <Route path="/user-dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route index element={<UserDashboard />} />
                <Route path="leave" element={<UserLeavePage />}>
                  <Route path="request" element={<LeaveRequestPage />} />
                  <Route path="balance" element={<LeaveBalancePage />} />
                  <Route path="history" element={<LeaveHistoryPage />} />
                </Route>
                <Route path="training" element={<UserTrainingPage />} />
                <Route path="benefits" element={<UserBenefitsPage />} />
                <Route path="jobs" element={<UserJobsPage />} />
                <Route path="profile" element={<UserProfilePage />} />
              </Route>

              {/* Admin-only standalone routes */}
              <Route path="/add-companies" element={
                <ProtectedRoute requiredRole="admin">
                  <AddCompanies />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;