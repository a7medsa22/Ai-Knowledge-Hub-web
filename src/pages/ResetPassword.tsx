import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Brain, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordsMatch = password === confirm;
  const valid = email && otp && password.length >= 8 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, password });
      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      navigate("/login");
    } catch {
      toast({
        title: "Reset failed",
        description: "Invalid code or email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-2">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Reset password</h1>
          <p className="text-muted-foreground">
            Enter the code sent to your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-9 rounded-xl tracking-[0.3em]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 rounded-xl"
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`pl-9 rounded-xl ${confirm && !passwordsMatch ? "border-destructive" : ""}`}
                required
              />
            </div>
            {confirm && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !valid}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 h-11 gap-2"
          >
            <KeyRound className="h-4 w-4" />
            {loading ? "Updating password…" : "Update password"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Back to{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

