import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, TrendingUp, Upload, CheckCircle, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const DashboardPreview = () => {
  const achievements = [
    {
      title: "Machine Learning Certificate",
      issuer: "Stanford University",
      date: "Dec 2024",
      status: "verified",
      category: "Academic"
    },
    {
      title: "Hackathon Winner",
      issuer: "Tech Conference 2024", 
      date: "Nov 2024",
      status: "verified",
      category: "Competition"
    },
    {
      title: "Internship Completion",
      issuer: "Google Inc.",
      date: "Oct 2024", 
      status: "pending",
      category: "Professional"
    }
  ];

  const stats = [
    { label: "Total Achievements", value: "24", icon: Award, color: "primary" },
    { label: "Verified This Month", value: "8", icon: CheckCircle, color: "success" },
    { label: "Pending Review", value: "3", icon: Clock, color: "warning" },
    { label: "Portfolio Views", value: "156", icon: Users, color: "accent" }
  ];

  return (
    <section id="dashboard" className="py-20 subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Academic
            <span className="hero-gradient bg-clip-text text-transparent"> Dashboard</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get real-time insights into your achievements, track progress, and manage your academic portfolio from one central hub.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-achievement transition-all">
                  <div className="hero-gradient p-2 rounded-lg w-fit mx-auto mb-2">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Recent Achievements */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Recent Achievements</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="hero-gradient p-2 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-card-foreground">{achievement.title}</h4>
                        <Badge variant={achievement.status === 'verified' ? 'default' : 'secondary'}>
                          {achievement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.issuer} • {achievement.date}</p>
                    </div>
                    <Badge variant="outline">{achievement.category}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Semester Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Academic</span>
                    <span className="text-card-foreground">8/10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Extracurricular</span>
                    <span className="text-card-foreground">5/6</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Professional</span>
                    <span className="text-card-foreground">3/4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  View Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Upcoming</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-muted-foreground">Portfolio Review</span>
                  <span className="text-card-foreground ml-auto">Dec 15</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Certification Deadline</span>
                  <span className="text-card-foreground ml-auto">Dec 20</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Semester End</span>
                  <span className="text-card-foreground ml-auto">Dec 25</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};