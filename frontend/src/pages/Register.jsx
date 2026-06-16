import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "../components/AlertBanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to register");
    } finally {
      setLoading(true); // Keep loading true while navigating
    }
  };

  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border shadow-lg pb-0">
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <img src={logoSrc} alt="SpendWise Logo" className="w-12 h-12 dark-invert" />
            </Link>
            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Create an account
              </h2>
              <p className="text-muted-foreground">
                Welcome! Create an account to get started.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            {error && <AlertBanner message={error} type="danger" />}
            
            <form onSubmit={handleSubmit} className="space-y-6">


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Min. 6 characters</p>
              </div>



              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
                {loading ? "Creating account..." : "Create free account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t !py-4">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
