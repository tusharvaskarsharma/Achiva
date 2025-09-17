import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Shield, ExternalLink, TrendingUp, BarChart3, Target, Users, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  project_url: string;
  technologies: string[];
  status: 'completed' | 'in_progress' | 'planned';
  created_at: string;
}

interface Analytics {
  metric_name: string;
  metric_value: number;
  metric_date: string;
}

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (userRole === 'admin') {
        // Fetch all portfolios for admin view
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*')
          .order('created_at', { ascending: false });

        if (portfolioError) throw portfolioError;

        // Fetch all analytics for admin view
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .order('metric_date', { ascending: false });

        if (analyticsError) throw analyticsError;

        setPortfolios((portfolioData || []) as Portfolio[]);
        setAnalytics(analyticsData || []);
      } else {
        // Fetch user's own data for student view
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (portfolioError) throw portfolioError;

        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', user?.id)
          .order('metric_date', { ascending: false });

        if (analyticsError) throw analyticsError;

        setPortfolios((portfolioData || []) as Portfolio[]);
        setAnalytics(analyticsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalyticsValue = (metricName: string) => {
    const metric = analytics.find(a => a.metric_name === metricName);
    return metric ? metric.metric_value : 0;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              {userRole === 'admin' ? 'Manage the academic platform with Achiva' : 'Manage your academic journey with Achiva'}
            </p>
            {userRole === 'admin' && (
              <div className="flex justify-center gap-4">
                <Link to="/admin">
                  <Button variant="default" className="transition-all duration-200 hover:scale-105">
                    <Users className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="hero-gradient p-2 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-foreground">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                      <Badge variant="secondary" className="mt-1">
                        {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {userRole === 'admin' ? <GraduationCap className="h-5 w-5 text-muted-foreground" /> : <User className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="mt-1">
                        {userRole === 'admin' ? 'Admin (Faculty)' : 'Student'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Study Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{getAnalyticsValue('study_hours')}</div>
                <p className="text-muted-foreground text-sm">This week</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{getAnalyticsValue('assignments_completed')}</div>
                <p className="text-muted-foreground text-sm">Completed</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{portfolios.filter(p => p.status === 'in_progress').length}</div>
                <p className="text-muted-foreground text-sm">In progress</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{getAnalyticsValue('achievements_earned')}</div>
                <p className="text-muted-foreground text-sm">Milestones reached</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Section */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {userRole === 'admin' ? 'All Student Portfolios' : 'Your Portfolio'}
                  </CardTitle>
                  <CardDescription>
                    {userRole === 'admin' 
                      ? 'View and manage all student projects and achievements' 
                      : 'Showcase your academic projects and achievements'
                    }
                  </CardDescription>
                </div>
                {userRole !== 'admin' && <AddProjectDialog onProjectAdded={fetchUserData} />}
              </div>
            </CardHeader>
            <CardContent>
              {portfolios.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects yet. Start by adding your first project!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {portfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                            <Badge 
                              variant={portfolio.status === 'completed' ? 'default' : portfolio.status === 'in_progress' ? 'secondary' : 'outline'}
                              className="mt-2"
                            >
                              {portfolio.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {portfolio.project_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-3">{portfolio.description}</p>
                        {portfolio.technologies && portfolio.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {portfolio.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {userRole === 'admin' ? 'System Analytics' : 'Your Analytics'}
              </CardTitle>
              <CardDescription>
                {userRole === 'admin' 
                  ? 'Monitor overall academic progress and performance across all students'
                  : 'Track your academic progress and performance'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No analytics data yet. Start tracking your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium capitalize">{metric.metric_name.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(metric.metric_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-primary">{metric.metric_value}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;