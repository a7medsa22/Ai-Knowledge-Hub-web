import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users";
import { useToast } from "@/hooks/use-toast";

export function ProfileForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: usersService.getProfile,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dirty, setDirty] = useState(false);

  const updateMutation = useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setDirty(false);
      toast({ title: "Profile updated" });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (profile && !dirty && !name && !email) {
    setName(profile.name);
    setEmail(profile.email);
  }

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
            {profile?.name
              ?.split(" ")
              .map((p) => p[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" className="rounded-xl">Change Avatar</Button>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={handleChange(setName)}
            className="rounded-xl"
            disabled={isLoading || updateMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleChange(setEmail)}
            className="rounded-xl"
            disabled
          />
          <p className="text-xs text-muted-foreground">Used for notifications and account recovery</p>
        </div>
        <Button
          disabled={!dirty || updateMutation.isPending}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 disabled:opacity-50"
          onClick={() => updateMutation.mutate({ name })}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
