import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="hero-gradient p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Achiva</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#portfolio" className="text-muted-foreground hover:text-primary transition-colors">
              Portfolio
            </a>
            <a href="#analytics" className="text-muted-foreground hover:text-primary transition-colors">
              Analytics
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                {userRole === "admin" && (
                  <Link to="/admin">
                    <Button variant="secondary" className="transition-all duration-200 hover:scale-105">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  <User className="w-4 h-4 inline mr-1" />
                  {user.email}
                </span>
                <Button variant="outline" onClick={handleSignOut} className="transition-all duration-200 hover:scale-105">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="hero" className="transition-all duration-200 hover:scale-105">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-200 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors py-2">
                Features
              </a>
              <a href="#dashboard" className="text-muted-foreground hover:text-primary transition-colors py-2">
                Dashboard
              </a>
              <a href="#portfolio" className="text-muted-foreground hover:text-primary transition-colors py-2">
                Portfolio
              </a>
              <a href="#analytics" className="text-muted-foreground hover:text-primary transition-colors py-2">
                Analytics
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <div className="space-y-2">
                    {userRole === "admin" && (
                      <Link to="/admin">
                        <Button variant="secondary" className="justify-start w-full transition-all duration-200 hover:scale-105">
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Link to="/dashboard">
                      <Button variant="outline" className="justify-start w-full transition-all duration-200 hover:scale-105">
                        Dashboard
                      </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground px-2">
                      <User className="w-4 h-4 inline mr-1" />
                      {user.email}
                    </div>
                    <Button variant="outline" className="justify-start w-full transition-all duration-200 hover:scale-105" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="hero" className="justify-start w-full transition-all duration-200 hover:scale-105">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};