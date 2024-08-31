import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { LoginButton } from "@/components/buttons/login-button";
import { LogoutButton } from "@/components/buttons/logout-button";
import { SignupButton } from "@/components/buttons/signup-button";
import { buttonVariants } from "@/components/ui/button";


export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <header className="bg-gray-100  p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        ジェンダーバイアス検出
      </Link>
      <div className="flex space-x-2">
        {!isAuthenticated ? (
          <>
            <SignupButton />
            <LoginButton />
          </>
        ) : (
          <>
          <Link to="/detector" className={buttonVariants({ variant: "outline" })}>
              検出
            </Link>

            <Link to="/realtime-detector" className={buttonVariants({ variant: "outline" })}>
              リアルタイム検出
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  );
};
