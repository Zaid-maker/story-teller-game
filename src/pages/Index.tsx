import { MadeWithDyad } from "@/components/made-with-dyad";
import StoryGame from "@/components/StoryGame";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
      <div className="absolute top-4 right-4">
        <Link to="/account">
          <Button variant="outline">Account</Button>
        </Link>
      </div>
      <StoryGame />
      <MadeWithDyad />
    </div>
  );
};

export default Index;