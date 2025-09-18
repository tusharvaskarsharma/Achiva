import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Plus, ExternalLink, Calendar, Building, CheckCircle, Clock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  description?: string;
  issuer: string;
  issue_date?: string;
  certificate_url?: string;
  image_url?: string;
  category: string;
  is_verified: boolean;
  verified_at?: string;
  created_at: string;
}

interface SkillsShowcaseProps {
  onCertificateAdded?: () => void;
}

export const SkillsShowcase = ({ onCertificateAdded }: SkillsShowcaseProps) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issuer: "",
    issue_date: "",
    certificate_url: "",
    image_url: "",
    category: "other"
  });

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.issuer) {
      toast.error('Title and issuer are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('certificates')
        .insert([{
          ...formData,
          user_id: user?.id,
          issue_date: formData.issue_date || null
        }]);

      if (error) throw error;

      toast.success('Certificate added successfully!');
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        issuer: "",
        issue_date: "",
        certificate_url: "",
        image_url: "",
        category: "other"
      });
      fetchCertificates();
      onCertificateAdded?.();
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error('Failed to add certificate');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Certificate deleted successfully');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'academic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'technical': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'language': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'volunteer': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Skills & Achievements
            </CardTitle>
            <CardDescription>
              Showcase your certificates, awards, and achievements
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Certificate</DialogTitle>
                  <DialogDescription>
                    Add your certificates, awards, or achievements to showcase your skills.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Swimming Championship Gold Medal"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issuer">Issuer *</Label>
                    <Input
                      id="issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                      placeholder="e.g., State Swimming Association"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the achievement..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="certificate_url">Certificate URL</Label>
                    <Input
                      id="certificate_url"
                      type="url"
                      value={formData.certificate_url}
                      onChange={(e) => setFormData({...formData, certificate_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Certificate</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No certificates yet. Add your first achievement!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{certificate.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(certificate.category)}>
                          {certificate.category}
                        </Badge>
                        {certificate.is_verified ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {certificate.certificate_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(certificate.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {certificate.issuer}
                    </div>
                    {certificate.issue_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(certificate.issue_date).toLocaleDateString()}
                      </div>
                    )}
                    {certificate.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {certificate.description}
                      </p>
                    )}
                    {certificate.image_url && (
                      <div className="mt-3">
                        <img 
                          src={certificate.image_url} 
                          alt={certificate.title}
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {certificate.verified_at && (
                      <p className="text-xs text-muted-foreground">
                        Verified on {new Date(certificate.verified_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};