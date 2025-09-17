import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  project_url: string;
  technologies: string[];
  status: string;
  created_at: string;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  review_comments: string | null;
  user_id: string;
}

interface ProjectReviewDialogProps {
  project: Portfolio;
  onReviewComplete: () => void;
  children: React.ReactNode;
}

export const ProjectReviewDialog = ({ project, onReviewComplete, children }: ProjectReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(project.review_comments || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (verified: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({
          is_verified: verified,
          verified_by: verified ? (await supabase.auth.getUser()).data.user?.id : null,
          verified_at: verified ? new Date().toISOString() : null,
          review_comments: comments.trim() || null
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: verified ? "Project Verified" : "Verification Removed",
        description: verified 
          ? "The project has been successfully verified." 
          : "The project verification has been removed.",
      });

      setOpen(false);
      onReviewComplete();
    } catch (error) {
      console.error('Error updating project verification:', error);
      toast({
        title: "Error",
        description: "Failed to update project verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Review Project: {project.title}
          </DialogTitle>
          <DialogDescription>
            Review and verify this student project submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Project Details */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  {project.is_verified ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
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
              {project.project_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Project
                  </a>
                </Button>
              )}
            </div>
            
            <p className="text-muted-foreground mb-3">{project.description}</p>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-3">
              Submitted on {new Date(project.created_at).toLocaleDateString()}
            </p>
            
            {project.verified_at && (
              <p className="text-xs text-muted-foreground">
                Previously verified on {new Date(project.verified_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Review Comments */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Review Comments (Optional)
            </label>
            <Textarea
              placeholder="Add feedback or comments about this project..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {project.is_verified && (
            <Button
              variant="destructive"
              onClick={() => handleVerify(false)}
              disabled={loading}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Remove Verification
            </Button>
          )}
          <Button
            onClick={() => handleVerify(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {project.is_verified ? "Update Verification" : "Verify Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};