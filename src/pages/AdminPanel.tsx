import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BarChart3, Settings, FolderOpen, TrendingUp, Calendar, Award, LogOut, CheckCircle, Clock, Eye, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { ProjectReviewDialog } from "@/components/ProjectReviewDialog";
import { CertificateReviewDialog } from "@/components/CertificateReviewDialog";

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAdmins: 0,
    totalProjects: 0,
    totalAnalytics: 0,
    recentProjects: 0,
    activeProjects: 0,
    totalCertificates: 0,
    pendingCertificates: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch user role counts
      const { count: studentCount, error: studentError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      const { count: adminCount, error: adminError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Fetch portfolio counts
      const { count: portfolioCount, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true });

      const { count: activeProjectsCount, error: activeProjectsError } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');

      // Fetch recent projects (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentProjectsCount, error: recentError } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch analytics count
      const { count: analyticsCount, error: analyticsError } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true });

      // Fetch certificate counts
      const { count: certificatesCount, error: certificatesError } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCertificatesCount, error: pendingCertificatesError } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false);

      // Check for errors
      if (studentError) console.error('Student count error:', studentError);
      if (adminError) console.error('Admin count error:', adminError);
      if (portfolioError) console.error('Portfolio count error:', portfolioError);
      if (activeProjectsError) console.error('Active projects error:', activeProjectsError);
      if (recentError) console.error('Recent projects error:', recentError);
      if (analyticsError) console.error('Analytics count error:', analyticsError);
      if (certificatesError) console.error('Certificates count error:', certificatesError);
      if (pendingCertificatesError) console.error('Pending certificates error:', pendingCertificatesError);

      // Fetch recent projects details for display
      const { data: recentProjectsData } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch all projects for review
      const { data: allProjectsData } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all certificates for review
      const { data: allCertificatesData } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      setStats({
        totalStudents: studentCount || 0,
        totalAdmins: adminCount || 0,
        totalProjects: portfolioCount || 0,
        totalAnalytics: analyticsCount || 0,
        recentProjects: recentProjectsCount || 0,
        activeProjects: activeProjectsCount || 0,
        totalCertificates: certificatesCount || 0,
        pendingCertificates: pendingCertificatesCount || 0
      });

      setRecentProjects(recentProjectsData || []);
      setAllProjects(allProjectsData || []);
      setAllCertificates(allCertificatesData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const adminStats = [
    {
      title: "Total Students",
      value: loading ? "..." : stats.totalStudents.toString(),
      icon: Users,
      description: "Active student accounts",
      change: "+5 this week"
    },
    {
      title: "Faculty Members", 
      value: loading ? "..." : stats.totalAdmins.toString(),
      icon: GraduationCap,
      description: "Admin accounts",
      change: "No change"
    },
    {
      title: "Total Projects",
      value: loading ? "..." : stats.totalProjects.toString(),
      icon: FolderOpen,
      description: "Student portfolios",
      change: `+${stats.recentProjects} this week`
    },
    {
      title: "Active Projects",
      value: loading ? "..." : stats.activeProjects.toString(),
      icon: TrendingUp,
      description: "In progress",
      change: "Currently active"
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
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin Access
              </Badge>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-xs text-primary mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
                <CardDescription>Latest student project submissions</CardDescription>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading recent projects...</p>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent projects found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : project.status === 'in_progress' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {project.project_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <FolderOpen className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

          {/* Admin Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Management
                </CardTitle>
                <CardDescription>
                  View and manage student accounts and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access comprehensive student data, review submissions, and manage achievement approvals.
                </p>
                <div className="flex gap-2">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">View Dashboard</Button>
                  </Link>
                  <Badge variant="secondary">{stats.totalStudents} Students</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>
                  Monitor platform usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View detailed analytics about platform usage, popular achievements, and system performance.
                </p>
                <div className="flex gap-2">
                  <Link to="/dashboard#analytics">
                    <Button variant="outline" size="sm">View Analytics</Button>
                  </Link>
                  <Badge variant="secondary">{stats.totalAnalytics} Metrics</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Review Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Project Review & Verification
                  </CardTitle>
                  <CardDescription>Review and verify student project submissions</CardDescription>
                </div>
                <Badge variant="secondary">
                  {allProjects.filter(p => !p.is_verified).length} Pending Review
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading projects...</p>
                </div>
              ) : allProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allProjects.slice(0, 10).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            {project.is_verified ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending Review
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{project.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
                          {project.verified_at && (
                            <span>Verified: {new Date(project.verified_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.project_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                              <FolderOpen className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <ProjectReviewDialog project={project} onReviewComplete={fetchAdminData}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </ProjectReviewDialog>
                      </div>
                    </div>
                  ))}
                  {allProjects.length > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 of {allProjects.length} projects
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificate Review Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificate Review & Verification
                  </CardTitle>
                  <CardDescription>Review and verify student certificate submissions</CardDescription>
                </div>
                <Badge variant="secondary">
                  {allCertificates.filter(c => !c.is_verified).length} Pending Review
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading certificates...</p>
                </div>
              ) : allCertificates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No certificates found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCertificates.slice(0, 10).map((certificate) => (
                    <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{certificate.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {certificate.category.replace('_', ' ')}
                            </Badge>
                            {certificate.is_verified ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending Review
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-1">Issued by: {certificate.issuer}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Submitted: {new Date(certificate.created_at).toLocaleDateString()}</span>
                          {certificate.verified_at && (
                            <span>Verified: {new Date(certificate.verified_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {certificate.certificate_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <CertificateReviewDialog certificate={certificate} onReviewComplete={fetchAdminData}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </CertificateReviewDialog>
                      </div>
                    </div>
                  ))}
                  {allCertificates.length > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 of {allCertificates.length} certificates
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Admin Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificate Statistics
                </CardTitle>
                <CardDescription>
                  Overview of student certificate submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Verified Certificates:</span>
                    <span className="font-medium">
                      {allCertificates.filter(c => c.is_verified).length} / {allCertificates.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Review:</span>
                    <span className="font-medium text-orange-600">
                      {allCertificates.filter(c => !c.is_verified).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Categories:</span>
                    <span className="font-medium">
                      {new Set(allCertificates.map(c => c.category)).size}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Reports & Export
                </CardTitle>
                <CardDescription>
                  Generate reports and export data for institutional use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create comprehensive reports and export student data for academic records and analysis.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                  <Badge variant="outline">Export Tools</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
};

export default AdminPanel;