import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { AccountForm } from "@/components/settings/AccountForm";
import { AppearanceForm } from "@/components/settings/AppearanceForm";
import { ApiKeyCard } from "@/components/settings/ApiKeyCard";
import { SessionsCard } from "@/components/settings/SessionsCard";

const sections: Record<string, React.ReactNode> = {
  profile: <ProfileForm />,
  account: <AccountForm />,
  appearance: <AppearanceForm />,
  sessions: <SessionsCard />,
  api: <ApiKeyCard />,
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 shrink-0">
          <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>
        <div className="flex-1 min-w-0">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
