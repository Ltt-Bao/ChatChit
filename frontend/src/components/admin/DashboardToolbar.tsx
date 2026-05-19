import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DashboardToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardToolbar({
  searchTerm,
  onSearchChange,
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background p-4 rounded-lg shadow-sm border">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, username, email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}