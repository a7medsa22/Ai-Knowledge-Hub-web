import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Brain, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      toast({
        title: "Reset email sent",
        description: "If this email exists, a code has been sent to it.",
      });
    } catch {
      toast({
        title: "Request failed",
        description: "Unable to send reset email. Please try again.",
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
          <h1 className="text-3xl font-bold tracking-tight">Forgot password</h1>
          <p className="text-muted-foreground">
            Enter your email and we will send you a reset code.
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

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 h-11 gap-2"
          >
            <KeyRound className="h-4 w-4" />
            {loading ? "Sending reset link…" : "Send reset code"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          Already have a code?{" "}
          <Link to="/reset-password" className="text-primary font-medium hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

