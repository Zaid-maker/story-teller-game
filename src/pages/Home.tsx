import { useAuth } from "@/components/AuthProvider";
import { PageLoader } from "@/components/PageLoader";
import { AuthenticatedApp } from "@/components/AuthenticatedApp";
import { UnauthenticatedApp } from "@/components/UnauthenticatedApp";

const Home = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return session ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default Home;