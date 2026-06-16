import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "../components/AlertBanner";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="mx-auto w-full max-w-xs space-y-6 animate-fade-in-up">
        <div className="space-y-2 text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <img src={logoSrc} alt="SpendWise Logo" className="mx-auto h-16 w-16 dark-invert" />
          </Link>
          <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to access to your dashboard, settings and projects.
          </p>
        </div>

        {error && <AlertBanner message={error} type="danger" />}

        <div className="space-y-5">
          <Button variant="outline" className="w-full justify-center gap-2">
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
            </svg>
            Sign in with Google
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              or sign in with email
            </span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2.5">
                <Input
                  id="email"
                  className="peer !ps-12"
                  placeholder="ephraim@blocks.so"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative mt-2.5">
                <Input
                  id="password"
                  className="!ps-12 pe-10"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none focus:z-10 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                >
                  {isVisible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>



            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
