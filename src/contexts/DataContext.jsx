import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [payroll, setPayroll] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    const savedCompanies = localStorage.getItem('companies');
    const savedApplicants = localStorage.getItem('applicants');
    const savedPayroll = localStorage.getItem('payroll');

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Initialize with mock data only if no saved data
      const initialEmployees = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
          salary: 75000,
          status: 'active',
          hireDate: '2023-01-15',
          companyId: '1'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          position: 'Product Manager',
          department: 'Product',
          salary: 85000,
          status: 'active',
          hireDate: '2023-02-20',
          companyId: '1'
        }
      ];
      setEmployees(initialEmployees);
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      const initialCompanies = [
        {
          id: '1',
          name: 'Tech Corp',
          industry: 'Technology',
          size: '100-500',
          location: 'San Francisco, CA',
          founded: '2020'
        }
      ];
      setCompanies(initialCompanies);
      localStorage.setItem('companies', JSON.stringify(initialCompanies));
    }

    if (savedApplicants) {
      setApplicants(JSON.parse(savedApplicants));
    } else {
      const initialApplicants = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          position: 'Frontend Developer',
          stage: 'interview',
          appliedDate: '2024-01-10',
          resume: 'alice-resume.pdf'
        },
        {
          id: '2',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          position: 'Backend Developer',
          stage: 'screening',
          appliedDate: '2024-01-12',
          resume: 'bob-resume.pdf'
        }
      ];
      setApplicants(initialApplicants);
      localStorage.setItem('applicants', JSON.stringify(initialApplicants));
    }

    if (savedPayroll) {
      setPayroll(JSON.parse(savedPayroll));
    } else {
      const initialPayroll = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'John Doe',
          baseSalary: 75000,
          overtime: 2000,
          bonuses: 5000,
          deductions: 8000,
          totalAmount: 74000,
          processedDate: '2024-01-31',
          period: '2024-01'
        }
      ];
      setPayroll(initialPayroll);
      localStorage.setItem('payroll', JSON.stringify(initialPayroll));
    }
  }, []);

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      status: 'active'
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const updateEmployee = (id, updates) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, ...updates } : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const deleteEmployee = (id) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const addCompany = (company) => {
    const newCompany = {
      ...company,
      id: Date.now().toString()
    };
    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  };

  const updateCompany = (id, updates) => {
    const updatedCompanies = companies.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  };

  const deleteCompany = (id) => {
    const updatedCompanies = companies.filter(comp => comp.id !== id);
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  };

  const updateApplicantStage = (applicantId, newStage) => {
    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        const updatedApplicant = { ...applicant, stage: newStage };
        
        // If hired, automatically add to employees and payroll
        if (newStage === 'hired') {
          // Add to employees
          const newEmployee = {
            id: Date.now().toString(),
            name: applicant.name,
            email: applicant.email,
            phone: applicant.phone || '',
            position: applicant.position,
            department: applicant.department || 'General',
            salary: applicant.expectedSalary || 0,
            status: 'active',
            hiredDate: new Date().toISOString().split('T')[0],
            originalApplicantId: applicant.id
          };
          
          const updatedEmployees = [...employees, newEmployee];
          setEmployees(updatedEmployees);
          localStorage.setItem('employees', JSON.stringify(updatedEmployees));
          
          // Add to payroll for current month
          const currentDate = new Date();
          const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
          
          const baseSalary = newEmployee.salary;
          const bonuses = baseSalary * 0.1; // 10% bonus
          const taxDeduction = baseSalary * 0.075; // 7.5% tax
          const pensionDeduction = baseSalary * 0.08; // 8% pension
          const totalDeductions = taxDeduction + pensionDeduction;
          const netPay = baseSalary + bonuses - totalDeductions;
          
          const payrollRecord = {
            id: `${newEmployee.id}-${Date.now()}`,
            employeeId: newEmployee.id,
            employeeName: newEmployee.name,
            baseSalary: baseSalary,
            overtime: 0,
            bonuses: bonuses,
            deductions: totalDeductions,
            totalAmount: netPay,
            processedDate: currentDate.toISOString().split('T')[0],
            period: period,
            status: 'pending'
          };
          
          const updatedPayroll = [...payroll, payrollRecord];
          setPayroll(updatedPayroll);
          localStorage.setItem('payroll', JSON.stringify(updatedPayroll));
        }
        
        return updatedApplicant;
      }
      return applicant;
    });
    
    setApplicants(updatedApplicants);
    localStorage.setItem('applicants', JSON.stringify(updatedApplicants));
  };

  const addPayrollRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      processedDate: new Date().toISOString().split('T')[0]
    };
    const updatedPayroll = [...payroll, newRecord];
    setPayroll(updatedPayroll);
    localStorage.setItem('payroll', JSON.stringify(updatedPayroll));
  };

  const addApplicant = (applicant) => {
    const newApplicant = {
      ...applicant,
      id: Date.now().toString()
    };
    const updatedApplicants = [...applicants, newApplicant];
    setApplicants(updatedApplicants);
    localStorage.setItem('applicants', JSON.stringify(updatedApplicants));
  };

  const value = {
    employees,
    companies,
    applicants,
    payroll,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addCompany,
    updateCompany,
    deleteCompany,
    addApplicant,
    updateApplicantStage,
    addPayrollRecord
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};



