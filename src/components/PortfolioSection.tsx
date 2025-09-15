import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Award, Calendar, MapPin, Star } from "lucide-react";

export const PortfolioSection = () => {
  const portfolioData = {
    student: {
      name: "Sarah Johnson",
      university: "Stanford University",
      major: "Computer Science",
      gpa: "3.8",
      graduation: "May 2025"
    },
    achievements: [
      {
        title: "Machine Learning Specialization",
        issuer: "Stanford University",
        date: "December 2024",
        type: "Academic",
        verified: true,
        description: "Completed comprehensive ML course covering algorithms, neural networks, and deep learning."
      },
      {
        title: "Best Innovation Award",
        issuer: "TechCrunch Hackathon 2024",
        date: "November 2024", 
        type: "Competition",
        verified: true,
        description: "Won first place for developing an AI-powered sustainability tracking app."
      },
      {
        title: "Software Engineering Intern",
        issuer: "Google Inc.",
        date: "June - August 2024",
        type: "Professional",
        verified: true,
        description: "Contributed to Google Search infrastructure, improving query performance by 15%."
      },
      {
        title: "Research Assistant",
        issuer: "Stanford AI Lab",
        date: "January - May 2024",
        type: "Research",
        verified: true,
        description: "Assisted in research on natural language processing and published 2 papers."
      }
    ],
    skills: ["Python", "Machine Learning", "React", "Node.js", "TensorFlow", "AWS"],
    projects: [
      {
        title: "AI Study Buddy",
        description: "Personalized learning assistant using GPT-4",
        tech: ["React", "Python", "OpenAI API"]
      },
      {
        title: "EcoTracker",
        description: "Sustainability tracking mobile app",
        tech: ["React Native", "Firebase", "Node.js"]
      }
    ]
  };

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Digital
            <span className="hero-gradient bg-clip-text text-transparent"> Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Auto-generated professional portfolios showcasing all your verified achievements, 
            ready to share with employers or academic institutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Portfolio Preview */}
          <Card className="p-8 shadow-elegant">
            {/* Header */}
            <div className="border-b border-border pb-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-card-foreground">{portfolioData.student.name}</h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    {portfolioData.student.major} • {portfolioData.student.university}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      GPA: {portfolioData.student.gpa}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {portfolioData.student.graduation}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button variant="hero">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">Achievements & Certifications</h2>
              <div className="space-y-4">
                {portfolioData.achievements.map((achievement, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="hero-gradient p-2 rounded-lg">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-card-foreground">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.issuer} • {achievement.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground ml-11">{achievement.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={achievement.verified ? "default" : "secondary"}>
                          {achievement.verified ? "Verified" : "Pending"}
                        </Badge>
                        <Badge variant="outline">{achievement.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Projects */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Skills */}
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Featured Projects</h3>
                <div className="space-y-3">
                  {portfolioData.projects.map((project, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <h4 className="font-medium text-card-foreground">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-6 mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Generated on {new Date().toLocaleDateString()} • Verified by AcademicTracker Platform
              </p>
            </div>
          </Card>

          {/* Portfolio Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center hover:shadow-achievement transition-all">
              <div className="hero-gradient p-3 rounded-full w-fit mx-auto mb-4">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">PDF Export</h3>
              <p className="text-sm text-muted-foreground">Download professional PDF portfolios for job applications</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-achievement transition-all">
              <div className="hero-gradient p-3 rounded-full w-fit mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">Shareable Links</h3>
              <p className="text-sm text-muted-foreground">Create public links to showcase your achievements online</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-achievement transition-all">
              <div className="hero-gradient p-3 rounded-full w-fit mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Portfolios automatically update when new achievements are verified</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};