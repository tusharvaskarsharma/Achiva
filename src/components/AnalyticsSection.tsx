import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Award, Users, BarChart3, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const AnalyticsSection = () => {
  const monthlyData = [
    { month: "Jan", achievements: 4, verified: 3 },
    { month: "Feb", achievements: 6, verified: 5 },
    { month: "Mar", achievements: 3, verified: 3 },
    { month: "Apr", achievements: 8, verified: 7 },
    { month: "May", achievements: 5, verified: 4 },
    { month: "Jun", achievements: 9, verified: 8 },
    { month: "Jul", achievements: 7, verified: 6 },
    { month: "Aug", achievements: 12, verified: 11 },
    { month: "Sep", achievements: 6, verified: 5 },
    { month: "Oct", achievements: 10, verified: 9 },
    { month: "Nov", achievements: 8, verified: 7 },
    { month: "Dec", achievements: 11, verified: 10 }
  ];

  const categoryData = [
    { name: "Academic", value: 35, color: "#3b82f6" },
    { name: "Professional", value: 25, color: "#8b5cf6" },
    { name: "Extracurricular", value: 20, color: "#10b981" },
    { name: "Research", value: 15, color: "#f59e0b" },
    { name: "Volunteer", value: 5, color: "#ef4444" }
  ];

  const progressData = [
    { semester: "Fall 2023", score: 75 },
    { semester: "Spring 2024", score: 82 },
    { semester: "Fall 2024", score: 89 },
    { semester: "Current", score: 93 }
  ];

  const recentAchievements = [
    { title: "Machine Learning Certificate", type: "Academic", trend: "+15%" },
    { title: "Hackathon Winner", type: "Competition", trend: "+8%" },
    { title: "Research Publication", type: "Academic", trend: "+22%" }
  ];

  return (
    <section id="analytics" className="py-20 subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Analytics &
            <span className="hero-gradient bg-clip-text text-transparent"> Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your progress with detailed analytics showing participation trends, 
            achievement patterns, and performance highlights over time.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Analytics */}
          <div className="lg:col-span-8 space-y-8">
            {/* Achievement Trends */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Achievement Trends</h3>
                <Badge variant="outline">Last 12 months</Badge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Bar dataKey="achievements" fill="hsl(var(--primary))" radius={4} />
                    <Bar dataKey="verified" fill="hsl(var(--success))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-muted-foreground">Total Achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span className="text-muted-foreground">Verified</span>
                </div>
              </div>
            </Card>

            {/* Progress Over Time */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Performance Progress</h3>
                <Badge variant="outline">Academic Score</Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="semester" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Sidebar Analytics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Achievement Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Achievement Categories</h3>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-muted-foreground">{category.name}</span>
                    </div>
                    <span className="text-card-foreground font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="hero-gradient p-2 rounded-lg">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Verification Rate</span>
                  </div>
                  <span className="text-lg font-semibold text-card-foreground">94%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="hero-gradient p-2 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Growth Rate</span>
                  </div>
                  <span className="text-lg font-semibold text-success">+23%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="hero-gradient p-2 rounded-lg">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Goal Progress</span>
                  </div>
                  <span className="text-lg font-semibold text-card-foreground">8/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="hero-gradient p-2 rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Portfolio Views</span>
                  </div>
                  <span className="text-lg font-semibold text-card-foreground">156</span>
                </div>
              </div>
            </Card>

            {/* Recent Highlights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Highlights</h3>
              <div className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-card-foreground text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.type}</div>
                    </div>
                    <Badge variant="secondary" className="text-success">
                      {achievement.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};