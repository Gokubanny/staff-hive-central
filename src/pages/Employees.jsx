import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddEmployee from "../components/AddEmployee";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { employees, deleteEmployee, updateEmployee } = useData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteEmployee(id);
      toast({
        title: "Employee deleted",
        description: `${name} has been removed successfully.`,
      });
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="px-6 py-8 ml-64">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
          <CardTitle className="text-lg" style={{fontSize: '1.8rem', marginBottom: '5px'}}>Employees List</CardTitle> 
          <p>Search and filter employees across all companies</p>
          </div>
          
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))", display: 'flex'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-gray-500">No employees found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(emp.salary)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(emp)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEmployee 
        isOpen={isAddDialogOpen} 
        onClose={handleCloseDialog}
        editingEmployee={editingEmployee}
      />
    </div>
  );
}




