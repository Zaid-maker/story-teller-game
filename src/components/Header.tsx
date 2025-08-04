import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Swords } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full p-4 border-b bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Swords className="h-6 w-6 text-primary" />
          <span>Adventure Quest</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/account">
            <Button variant="ghost">Account</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};