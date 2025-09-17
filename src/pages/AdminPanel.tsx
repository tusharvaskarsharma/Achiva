import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, BarChart3, Settings } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();

  const adminStats = [
    {
      title: "Total Students",
      value: "156",
      icon: Users,
      description: "Active student accounts"
    },
    {
      title: "Faculty Members", 
      value: "12",
      icon: GraduationCap,
      description: "Admin accounts"
    },
    {
      title: "Achievements Tracked",
      value: "847",
      icon: BarChart3,
      description: "Total achievements in system"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                View and manage student accounts and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access comprehensive student data, review submissions, and manage achievement approvals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                Monitor platform usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View detailed analytics about platform usage, popular achievements, and system performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Templates</CardTitle>
              <CardDescription>
                Create and manage achievement templates for students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Design achievement categories and templates that students can use to track their progress.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports & Export</CardTitle>
              <CardDescription>
                Generate reports and export data for institutional use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create comprehensive reports and export student data for academic records and analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;