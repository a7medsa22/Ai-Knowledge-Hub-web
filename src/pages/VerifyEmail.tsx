import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Brain, KeyRound, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth";

const VerifyEmailPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const valid = email && otp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    try {
      await authService.verifyEmail({ email, otp });
      toast({
        title: "Email verified",
        description: "You can now sign in to your account.",
      });
      navigate("/login");
    } catch {
      toast({
        title: "Verification failed",
        description: "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    try {
      await authService.resendOtp({ email });
      toast({
        title: "Code resent",
        description: "If this email exists, a new code has been sent.",
      });
    } catch {
      toast({
        title: "Resend failed",
        description: "Unable to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-2">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code we sent to your email address.
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

          <Button
            type="submit"
            disabled={loading || !valid}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 h-11 gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Verifying…" : "Verify email"}
          </Button>
        </form>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="text-primary font-medium hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

