import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesFabProps {
  onClick: () => void;
}

export function NotesFab({ onClick }: NotesFabProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200 z-50"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
