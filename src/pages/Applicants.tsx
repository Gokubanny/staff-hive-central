import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Mail,
  Phone,
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle,
  UserCheck,
  MessageSquare
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock applicants data
const applicants = [
  {
    id: "APP001",
    name: "John Smith",
    email: "john.smith@email.com", 
    phone: "+234 801 234 5678",
    position: "Frontend Developer",
    experience: "3 years",
    appliedDate: "2024-01-15",
    stage: "applied",
    avatar: null,
    resume: "john_smith_resume.pdf",
    notes: "Strong React experience"
  },
  {
    id: "APP002",
    name: "Mary Johnson", 
    email: "mary.johnson@email.com",
    phone: "+234 802 345 6789",
    position: "HR Specialist",
    experience: "5 years",
    appliedDate: "2024-01-12",
    stage: "interviewing",
    avatar: null,
    resume: "mary_johnson_resume.pdf",
    notes: "Excellent communication skills"
  },
  {
    id: "APP003",
    name: "Ahmed Ibrahim",
    email: "ahmed.ibrahim@email.com",
    phone: "+234 803 456 7890", 
    position: "Backend Developer",
    experience: "4 years",
    appliedDate: "2024-01-10",
    stage: "offered",
    avatar: null,
    resume: "ahmed_ibrahim_resume.pdf",
    notes: "Strong Node.js and Python background"
  },
  {
    id: "APP004",
    name: "Grace Okafor",
    email: "grace.okafor@email.com",
    phone: "+234 804 567 8901",
    position: "Product Manager",
    experience: "6 years",
    appliedDate: "2024-01-08",
    stage: "hired",
    avatar: null,
    resume: "grace_okafor_resume.pdf", 
    notes: "Great product vision and leadership"
  },
  {
    id: "APP005",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@email.com",
    phone: "+234 805 678 9012",
    position: "Data Analyst", 
    experience: "2 years",
    appliedDate: "2024-01-18",
    stage: "applied",
    avatar: null,
    resume: "emeka_nwosu_resume.pdf",
    notes: "Fresh graduate with internship experience"
  }
]

const stages = [
  { id: "applied", label: "Applied", icon: FileText, color: "bg-blue-500" },
  { id: "interviewing", label: "Interviewing", icon: MessageSquare, color: "bg-yellow-500" },
  { id: "offered", label: "Offered", icon: CheckCircle, color: "bg-green-500" },
  { id: "hired", label: "Hired", icon: UserCheck, color: "bg-emerald-500" }
]

export default function Applicants() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStage, setFilterStage] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)

  const addForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: "",
      notes: "",
    },
  })

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = filterStage === "all" || applicant.stage === filterStage
    
    return matchesSearch && matchesStage
  })

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const getStageInfo = (stage: string) => {
    return stages.find(s => s.id === stage) || stages[0]
  }

  const getStageColor = (stage: string) => {
    switch(stage) {
      case "applied": return "bg-blue-500 text-white"
      case "interviewing": return "bg-yellow-500 text-white"
      case "offered": return "bg-green-500 text-white"
      case "hired": return "bg-emerald-500 text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const handleAddApplicant = (data: any) => {
    console.log("Adding applicant:", data)
    addForm.reset()
    setIsAddDialogOpen(false)
  }

  const handleViewApplicant = (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsViewDialogOpen(true)
  }

  const handleMoveStage = (applicant: any, newStage: string) => {
    console.log(`Moving ${applicant.name} to ${newStage}`)
  }

  const getApplicantsByStage = (stage: string) => {
    return applicants.filter(app => app.stage === stage)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Applicant Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Manage job applications and track candidates through the hiring process
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Add Applicant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Applicant</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddApplicant)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Applied</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 3 years" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Additional notes about the applicant" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Applicant</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const count = getApplicantsByStage(stage.id).length
          const StageIcon = stage.icon
          return (
            <Card key={stage.id} className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full ${stage.color} flex items-center justify-center`}>
                    <StageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">{stage.label}</p>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Applicant Management */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stages.map((stage) => {
              const stageApplicants = getApplicantsByStage(stage.id)
              const StageIcon = stage.icon
              return (
                <Card key={stage.id} className="shadow-card border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <div className={`h-6 w-6 rounded-full ${stage.color} flex items-center justify-center mr-2`}>
                        <StageIcon className="h-3 w-3 text-white" />
                      </div>
                      {stage.label} ({stageApplicants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageApplicants.map((applicant) => (
                      <Card key={applicant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={applicant.avatar || ""} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(applicant.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{applicant.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{applicant.position}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {applicant.experience} experience
                          </div>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleViewApplicant(applicant)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {stage.id !== "hired" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {stages.filter(s => s.id !== stage.id).map((nextStage) => (
                                    <DropdownMenuItem 
                                      key={nextStage.id}
                                      onClick={() => handleMoveStage(applicant, nextStage.id)}
                                    >
                                      Move to {nextStage.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {stageApplicants.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No applicants in this stage</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription>
                View and manage all job applications in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredApplicants.map((applicant) => (
                  <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={applicant.avatar || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {getInitials(applicant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-lg">{applicant.name}</div>
                            <div className="text-muted-foreground">{applicant.position}</div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {applicant.email}
                              <Phone className="h-3 w-3 ml-4 mr-1" />
                              {applicant.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge className={getStageColor(applicant.stage)}>
                              {getStageInfo(applicant.stage).label}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewApplicant(applicant)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredApplicants.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No applicants found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first applicant"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Applicant Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Profile</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplicant.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                    {getInitials(selectedApplicant.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                  <p className="text-muted-foreground">{selectedApplicant.position}</p>
                  <Badge className={`${getStageColor(selectedApplicant.stage)} mt-2`}>
                    {getStageInfo(selectedApplicant.stage).label}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedApplicant.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{selectedApplicant.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="text-sm">{selectedApplicant.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Applied Date</p>
                  <p className="text-sm">{new Date(selectedApplicant.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{selectedApplicant.notes}</p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}