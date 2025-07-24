import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  company: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  hrContactName: string;
  hrContactEmail: string;
  hrContactPhone: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  company: string;
  resume?: string;
  coverLetter?: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  notes?: string;
}

export interface PayrollEntry {
  id: string;
  companyId: string;
  companyName: string;
  employeeCount: number;
  totalAmount: number;
  processedDate: string;
  payPeriod: string;
  status: 'pending' | 'processed' | 'completed';
}

interface UserData {
  employees: Employee[];
  companies: Company[];
  applicants: Applicant[];
  payroll: PayrollEntry[];
}

interface DataContextType {
  employees: Employee[];
  companies: Company[];
  applicants: Applicant[];
  payroll: PayrollEntry[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  removeCompany: (id: string) => void;
  addApplicant: (applicant: Omit<Applicant, 'id'>) => void;
  updateApplicant: (id: string, applicant: Partial<Applicant>) => void;
  removeApplicant: (id: string) => void;
  addPayrollEntry: (payroll: Omit<PayrollEntry, 'id'>) => void;
  updatePayrollEntry: (id: string, payroll: Partial<PayrollEntry>) => void;
  removePayrollEntry: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>({
    employees: [],
    companies: [],
    applicants: [],
    payroll: []
  });

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      const userData = localStorage.getItem(`userData_${user.id}`);
      if (userData) {
        setData(JSON.parse(userData));
      }
    } else {
      setData({
        employees: [],
        companies: [],
        applicants: [],
        payroll: []
      });
    }
  }, [user]);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`userData_${user.id}`, JSON.stringify(data));
    }
  }, [data, user]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setData(prev => ({ 
      ...prev, 
      employees: [...prev.employees, newEmployee] 
    }));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.map(emp => 
        emp.id === id ? { ...emp, ...updates } : emp
      )
    }));
  };

  const removeEmployee = (id: string) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== id)
    }));
  };

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setData(prev => ({ 
      ...prev, 
      companies: [...prev.companies, newCompany] 
    }));
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  };

  const removeCompany = (id: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.filter(comp => comp.id !== id)
    }));
  };

  const addApplicant = (applicant: Omit<Applicant, 'id'>) => {
    const newApplicant: Applicant = {
      ...applicant,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setData(prev => ({ 
      ...prev, 
      applicants: [...prev.applicants, newApplicant] 
    }));
  };

  const updateApplicant = (id: string, updates: Partial<Applicant>) => {
    setData(prev => ({
      ...prev,
      applicants: prev.applicants.map(app => 
        app.id === id ? { ...app, ...updates } : app
      )
    }));
  };

  const removeApplicant = (id: string) => {
    setData(prev => ({
      ...prev,
      applicants: prev.applicants.filter(app => app.id !== id)
    }));
  };

  const addPayrollEntry = (payroll: Omit<PayrollEntry, 'id'>) => {
    const newPayroll: PayrollEntry = {
      ...payroll,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setData(prev => ({ 
      ...prev, 
      payroll: [...prev.payroll, newPayroll] 
    }));
  };

  const updatePayrollEntry = (id: string, updates: Partial<PayrollEntry>) => {
    setData(prev => ({
      ...prev,
      payroll: prev.payroll.map(pay => 
        pay.id === id ? { ...pay, ...updates } : pay
      )
    }));
  };

  const removePayrollEntry = (id: string) => {
    setData(prev => ({
      ...prev,
      payroll: prev.payroll.filter(pay => pay.id !== id)
    }));
  };

  const value = {
    employees: data.employees,
    companies: data.companies,
    applicants: data.applicants,
    payroll: data.payroll,
    addEmployee,
    updateEmployee,
    removeEmployee,
    addCompany,
    updateCompany,
    removeCompany,
    addApplicant,
    updateApplicant,
    removeApplicant,
    addPayrollEntry,
    updatePayrollEntry,
    removePayrollEntry,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};